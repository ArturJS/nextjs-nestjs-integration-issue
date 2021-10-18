import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser({ email, password }): Promise<any> {
    const user = await this.usersService.findOne({ email });

    if (user && user.password === password) {
      const { id, email } = user;

      return { id, email };
    }

    return null;
  }
}
