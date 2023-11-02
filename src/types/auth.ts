import { ResponseError } from './error';
import { User, UserAuth } from './user';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthContextProps {
  user: UserAuth | null;
  login: (data: LoginDto) => Promise<LoginResponse>;
  logout: () => void;
  authenticateUser: () => Promise<void>;
}

export type LoginResponse = {
  data?: User;
  error?: ResponseError;
};

export type CheckAuthResponse = {
  data?: UserAuth;
  error?: ResponseError;
};

export type LogoutResponse = {
  data?: boolean;
  error?: ResponseError;
};
