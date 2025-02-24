import React, { useState } from "react";
import { Link } from "react-router-dom";
import { handleError } from "../../Components/Toast";
import { handleSuccess } from "../../Components/Toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {name,email,password}=formData;
    if(!name || !email || !password){
      return handleError("Enter Valid Data!!");
    }
    try {
      const url="http://localhost:5000/auth/signup";
      const response=await fetch(url,
        {
          method:"POST",
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(formData)
        }
      )
    
      const result=await response.json();
      console.log(result);
      if(result){
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
    return handleSuccess("SignUp Success");
  };

  const click=async()=>{
    const response=await axios.post(url,{
      "name":"Dilip",
      "email":"dilipkr@gmail.com",
      "password":"1234"
  });

  }
  return (
    <>
    <nav className=" top-0 z-50">
            <Navbar/>
      </nav>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
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
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        <span >Already have an Account </span>
        <Link className="text-blue-800 font-bold" to="/login">Login</Link>
      </div>
    </div>
    </>
  );
};

export default SignUp;
