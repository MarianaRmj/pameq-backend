// src/google/google-oauth.service.ts
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleToken } from './entities/google-token.entity';

@Injectable()
export class GoogleOAuthService {
  constructor(
    @InjectRepository(GoogleToken)
    private readonly repo: Repository<GoogleToken>,
  ) {}

  private getClient() {
    return new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URI,
    );
  }

  generateAuthUrl() {
    const oauth2 = this.getClient();
    return oauth2.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: true,
      scope: ['https://www.googleapis.com/auth/drive.file'],
    });
  }

  async handleCallback(userId: number, code: string) {
    const oauth2 = this.getClient();
    const { tokens } = await oauth2.getToken(code);

    let row = await this.repo.findOne({ where: { userId } });
    if (!row) row = this.repo.create({ userId });

    row.access_token = tokens.access_token ?? row.access_token ?? null;
    row.refresh_token = tokens.refresh_token ?? row.refresh_token ?? null;
    row.scope = tokens.scope ?? row.scope ?? null;
    row.token_type = tokens.token_type ?? row.token_type ?? null;
    row.expiry_date = tokens.expiry_date
      ? String(tokens.expiry_date)
      : (row.expiry_date ?? null);

    await this.repo.save(row);
    return true;
  }

  /** Devuelve un OAuth2Client con credenciales persistidas; null si el usuario no autorizó */
  async getAuthorizedClient(userId: number) {
    const row = await this.repo.findOne({ where: { userId } });
    if (!row) return null;

    const oauth2 = this.getClient();
    oauth2.setCredentials({
      access_token: row.access_token ?? undefined,
      refresh_token: row.refresh_token ?? undefined,
      scope: row.scope ?? undefined,
      token_type: row.token_type ?? undefined,
      expiry_date: row.expiry_date ? Number(row.expiry_date) : undefined,
    });
    return oauth2;
  }
}
