import React, { useEffect, useState } from "react";
import Buttons from "./Buttons";
import { useNavigate } from "react-router-dom";


function Navbar() {
  const navigate=useNavigate();
  return (
    <div className="px-5 z-50 py-[.8rem] lg:px-20 flex justify-between">
      <div className="flex items-center space-x-4">
        <div
          className="lg:mr-10 cursor-pointer flex items-center space-x-4"
        >
          <ul className="logo w-20 rounded-full "onClick={() => navigate('/')}>
            <img src="\src\assets\image.png" alt="logo" />
          </ul>
          
        </div>
      </div>
      <div className="flex items-center space-x-2 lg:space-x-10">
        

        <button onClick={() => navigate('/login')}>
         <Buttons name="Login"/>
        </button>
        <button onClick={() => navigate('/signup')}>
         <Buttons name="SignUp"/>
        </button>
        <button onClick={() => navigate('/')}>
          <Buttons name='🏠︎'/>
        </button>
     
      </div>
    </div>
  )
}

export default Navbar
