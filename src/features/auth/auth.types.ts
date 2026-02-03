export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface User {
  id: string;
  login: string;
  email: string;
  name: string;
  surname: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  name: string;
  surname: string;
  password: string;
  repeatedPassword: string;
}
