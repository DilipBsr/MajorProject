import React from 'react'
import TestHistory from '../../Components/TestHistory'
import NewNavbar from '../../Components/NewNavbar'
import Footer from '../../Components/Footer'


function Dashboard() {
  const user={
    userName:"Dilip",
    testId:"67ed0f99ff9af43c65b3ce38",
    category:"Alphabet",
    score:"40",
    correctSign:"20",
    totalSign:"26",
    date:"02-04-2025",
    certificate:"image.png",
  }

  return (
    <>
      <NewNavbar/>
      <div className='text-center text-3xl p-5 font-bold text-blue-500'>History</div>
      <div className='flex flex-wrap justify-center gap-10'>
   

      <TestHistory 
        user={user.userName}
        category={user.category}
        correct={user.correctSign}
        totalSign={user.totalSign}
        score={user.score}
        date={user.date}
        />
      <TestHistory 
        user={user.userName}
        category={user.category}
        correct={user.correctSign}
        totalSign={user.totalSign}
        score={user.score}
        date={user.date}
        />
      <TestHistory 
        user={user.userName}
        category={user.category}
        correct={user.correctSign}
        totalSign={user.totalSign}
        score={user.score}
        date={user.date}
        />
      <TestHistory 
        user={user.userName}
        category={user.category}
        correct={user.correctSign}
        totalSign={user.totalSign}
        score={user.score}
        date={user.date}
        />

      </div>
      <Footer/>
    </>
    
  )
}

export default Dashboard
