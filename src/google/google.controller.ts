// src/google/google.controller.ts
import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { GoogleOAuthService } from './google-oauth.service';

const OWNER_USER_ID = Number(process.env.GOOGLE_OAUTH_OWNER_USER_ID ?? 1);

@Controller('google')
export class GoogleController {
  constructor(private readonly gauth: GoogleOAuthService) {}

  @Get('auth')
  auth(@Res() res: Response) {
    const url = this.gauth.generateAuthUrl();
    return res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    await this.gauth.handleCallback(OWNER_USER_ID, code);
    return res.send('✅ Google Drive conectado. Ya puedes subir archivos.');
  }
}
