import { User } from '@prisma/client';
import { userRepository } from '@repositories';

import { CreateUserDto, UpdateUserDto, UserDto } from '../dtos';

class UserService {
  async getUserById(id: string): Promise<UserDto> {
    const user = await userRepository.getById(id);
    return {
      id,
      username: user.username,
      email: user.email,
    };
  }

  createUser(data: CreateUserDto): Promise<User> {
    return userRepository.create(data);
  }

  updateUser(data: UpdateUserDto): Promise<void> {
    return userRepository.update(data);
  }

  updatePassword(id: string, password: string) {
    return userRepository.update({ id, password });
  }
}

export const userService = new UserService();
