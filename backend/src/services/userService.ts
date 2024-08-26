import { userRepository } from '@repositories';

import { CreateUserDto, UpdateUserDto, UserDto } from '../dtos';
import { User } from '@prisma/client';

class UserService {
  async getUserById(id: string): Promise<UserDto> {
    const user = await userRepository.getById(id);
    return {
      username: user.username,
    };
  }

  createUser(data: CreateUserDto): Promise<User> {
    return userRepository.create(data);
  }

  updateUser(data: UpdateUserDto): Promise<void> {
    return userRepository.update(data);
  }
}

export const userService = new UserService();
