import fetcher from '@/lib/fetcher';
import { CheckAuthResponse, LoginResponse, LogoutResponse } from '@/types/auth';
import { User } from '@/types/user';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const login = async (data: { email: string; password: string }): Promise<LoginResponse> => {
  const response = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const parsed = await response.json();
  if (response.status !== 200) {
    return {
      error: {
        message: parsed.message,
        statusCode: response.status,
      },
    };
  }
  return { data: parsed };
};

const checkAuth = async (cookies?: RequestCookie[]): Promise<CheckAuthResponse> => {
  const response = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/auth/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies?.map(cookie => `${cookie.name}=${cookie.value}`).join('; ') || '',
    },
  });
  const parsed = await response.json();
  if (response.status !== 200) {
    return { error: parsed };
  }
  return { data: parsed as User };
};

const logout = async (): Promise<LogoutResponse> => {
  const response = await fetcher(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const parsed = await response.json();
  if (response.status !== 200) {
    return { error: parsed };
  }
  return { data: parsed as boolean };
};

const authService = { login, checkAuth, logout };
export default authService;
