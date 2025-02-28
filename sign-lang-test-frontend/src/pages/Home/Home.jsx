import React from 'react'
import './Home.css'
import Footer from '../../Components/Footer'
import Buttons from '../../Components/Buttons'
import { useNavigate } from 'react-router-dom'
import NewNavbar from '../../Components/NewNavbar'
import { image } from '@tensorflow/tfjs'

function Home({imagepath="src/assets/homebg.jpg"}) {
  const navigate=useNavigate();
  return (
    <>
       <NewNavbar/>
      <div 
      style={{
        backgroundImage: `url(${imagepath})`,
        backgroundRepeat:"no-repeat"
      }}
      className="bg-contain min-h-screen bg-white">
        <div className='block lg:w-180 w-50 md:w-90 sm:w-90 sm:pt-20 sm:pl-10 p-5 lg:pt-30 lg:pl-30
        md:pl-15 md:pt-15 '>
          <p className="sm:text-3xl lg:text-6xl 
          text-xl
          font-sans font-bold text-blue-600">
            Test Your Sign Language Skill
          </p>
         
          <p className='lg:text-2xl 
          md:text-xl
          text md:pt-5
          font-semibold text-gray-500 w-fit'>Learning sign language is not just about communication; it's about inclusion, empathy, and breaking barriers !</p>
          
          <button className='pt-10' onClick={() => navigate('/login')}>
            <Buttons name="Get Started"/>
          </button>
        </div>
          <img 
          className='flex justify-center items-center w-screen pt-40 p-30'
          src="/src/assets/slider.png" alt="" srcset="" />
      </div>  
      <Footer/>
    </>
  )
}

export default Home
