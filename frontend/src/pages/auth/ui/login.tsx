import { Button, TextField } from '@shared/ui';
import axios from 'axios';
import { useState } from 'react';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const handleClick = () => {
    axios.post(
      '/api/auth/login',
      { username: login, password },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
  };
  return (
    <div className='w-3/12 h-full grid grid-cols-1 gap-4 m-auto place-content-center'>
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
        type='password'
      />
      <Button variant='primary' onClick={() => handleClick()}>
        Login
      </Button>
    </div>
  );
};

export default Login;
