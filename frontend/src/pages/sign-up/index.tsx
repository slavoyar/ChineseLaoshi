import { Route } from '@shared/types';
import { Button, TextField } from '@shared/ui';
import { useState } from 'react';
import { useAuthStore } from '@shared/stores';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const register = useAuthStore((state) => state.register);

  const navigate = useNavigate();
  const updatePassword = (value: string) => {
    setPassword(value);
    if (confirmPassword) {
      setConfirmPassword('');
    }
  };

  const buttonTitle = () => {
    if (!password || confirmPassword !== password) {
      return 'Password mismatch';
    }
    return 'Sign Up';
  };

  const handleClick = async () => {
    await register(username, password);
    navigate(Route.Root);
  };

  return (
    <div className='lg:w-3/12 sm:w-full px-2 h-full grid grid-cols-1 gap-4 m-auto place-content-center'>
      <h1 className='text-white text-2xl text-center uppercase'>Sign Up</h1>
      <TextField
        placeholder='Username'
        value={username}
        onInput={(e) => setUsername(e.currentTarget.value)}
      />
      <TextField
        placeholder='Password'
        value={password}
        onInput={(e) => updatePassword(e.currentTarget.value)}
        type='password'
      />
      <TextField
        placeholder='Confirm password'
        value={confirmPassword}
        onInput={(e) => setConfirmPassword(e.currentTarget.value)}
        type='password'
      />
      <Button
        disabled={!password || confirmPassword !== password}
        variant='primary'
        title={buttonTitle()}
        onClick={() => handleClick()}
      >
        Sign Up
      </Button>
      <div className='text-white'>
        Already have an account?{' '}
        <a className='text-primary-300' href={Route.SignIn}>
          Sign In
        </a>
      </div>
    </div>
  );
};
