export type User = {
  email: string;
  password: string;
  name: string;
  id: string;
};
export type UserLogin = Pick<User, 'email' | 'password'>;
export type UserRegister = Omit<User, 'id'>;

export type AuthState = {
  token: string;
  user: Omit<User, 'password'>;
};
