import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Routes, Route, Navigate } from 'react-router-dom'
import List from '../pages/List'
import Add from '../pages/Add'
import Orders from '../pages/Orders'
import Login from '../components/Login'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { ADMIN_TOKEN_KEY } from './config';


const App = () => {

const [token,setToken]=useState(localStorage.getItem(ADMIN_TOKEN_KEY) || '');

useEffect(()=>{
if (token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
} else {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}
},[token])


  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer/>
   {token===""?
    <Login setToken={setToken}/>
    :
    <>
    <Navbar setToken={setToken}/>
    <hr className='border-gray-300'/>
    <div className='flex w-full'>
      <Sidebar/>
      <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
        <Routes>
          <Route path='/' element={<Navigate to='/add' replace />} />
          <Route path='/add' element={<Add token={token}/>}/>
          <Route path='/list' element={<List token={token}/>}/>
          <Route path='/orders' element={<Orders token={token}/>}/>
        </Routes>

      </div>
    </div>
   </>


   }
    
    
    </div>
  )
}

export default App