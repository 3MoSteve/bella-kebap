import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-bold mb-4">Login</h2>
      <LoginForm />
    </div>
  );
};

export default Login;
