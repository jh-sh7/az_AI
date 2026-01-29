import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { API_URL } from '../api/axiosConfig';

interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_google_user: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (googleToken: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 저장된 토큰 확인
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await apiClient.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUser(response.data);
    } catch (error: any) {
      console.error('사용자 정보 가져오기 실패:', error);
      if (error.message === 'Network Error') {
        console.error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요:', API_URL);
      }
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/api/auth/login', {
        email: email.trim(),
        password,
      });
      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem('token', access_token);
      await fetchUser(access_token);
    } catch (error: any) {
      if (error.message === 'Network Error' || error.code === 'ECONNREFUSED') {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.');
      }
      const errorMessage = error.response?.data?.detail || error.message || '로그인에 실패했습니다.';
      throw new Error(errorMessage);
    }
  };

  const googleLogin = async (googleToken: string) => {
    if (!googleToken) {
      throw new Error('구글 로그인 토큰이 없습니다.');
    }
    try {
      const response = await apiClient.post('/api/auth/google', {
        token: googleToken,
      });
      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem('token', access_token);
      await fetchUser(access_token);
    } catch (error: any) {
      if (error.message === 'Network Error' || error.code === 'ECONNREFUSED') {
        throw new Error('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요.');
      }
      const errorMessage = error.response?.data?.detail || error.message || '구글 로그인에 실패했습니다.';
      console.error('구글 로그인 오류:', error);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        googleLogin,
        logout,
        isAuthenticated: !!user && !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
