import { useState } from 'react'
import './App.css'
import Home from './pages/Home/Home'
import Navbar from './Components/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/Auth/SignUp'
import Login from './pages/Auth/Login'
import { ToastContainer, toast } from 'react-toastify';
import Test from './pages/TestPage/Test'
import HandleRefresh from './Components/HandleRefresh'
import NumberTest from './pages/Module/NumberTest'
import Certificate from './pages/Certificate/Certificate'
import Download from './pages/Certificate/Download'
import AlphaTest from './pages/Module/AlphaTest'


function App() {
  const [isAuth, setIsAuth] = useState(false);
  const PrivateRoute = ({ element }) => {
    return isAuth ? element : <Navigate to='/login' />
  }

  return (
    <>
      <HandleRefresh setIsAuth={setIsAuth} />
      <div className=''>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path='/home' element={<Home imagepath={"./src/assets/homepage.jpg"} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />


          <Route path="/test"
            element={<PrivateRoute element={<Test />} />} />

          <Route path='/numbertest'
            element={<NumberTest />} />

          <Route path='/alphatest'
            element={<AlphaTest />} />

          <Route path='/download'
            element={<Download />} />

          <Route path='/certificate'
            element={<Certificate />} />

          <Route path="/account"
            element={<PrivateRoute element={<Download/>} />} />
        </Routes>
        <ToastContainer />
      </div>
    </>
  )
}

export default App
