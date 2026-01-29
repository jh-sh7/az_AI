import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
  Link,
  Tabs,
  Tab,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../contexts/AuthContext';
import apiClient, { API_URL } from '../api/axiosConfig';
import { testBackendConnection } from '../utils/apiTest';

declare global {
  interface Window {
    google: any;
  }
}

const LoginPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    // 백엔드 연결 테스트
    testBackendConnection();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // 구글 로그인 스크립트 로드 (클라이언트 ID가 있을 때만)
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (googleClientId && googleClientId !== 'your-google-client-id') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.google) {
          try {
            window.google.accounts.id.initialize({
              client_id: googleClientId,
              callback: handleGoogleSignIn,
            });
          } catch (err) {
            console.error('구글 로그인 초기화 실패:', err);
          }
        }
      };

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleSignIn = async (response: any) => {
    if (!response || !response.credential) {
      setError('구글 로그인 토큰을 받을 수 없습니다.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await googleLogin(response.credential);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || '구글 로그인에 실패했습니다.';
      setError(errorMessage);
      console.error('구글 로그인 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = err.message || '로그인에 실패했습니다.';
      
      // Network Error 처리
      if (errorMessage.includes('Network Error') || errorMessage.includes('연결할 수 없습니다')) {
        errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요. (http://localhost:8000)';
      } else if (errorMessage.includes('올바르지 않습니다')) {
        errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다. 회원가입이 필요하시면 회원가입 탭을 이용하세요.';
      }
      
      setError(errorMessage);
      console.error('로그인 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    // UTF-8 바이트 길이 검증 (bcrypt 제한: 72바이트)
    const passwordBytes = new TextEncoder().encode(password);
    if (passwordBytes.length > 72) {
      // 한글 기준으로 대략적인 문자 수 계산 (한글 1자 = 3바이트)
      const maxCharsKr = Math.floor(72 / 3); // 약 24자
      setError(`비밀번호가 너무 깁니다. UTF-8 인코딩 시 최대 72바이트까지 가능합니다. (한글 기준 약 ${maxCharsKr}자)`);
      return;
    }
    if (passwordBytes.length === 0) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // 디버깅: API URL 확인
      console.log('회원가입 요청 URL:', `${API_URL}/api/auth/register`);
      console.log('요청 데이터:', { email: email.trim(), password: '***', full_name: fullName.trim() || null });
      
      await apiClient.post('/api/auth/register', {
        email: email.trim(),
        password: password,
        full_name: fullName.trim() || null,
      });
      setSuccess('회원가입이 완료되었습니다! 로그인해주세요.');
      setTabValue(0); // 로그인 탭으로 전환
      setPassword(''); // 비밀번호 필드 초기화
    } catch (err: any) {
      console.error('회원가입 오류 상세:', {
        message: err.message,
        code: err.code,
        response: err.response,
        config: err.config,
      });
      
      let errorMessage = err.response?.data?.detail || err.message || '회원가입에 실패했습니다.';
      
      // Network Error 처리
      if (errorMessage.includes('Network Error') || errorMessage.includes('연결할 수 없습니다') || err.code === 'ERR_NETWORK') {
        errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요. (http://localhost:8000)';
        console.error('네트워크 오류 - 백엔드 서버 상태를 확인하세요.');
      } else if (err.response?.status === 0) {
        errorMessage = 'CORS 오류가 발생했습니다. 백엔드 서버를 재시작하고 브라우저 캐시를 삭제하세요.';
        console.error('CORS 오류 - 백엔드 서버 재시작 필요');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleButtonClick = () => {
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!googleClientId || googleClientId === 'your-google-client-id') {
      setError('구글 로그인을 사용하려면 구글 클라이언트 ID를 설정해주세요.');
      return;
    }
    if (window.google) {
      try {
        window.google.accounts.id.prompt();
      } catch (err) {
        setError('구글 로그인을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
      }
    } else {
      setError('구글 로그인 스크립트가 로드되지 않았습니다. 페이지를 새로고침해주세요.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            AI 자동화 서비스
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            로그인하여 시작하세요
          </Typography>

          <Tabs value={tabValue} onChange={(e, newValue) => { setTabValue(newValue); setError(''); setSuccess(''); }} sx={{ mb: 2 }}>
            <Tab label="로그인" />
            <Tab label="회원가입" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          {tabValue === 0 ? (
            <Box component="form" onSubmit={handleEmailLogin} sx={{ mb: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="이메일"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="비밀번호"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? '로그인 중...' : '이메일로 로그인'}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleRegister} sx={{ mb: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="register-email"
                label="이메일"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                fullWidth
                id="register-name"
                label="이름 (선택사항)"
                name="fullName"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="비밀번호 (한글/영문/숫자 가능)"
                type="password"
                id="register-password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="비밀번호는 UTF-8 인코딩 시 최대 72바이트까지 가능합니다 (한글 기준 약 24자)"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? '가입 중...' : '회원가입'}
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 2 }}>또는</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleButtonClick}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            구글 계정으로 로그인
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
