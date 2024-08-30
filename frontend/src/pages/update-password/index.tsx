import { Route } from '@shared/types';
import { Button, TextField } from '@shared/ui';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { updatePassword as updatePasswordAsync } from './api';

export const UpdatePassword = () => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    try {
      const token = searchParams.get('token');
      if (!token) {
        navigate(Route.Root);
        return;
      }
      await updatePasswordAsync(token, password);
    } finally {
      navigate(Route.Root);
    }
  };

  return (
    <div className='lg:w-3/12 sm:w-full px-2 h-full grid grid-cols-1 gap-4 m-auto place-content-center'>
      <h1 className='text-white text-2xl text-center uppercase'>Update password</h1>
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
        Update password
      </Button>
    </div>
  );
};
