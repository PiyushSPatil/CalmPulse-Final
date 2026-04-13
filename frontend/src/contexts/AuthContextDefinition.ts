import { createContext } from 'react';

interface User {
  name: string;
  email: string;
  role: 'student' | 'counselor' | string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export type { User, AuthContextType };
