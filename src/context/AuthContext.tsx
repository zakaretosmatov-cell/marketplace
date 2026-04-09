'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Role = 'client' | 'seller' | 'admin' | null;

interface User {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  login: (email: string, roleInput?: Role) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session on load
    const savedUser = localStorage.getItem('mock_user');
    const savedRole = localStorage.getItem('mock_role');

    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole as Role);
    }
    
    setIsLoading(false);
  }, []);

  const login = (email: string, roleInput: Role = 'client') => {
    // In production, this would call Firebase Auth and fetch custom claims
    const mockUser = { uid: Math.random().toString(36).substring(7), email };
    setUser(mockUser);
    setRole(roleInput);
    
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
    localStorage.setItem('mock_role', roleInput || 'client');
  };

  const logout = () => {
    // In production: firebase.auth().signOut()
    setUser(null);
    setRole(null);
    localStorage.removeItem('mock_user');
    localStorage.removeItem('mock_role');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
