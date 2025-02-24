import React from 'react'
import './Home.css'
import Footer from '../../Components/Footer'
import Buttons from '../../Components/Buttons'
import { useNavigate } from 'react-router-dom'
import NewNavbar from '../../Components/NewNavbar'

function Home() {
  const navigate=useNavigate();
  return (
    <>
       <NewNavbar/>
      <div className="banner bg-contain min-h-screen">
        <div className='block lg:w-140 w-80 gap-5 lg:pt-30 lg:pl-30 pl-15 pt-15'>
          <p className=" text-3xl lg:text-7xl font-bold font-serif text-pink-500">
            Sign Language 
          </p>
          <p className='text-xl lg:text-4xl font-serif text-cyan-400 mt-2'>Test with Convenience!!!</p>
          <p className='lg:text-xl font-bold text-gray-500 font-serif w-fit'>"Learning sign language is not just about communication; it's about inclusion, empathy, and breaking barriers."</p>
          
          <button className='pt-10' onClick={() => navigate('/login')}>
            <Buttons name="Get Started"/>
          </button>
        </div>
      </div>  
    
      <Footer/>
    </>
  )
}

export default Home
