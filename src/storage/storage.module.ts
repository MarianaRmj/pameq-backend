import { Module } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { GoogleModule } from 'src/google/google.module'; // 👈 requiere esto

@Module({
  imports: [GoogleModule], // necesario para inyectar GoogleOAuthService
  providers: [GoogleDriveService],
  exports: [GoogleDriveService], // permite usarlo fuera
})
export class StorageModule {}
