import { CustomError } from '@configs/errors';
import type { User } from '@prisma/client';
import { userRepository } from '@repositories';
import type { CreateUserDto, UpdateUserDto } from '@shared/types';
import bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

const { JWT_SECRET_KEY } = process.env;
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

class UserService {
  getUserById(id: string) {
    return userRepository.getById(id);
  }

  async getUserByCredentials(email: string, password: string) {
    const user = await userRepository.getByEmail(email);
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new CustomError('loginError');
    }
    return user;
  }

  async createUser(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    return userRepository.create({ ...data, password: hashedPassword });
  }

  updateUser(data: UpdateUserDto, userId: string) {
    return userRepository.update(data, userId);
  }

  async updatePassword(token: string, password: string) {
    const { payload } = verify(token, JWT_SECRET_KEY, { complete: true });
    if (typeof payload === 'string') {
      throw new CustomError('entityUpdateError');
    }
    const user = await userService.getUserById(payload.userId);
    if (!user || user.password !== payload.password) {
      throw new CustomError('entityUpdateError');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return userRepository.update({ password: hashedPassword }, user.id);
  }

  createTokenPair(user: User) {
    const accessToken = sign({ id: user.id, username: user.username }, process.env.JWT_SECRET_KEY, {
      expiresIn: '15m',
    });
    const refreshToken = sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    const { payload } = verify(token, JWT_SECRET_KEY, { complete: true });
    if (typeof payload === 'string') {
      throw new CustomError('validationError');
    }
    const user = await userRepository.getById(payload.userId);
    if (!user) {
      throw new CustomError('entityNotFoundError');
    }
    return user;
  }
}

export const userService = new UserService();
