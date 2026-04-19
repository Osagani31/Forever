import React, { useState } from 'react'
import { useContext } from 'react';
import { ShopContext } from '../context/shopContext';
import { toast } from 'react-toastify';

const Login = () => {

const[currentState,setCurrentState]=useState('Login');
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [submitting, setSubmitting] = useState(false);
const { backendUrl, setToken, navigate } = useContext(ShopContext);

const onSubmitHandler= async(event)=>{
    event.preventDefault();

    if (!backendUrl) {
      toast.error('Missing VITE_BACKEND_URL in frontend .env');
      return;
    }

    try {
      setSubmitting(true);
      const endpoint = currentState === 'Login' ? 'login' : 'register';
      const payload = currentState === 'Login'
        ? { email: email.trim().toLowerCase(), password: password.trim() }
        : { name: name.trim(), email: email.trim().toLowerCase(), password: password.trim() };

      const res = await fetch(`${backendUrl}/api/user/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success && data?.token) {
        setToken(data.token);
        toast.success(currentState === 'Login' ? 'Login successful' : 'Account created successfully');
        navigate('/');
      } else {
        toast.error(data?.message || 'Authentication failed');
      }
    } catch (error) {
      toast.error(error?.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
}


  return (
    <form  onSubmit={onSubmitHandler}
    className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
       <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
       </div>
      {currentState === 'Login'?'':<input value={name} onChange={(e)=>setName(e.target.value)} type="text" className='w-full px-3 py-2 border border-gray-800 ' placeholder='Name' required/>}
      <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className='w-full px-3 py-2 border border-gray-800 ' placeholder='Email' required/>
       <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className='w-full px-3 py-2 border border-gray-800 ' placeholder='Password' required/>
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
          <p className='cursor-pointer'>Forgot your password?</p>
          {currentState === 'Login'?
          <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer'>Create an account</p>
          :
          <p onClick={()=>setCurrentState('Login')} className='cursor-pointer'>Login here</p>
  }
        </div>
        <button disabled={submitting} className='bg-black text-white font-light px-8 py-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed'>{submitting ? 'Please wait...' : (currentState==='Login'?'Sign In':'Sign Up')}</button>
    </form>
  )
}

export default Login