import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

const defaultContextValue: AuthContextType = {
  accessToken: null,
  login: () => {},
  logout: () => {},
  isLoggedIn: () => false
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));

  const login = (token: string) => {
    localStorage.setItem('accessToken', token);
    setAccessToken(token);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
  };
  const isLoggedIn = () => {
    return !!accessToken;
  };

  const contextValue: AuthContextType = {
    accessToken,
    login,
    logout,
    isLoggedIn
  };

  useEffect(() => {
    if (accessToken) {
      const accessTokenExpiration = JSON.parse(atob(accessToken.split('.')[1])).exp * 1000;
      const now = new Date().getTime();
      const expiresIn = accessTokenExpiration - now;
      if (expiresIn <= 0) {
        logout();
      }
    }    
  }, [])
  

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};