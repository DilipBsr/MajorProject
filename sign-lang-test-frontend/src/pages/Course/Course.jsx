import React, { useEffect, useState } from 'react'
import Buttons from '../../Components/Buttons';
import { useNavigate } from 'react-router-dom';
import NewNavbar from '../../Components/NewNavbar';
import Footer from '../../Components/Footer';
import { Link } from 'react-router-dom';

function Course() {
  const [user,setUser]=useState('');
  useEffect(()=>{
    setUser(localStorage.getItem('userName'))
  },[])
  
  const navigate=useNavigate();
  
  const handleLogout=(e)=>{
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setTimeout(()=>{
      navigate('/home');
    },1000)
  }
  return (
    <>
      <NewNavbar element={<Buttons name='Log Out'/>}/>

      <div className='flex-grow h-screen'>

      <div className='flex justify-center'>
      <div className=" flex justify-center max-w-sm bg-white shadow-lg rounded-lg p-4">
      <div className="relative bg-blue-400 p-3 rounded-t-lg flex justify-center items-center">
        <img
          src="src\assets\1905.i126.008.P.m005.c30.deaf and dumb set.jpg"
          alt="Sign Test"
          className="w-full h-32 object-cover rounded-lg"
          />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold">Sign Alphabets</h2>
        <p className="text-gray-500">Basic Test</p>
        
        <Link to="/test">
        <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 hover:cursor-pointer">
          Start
        </button>
        </Link>
      </div>
    </div>
    </div>
    </div>
    <div className=''>
      <Footer/>
    </div>
    </>
  )
}

export default Course
