import { Injectable } from '@nestjs/common';

@Injectable()
export class PamecService {
  findAll() {
    return `This action returns all pamec`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pamec`;
  }

  remove(id: number) {
    return `This action removes a #${id} pamec`;
  }
}
