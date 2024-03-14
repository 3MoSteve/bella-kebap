import React from 'react';

const LoginForm = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-800 to-blue-400 text-white">
      <h2 className="text-3xl font-bold mb-4">Login</h2>
      <form className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input type="email" id="email" name="email" className="w-full mt-1 p-2 border rounded-md" />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input type="password" id="password" name="password" className="w-full mt-1 p-2 border rounded-md" />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
