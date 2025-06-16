import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersServices {

  getUsers(): string[] {
    return ['John Doe', 'Jane Smith', 'Alice Johnson'];
  }

}