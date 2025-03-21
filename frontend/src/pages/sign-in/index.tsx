import { useAuthStore } from '@shared/stores';
import { Route } from '@shared/types';
import { Button, TextField } from '@shared/ui';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = useAuthStore((state) => state.login);

  const navigate = useNavigate();
  const handleClick = async () => {
    await login(username.trim(), password);
    navigate(Route.Root);
  };

  const keyUpHandler = async (key: string) => {
    if (key === 'Enter') {
      await handleClick();
    }
  };

  return (
    <div className='m-auto grid h-full grid-cols-1 place-content-center gap-4 px-2 sm:w-full lg:w-3/12'>
      <h1 className='text-center text-2xl uppercase text-white'>Sign In</h1>
      <TextField placeholder='Username' value={username} onInput={(e) => setUsername(e.currentTarget.value)} />
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
        <Link className='text-primary-300' to={Route.SignUp}>
          Sign Up
        </Link>
      </div>
      <Link className='text-primary-300' to={Route.ResetPassword}>
        Forget password?
      </Link>
    </div>
  );
};
