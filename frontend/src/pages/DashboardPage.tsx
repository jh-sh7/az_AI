import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  Chip,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient, { API_URL } from '../api/axiosConfig';

interface Task {
  id: number;
  command: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  result: string | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}


const DashboardPage: React.FC = () => {
  const [command, setCommand] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    // 주기적으로 작업 상태 업데이트
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await apiClient.get('/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error: any) {
      if (error.message === 'Network Error') {
        console.error('백엔드 서버에 연결할 수 없습니다:', API_URL);
      } else {
        console.error('작업 목록 가져오기 실패:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) {
      setError('명령을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await apiClient.post(
        '/api/tasks',
        { command: command.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCommand('');
      await fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.detail || '작업 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'running':
        return 'info';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: '대기 중',
      running: '실행 중',
      completed: '완료',
      failed: '실패',
      cancelled: '취소됨',
    };
    return labels[status] || status;
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI 자동화 서비스
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.email}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            새 작업 생성
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            수행할 업무를 명령으로 입력하세요. 예: "https://example.com에 접속", "업무 종료"
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="명령 입력"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder='예: "https://example.com에 접속하여 데이터를 추출하세요"'
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              disabled={loading || !command.trim()}
              fullWidth
            >
              {loading ? '처리 중...' : '작업 실행'}
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            작업 목록
          </Typography>
          {tasks.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              아직 생성된 작업이 없습니다.
            </Typography>
          ) : (
            <List>
              {tasks.map((task) => (
                <ListItem
                  key={task.id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    flexDirection: 'column',
                    alignItems: 'stretch',
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography variant="body1" sx={{ flexGrow: 1, mr: 2 }}>
                      {task.command}
                    </Typography>
                    <Chip
                      label={getStatusLabel(task.status)}
                      color={getStatusColor(task.status) as any}
                      size="small"
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    생성: {new Date(task.created_at).toLocaleString('ko-KR')}
                    {task.completed_at &&
                      ` | 완료: ${new Date(task.completed_at).toLocaleString('ko-KR')}`}
                  </Typography>
                  {task.result && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                      {task.result}
                    </Alert>
                  )}
                  {task.error_message && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      {task.error_message}
                    </Alert>
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default DashboardPage;
