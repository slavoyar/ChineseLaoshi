export type UserDto = {
  username: string;
};

export type CreateUserDto = {
  username: string;
  password: string;
};

export type UpdateUserDto = Partial<CreateUserDto>;
