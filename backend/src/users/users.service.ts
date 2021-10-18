import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  users: { id: number; email: string; password: string }[];

  constructor() {
    this.users = [
      {
        id: 1,
        email: 'user1@mail.com',
        password: '123',
      },
      {
        id: 2,
        email: 'user2@mail.com',
        password: '123',
      },
    ];
  }

  async findOne({ email }) {
    return this.users.find(u => u.email === email) || null;
  }

  async findById(userId) {
    return this.users.find(u => u.id === userId) || null;
  }
}
