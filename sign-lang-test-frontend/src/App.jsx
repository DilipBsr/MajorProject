import { useState } from 'react'
import './App.css'
import Home from './pages/Home/Home'
import Navbar from './Components/Navbar'
import { Routes,Route, Navigate } from 'react-router-dom'
import SignUp from './pages/Auth/SignUp'
import Login from './pages/Auth/Login'
import { ToastContainer, toast } from 'react-toastify';
import Course from './pages/Course/Course'
import HandleRefresh from './Components/HandleRefresh'
import AlphaTest from './pages/Course/AlphaTest'


function App() {
  const [count, setCount] = useState(0)
  const [isAuth,setIsAuth]=useState(false);
  const PrivateRoute=({element})=>{
    return isAuth ? element : <Navigate to='/login'/>
  }

  return (
    <>
      <HandleRefresh setIsAuth={setIsAuth}/>
      <div className=''>
        <Routes>
          <Route path="/" element={<Navigate to ="/home"/>} />
          <Route path="/homepage" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/course" 
          element={<PrivateRoute element={<Course/>}/>}/>
          {/* <Route path='/course' element={<Course/>}/> */}
          {/* <Route path="/homepage" 
          element={<PrivateRoute element={<NewHome/>}/>}/> */}
          <Route path='/home' element={<Home imagepath={"./src/assets/homepage.jpg"}/>}/>


          <Route path="/account" 
          element={<PrivateRoute element={<Course/>}/>}/>
          <Route path='/test' element={<AlphaTest/>}/>
        </Routes>
        <ToastContainer />
      </div>
    </>
  )
}

export default App
