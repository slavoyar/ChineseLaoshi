import { Button, TextField } from '@shared/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@shared/api';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const handleClick = async () => {
    await authService.login(login.trim(), password);
    navigate('/');
  };

  const keyUpHandler = async (key: string) => {
    if (key === 'Enter') {
      await handleClick();
    }
  };

  return (
    <div className='lg:w-3/12 sm:w-full px-2 h-full grid grid-cols-1 gap-4 m-auto place-content-center'>
      <h1 className='text-white text-2xl text-center uppercase'>Login</h1>
      <TextField
        placeholder='Login'
        value={login}
        onInput={(e) => setLogin(e.currentTarget.value)}
      />
      <TextField
        placeholder='Password'
        value={password}
        onInput={(e) => setPassword(e.currentTarget.value)}
        onKeyUp={(e) => keyUpHandler(e.key)}
        type='password'
      />
      <Button variant='primary' onClick={() => handleClick()}>
        Login
      </Button>
    </div>
  );
};

export default Login;
