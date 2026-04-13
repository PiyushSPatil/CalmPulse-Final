import { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from '@/contexts/AuthContextDefinition';
import type { User } from '@/contexts/AuthContextDefinition';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    // Clear the unauthenticated chat counter when user logs in
    localStorage.removeItem('unauthedChatCount');
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Reset the unauthenticated chat counter on logout
    localStorage.removeItem('unauthedChatCount');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};