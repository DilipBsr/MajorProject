import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useState,useEffect } from 'react';

function NewNavbar({element}) {
   const navigate=useNavigate();
   const [user,setUser]=useState('');
    useEffect(()=>{
      setUser(localStorage.getItem('userName'))
    },[])
    
    const handleLogout=(e)=>{
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      setTimeout(()=>{
        navigate('/home');
      },1000)
    }
  return (
    <>
     <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
      <ul className="logo w-20 rounded-full ml-15 "onClick={() => navigate('/')}>
            <img src="\src\assets\logo.png" alt="logo" 
            className="m-[-10px] rounded-full border"/>
          </ul>
  
        <div className='flex'>
        <button onClick={handleLogout}>
          {element}
        </button>
        <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 "onClick={()=>{
          navigate('/account')
        }}>
          {user?user:'Login'}
        </button>
        </div>
      </div>
    </nav>
    </>
  )
}

export default NewNavbar
