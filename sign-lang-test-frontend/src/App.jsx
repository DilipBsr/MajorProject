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
import AlphaTest from './pages/Module/AlphaTest'
import Account from './pages/Profile/Account'
import Result from './Components/Result'
import UserContextProvider from './Context/UserContextProvider'
import TestHistory from './Components/TestHistory'
import Dashboard from './pages/Profile/Dashboard'
import PageNotFound from './Components/PageNotFound'
import IndianSignTest from './pages/Module/IndianSignTest'


function App() {
  const [isAuth, setIsAuth] = useState(false);
  const PrivateRoute = ({ element }) => {
    return isAuth ? element : <Navigate to='/login' />
  }

  return (
    <>
      <HandleRefresh setIsAuth={setIsAuth} />
      <div className=''>
        <UserContextProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path='/home' element={<Home imagepath={"./src/assets/homepage.jpg"} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />


            <Route path="/test"
              element={<PrivateRoute element={<Test />} />} />

            <Route path='/numbertest'
              element={<NumberTest />} />

            <Route path='/islTest'
              element={<IndianSignTest/>}/>

            <Route path='/alphabet'
              element={<AlphaTest />} />
            <Route path="/alpharesult"
              element={<PrivateRoute element={<Result category={'Alphabet'} totalSign={26} />} />} />

            <Route path="/islresult"
              element={<PrivateRoute element={<Result category={'Indian Alphabet'} totalSign={26} />} />} />


            <Route path="/account"
              element={<PrivateRoute element={<Account />} />} />

            <Route path="/history"
              element={<PrivateRoute element={<Dashboard />} />} />




            <Route path='/*' element={<PageNotFound />} />
          </Routes>
        </UserContextProvider>
        <ToastContainer />
      </div>
    </>
  )
}

export default App
