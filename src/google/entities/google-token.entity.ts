// src/google/google-token.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('google_token')
@Unique(['userId'])
export class GoogleToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number;

  @Column('text', { nullable: true })
  access_token: string | null;

  @Column('text', { nullable: true })
  refresh_token: string | null;

  @Column('text', { nullable: true })
  scope: string | null;

  @Column('text', { nullable: true })
  token_type: string | null;

  /** epoch ms como string para evitar problemas bigint */
  @Column('bigint', { nullable: true })
  expiry_date: string | null;
}
