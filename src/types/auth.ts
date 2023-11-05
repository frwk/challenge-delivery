import { ResponseError } from './error';
import { User } from './user';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthContextProps {
  user: User | null;
  login: (data: LoginDto) => Promise<LoginResponse>;
  logout: () => void;
  authenticateUser: () => Promise<void>;
}

export type LoginResponse = {
  data?: User;
  error?: ResponseError;
};

export type CheckAuthResponse = {
  data?: User;
  error?: ResponseError;
};

export type LogoutResponse = {
  data?: boolean;
  error?: ResponseError;
};
