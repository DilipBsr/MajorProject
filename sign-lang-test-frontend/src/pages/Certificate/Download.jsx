import React, { useState } from 'react'
import NewNavbar from '../../Components/NewNavbar'
import Certificate from './Certificate'
import Buttons from '../../Components/Buttons'
import { useCallback, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Link } from 'react-router-dom';

function Download({ testName = "Basic sign language", user = "Dilip" }) {

  const ref = useRef(null)

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toPng(ref.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'certificate.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])

  return (
    <>
      <NewNavbar />
      <Link to="/test">
      <div className="flex justify-start p-5" onClick={()=>{stopCamera()}}>
        <Buttons name='Back'/>
      </div>
      </Link>
      <div className='flex flex-col items-center '>
          <div className='font-bold text-3xl text-center p-10 text-green-600'>
            Conguratulation {user} You have Completed {testName}  Test!!!
          </div>
          <div ref={ref} className='w-90 h-70'>
            <Certificate name={user} testName={testName} />
          </div>
        </div>
      <div on onClick={onButtonClick} className='w-50'>
        <Buttons name="Download" />
      </div>

    </>
  )
}

export default Download
