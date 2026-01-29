import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('요청 타임아웃:', error);
    } else if (error.message === 'Network Error') {
      console.error('네트워크 오류 - 백엔드 서버가 실행 중인지 확인하세요:', API_URL);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_URL };
