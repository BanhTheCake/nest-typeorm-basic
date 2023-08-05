import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, FindOptionsWhere } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(data: Pick<User, 'email' | 'hashPassword'>) {
    const newUser = this.userRepository.create(data);
    return this.userRepository.save(newUser);
  }

  findOne(where: FindOptionsWhere<User>) {
    return this.userRepository.findOne({
      where,
    });
  }

  find(where: FindOptionsWhere<User>) {
    return this.userRepository.find({
      where,
    });
  }

  async update(id: number, dataUpdate: Partial<User>) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not exist.');
    }
    Object.assign(user, dataUpdate);
    return this.userRepository.save(user);
  }

  async delete(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not exist.');
    }
    return this.userRepository.remove(user);
  }
}
