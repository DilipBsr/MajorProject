import React, { useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../Components/Toast";
import Course from "../Course/Course";
import Navbar from "../../Components/Navbar";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate=useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {email,password}=formData;
        if(!email){
          return handleError("Enter Email !!");
        }else if(!password){
          return handleError('Enter Password!!');
        }
        try {
          const url="http://localhost:5000/auth/login";
          const response=await fetch(url,
            {
              method:"POST",
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify(formData)
            }
          )
        
          const result=await response.json();
          const {message,jwtToken,success,userName,error}=result;
          if(success){
            handleSuccess(message);
            localStorage.setItem('token',jwtToken);
            localStorage.setItem('userName',userName);
            setTimeout(()=>{
              navigate('/Course');
            },1000)
          }else if(error){
            const detail=error?.details[0].message;
            handleError(detail);
          }else{
            handleError(message);
          }
          console.log(result);
        } catch (error) {
          console.log(error);
        }
  };

  return (
    <>
    <nav className=" top-0 z-50">
            <Navbar/>
      </nav>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              // required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              // required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition
            hover:cursor-pointer"
          >
            Login
          </button>
        </form>
        <div className="mt-3 font-bold text-blue-800">
          <Link to="/signup">Click for Signup</Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
