import { CreateUserDto, UpdateUserDto, UserDto } from '../dtos';

class UserService {
  getUserById(id: string): Promise<UserDto> {
    throw new Error('Not implemented');
  }

  createUser(data: CreateUserDto): Promise<void> {
    throw new Error('Not implemented');
  }

  updateUser(data: UpdateUserDto): Promise<void> {
    throw new Error('Not implemented');
  }
}

export const userService = new UserService();
