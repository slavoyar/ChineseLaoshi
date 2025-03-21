import { useAuthStore } from '@shared/stores';
import { Route } from '@shared/types';
import { Button, TextField } from '@shared/ui';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
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
    await register({ username, email, password });
    navigate(Route.Root);
  };

  return (
    <div className='m-auto grid h-full grid-cols-1 place-content-center gap-4 px-2 sm:w-full lg:w-3/12'>
      <h1 className='text-center text-2xl uppercase text-white'>Sign Up</h1>
      <TextField placeholder='Username' value={username} onInput={(e) => setUsername(e.currentTarget.value)} />
      <TextField placeholder='Email' type='email' value={email} onInput={(e) => setEmail(e.currentTarget.value)} />
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
