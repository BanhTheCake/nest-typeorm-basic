import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { randomBytes } from 'crypto';
import * as argon2 from 'argon2';
import { Buffer } from 'buffer';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signup(data: { email: string; password: string }) {
    const existUser = await this.userService.findOne({
      email: data.email,
    });

    if (existUser) {
      throw new BadRequestException('User has been exist.');
    }

    // Generate random salt
    const salt = randomBytes(8).toString('hex');
    const hash = await argon2.hash(data.password, { salt: Buffer.from(salt) });

    // Join salt and hash to store in db
    const hashPassword = [hash, salt].join('.');

    return this.userService.create({
      email: data.email,
      hashPassword,
    });
  }

  async signin(data: { email: string; password: string }) {
    const user = await this.userService.findOne({
      email: data.email,
    });
    if (!user) {
      throw new BadRequestException('email or password is incorrect.');
    }
    // split hash and salt
    const [hashPassword, salt] = user.hashPassword.split('.');

    const isMatch = await argon2.verify(hashPassword, data.password, {
      salt: Buffer.from(salt),
    });
    if (!isMatch) {
      throw new BadRequestException('email or password is incorrect.');
    }

    return user;
  }
}
