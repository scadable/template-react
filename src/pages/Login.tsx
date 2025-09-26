import { LoginForm } from '../features/authentication';
import { Box } from '@mui/material';

export function Login() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <LoginForm />
    </Box>
  );
}