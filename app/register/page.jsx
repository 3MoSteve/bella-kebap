// pages/register.jsx
import React from 'react';
import RegisterForm from "../components/Registerform";

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-bold mb-4">Register</h2>
      <RegisterForm />
    </div>
  );
};

export default Register;
