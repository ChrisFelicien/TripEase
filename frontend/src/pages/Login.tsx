import React from "react";

const Login = () => {
  return (
    <div className='w-full h-screen grid place-content-center space-y-6'>
      <div className=''></div>
      <div className='grid grid-cols-[auto_1fr]'>
        <label className=''>Email</label>
        <input
          type='email'
          placeholder='example@email.com'
          name='email'
          className='input '
        />
      </div>
      <div className='grid grid-cols-[auto_1fr] gap:4'>
        <label>Password</label>
        <input
          type='password'
          placeholder='**********'
          name='password'
          className='input '
        />
      </div>
      <div>
        <button type='submit' className='btn btn-primary w-full'>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
