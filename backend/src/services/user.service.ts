import type { User } from '@prisma/client';
import { userRepository } from '@repositories';
import type { CreateUserDto, Id, UpdateUserDto, UserDto } from '@shared/types';

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

  updateUser(data: UpdateUserDto, userId: Id): Promise<User> {
    return userRepository.update(data, userId);
  }

  updatePassword(id: Id, password: string) {
    return userRepository.update({ password }, id);
  }
}

export const userService = new UserService();
