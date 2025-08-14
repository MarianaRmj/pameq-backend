// src/storage/google-drive.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { Readable } from 'stream';
import { GoogleOAuthService } from 'src/google/google-oauth.service';

function bufferToStream(buffer: Buffer) {
  const r = new Readable();
  r.push(buffer);
  r.push(null);
  return r;
}

@Injectable()
export class GoogleDriveService {
  private defaultParent = process.env.DRIVE_PARENT_FOLDER_ID || undefined;

  constructor(private readonly gauth: GoogleOAuthService) {}

  private async getDrive(userId: number): Promise<drive_v3.Drive> {
    const oauth2 = await this.gauth.getAuthorizedClient(userId);
    if (!oauth2) {
      throw new UnauthorizedException(
        'Conecta tu Google Drive primero en /google/auth',
      );
    }
    return google.drive({ version: 'v3', auth: oauth2 });
  }

  /** Busca o crea una carpeta en “Mi unidad” del usuario */
  async ensureFolder(
    userId: number,
    name: string,
    parentId = this.defaultParent,
  ) {
    const drive = await this.getDrive(userId);

    const q = [
      `name='${name.replace(/'/g, "\\'")}'`,
      `mimeType='application/vnd.google-apps.folder'`,
      parentId ? `'${parentId}' in parents` : undefined,
      `trashed=false`,
    ]
      .filter(Boolean)
      .join(' and ');

    const { data } = await drive.files.list({
      q,
      fields: 'files(id,name)',
    });

    if (data.files?.[0]?.id) return data.files[0].id;

    const res = await drive.files.create({
      requestBody: {
        name,
        parents: parentId ? [parentId] : undefined,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id',
    });

    return res.data.id!;
  }

  /** Sube un Buffer a “Mi unidad” del usuario */
  async uploadBuffer(
    userId: number,
    opts: {
      buffer: Buffer;
      filename: string;
      mimeType: string;
      parentId?: string;
      makeAnyoneReader?: boolean;
    },
  ) {
    const {
      buffer,
      filename,
      mimeType,
      parentId,
      makeAnyoneReader = false,
    } = opts;
    const drive = await this.getDrive(userId);

    const res = await drive.files.create({
      requestBody: {
        name: filename,
        parents: parentId ? [parentId] : undefined,
      },
      media: {
        mimeType,
        body: bufferToStream(buffer) as NodeJS.ReadableStream,
      },
      fields: 'id, name, mimeType, size, webViewLink, webContentLink',
    });

    const fileId = res.data.id!;
    if (makeAnyoneReader) {
      await drive.permissions
        .create({
          fileId,
          requestBody: { role: 'reader', type: 'anyone' },
        })
        .catch(() => {});
    }

    return {
      fileId,
      name: res.data.name ?? filename,
      mimeType: res.data.mimeType ?? mimeType,
      size: Number(res.data.size ?? buffer.length),
      webViewLink: res.data.webViewLink ?? '',
      webContentLink: res.data.webContentLink ?? '',
    };
  }
}
