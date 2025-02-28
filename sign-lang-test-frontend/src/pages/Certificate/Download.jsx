import React from 'react'
import NewNavbar from '../../Components/NewNavbar'
import Certificate from './Certificate'
import Buttons from '../../Components/Buttons'

function Download({testName="Basic " ,user="Dilip"}) {
  return (
    <>
    <NewNavbar/>
    <div className='flex flex-col items-center text-blue-700 '>
      <div className='font-bold text-3xl text-center p-10'>
        Conguratulation {user} You have Completed {testName} sign language Test!!!
      </div>
      <div className='mb-10 h-70 w-96 bg-amber-950   flex flex-wrap justify-center items-center rounded-4xl'>
        <Certificate name={user} testName={testName}/> 
      </div>
      <div className='w-50'>
        <Buttons name="Download"/>
      </div>
      
    </div>
    </>
  )
}

export default Download
