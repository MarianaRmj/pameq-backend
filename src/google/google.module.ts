// src/google/google.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleToken } from './entities/google-token.entity';
import { GoogleOAuthService } from './google-oauth.service';
import { GoogleController } from './google.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GoogleToken])],
  providers: [GoogleOAuthService],
  controllers: [GoogleController],
  exports: [GoogleOAuthService, TypeOrmModule],
})
export class GoogleModule {}
