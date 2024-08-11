import { Button, TextField } from '@shared/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@shared/api';
import { Route } from '@shared/types';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const handleClick = async () => {
    await authService.login(username.trim(), password);
    navigate(Route.Root);
  };

  const keyUpHandler = async (key: string) => {
    if (key === 'Enter') {
      await handleClick();
    }
  };

  return (
    <div className='lg:w-3/12 sm:w-full px-2 h-full grid grid-cols-1 gap-4 m-auto place-content-center'>
      <h1 className='text-white text-2xl text-center uppercase'>Sign In</h1>
      <TextField
        placeholder='Username'
        value={username}
        onInput={(e) => setUsername(e.currentTarget.value)}
      />
      <TextField
        placeholder='Password'
        value={password}
        onInput={(e) => setPassword(e.currentTarget.value)}
        onKeyUp={(e) => keyUpHandler(e.key)}
        type='password'
      />
      <Button variant='primary' onClick={() => handleClick()}>
        Sign In
      </Button>
      <div className='text-white'>
        Do not have an account?{' '}
        <a className='text-primary-300' href={Route.SignUp}>
          Sign Up
        </a>
      </div>
    </div>
  );
};

export default SignIn;
