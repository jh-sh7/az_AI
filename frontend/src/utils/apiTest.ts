// API 연결 테스트 유틸리티
import apiClient, { API_URL } from '../api/axiosConfig';

export const testBackendConnection = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/api/health');
    console.log('백엔드 연결 성공:', response.data);
    return true;
  } catch (error: any) {
    console.error('백엔드 연결 실패:', error);
    console.error('API URL:', API_URL);
    if (error.message === 'Network Error') {
      console.error('네트워크 오류 - 백엔드 서버가 실행 중인지 확인하세요.');
      console.error('백엔드 서버를 시작하려면: cd backend && uvicorn main:app --reload');
    }
    return false;
  }
};
