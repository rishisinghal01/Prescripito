import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/Appcontext';
import axios from 'axios';
import { toast } from "react-toastify";
import { useFetcher, useNavigate } from 'react-router-dom';

const Login = () => {
  const { token, settoken, backendurl } = useContext(AppContext);
  const [state, setstate] = useState("Sign Up");
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [name, setname] = useState('');
const navigate=useNavigate()
useEffect(()=>{
    if(token){
        navigate("/")
    }
},[token])
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendurl}/api/user/register`, { name, password, email });
        if (data.success) {
          localStorage.setItem("token", data.token);
          settoken(data.token);
          toast.success("Account created successfully!");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendurl}/api/user/login`, { password, email });
        if (data.success) {
          localStorage.setItem("token", data.token);
          settoken(data.token);
          toast.success("Logged in successfully!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }

    setemail('');
    setpassword('');
    setname('');
  };

  return (
    <form onSubmit={submitHandler} className='min-h-[80vh] flex items-center transition-colors duration-300'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-200 dark:border-gray-700 rounded-xl text-zinc-600 dark:text-gray-300 text-sm shadow-lg dark:shadow-2xl bg-white dark:bg-gray-800 transition-colors'>
        <p className='text-2xl font-semibold text-gray-800 dark:text-white'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state === "Sign Up" ? "sign up" : "log in"} to book an appointment</p>

        {state === "Sign Up" && (
          <div className='w-full'>
            <p className='dark:text-gray-400'>Full Name</p>
            <input className='border border-zinc-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6fff] transition-colors' type="text" onChange={(e) => setname(e.target.value)} value={name} required />
          </div>
        )}

        <div className='w-full'>
          <p className='dark:text-gray-400'>Email</p>
          <input className='border border-zinc-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6fff] transition-colors' type="email" onChange={(e) => setemail(e.target.value)} value={email} required />
        </div>

        <div className='w-full'>
          <p className='dark:text-gray-400'>Password</p>
          <input className='border border-zinc-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6fff] transition-colors' type="password" onChange={(e) => setpassword(e.target.value)} value={password} required />
        </div>

        <button type='submit' className='bg-[#5f6fff] dark:bg-blue-600 hover:bg-[#4a58e0] dark:hover:bg-blue-500 text-white w-full py-2 rounded-md text-base mt-2 shadow-sm transition-colors'>
          {state === 'Sign Up' ? "Create Account" : "Login"}
        </button>

        {state === "Sign Up" ? (
          <p className='mt-2'>Already have an account? <span onClick={() => setstate("Login")} className='text-[#5f6fff] dark:text-blue-400 underline cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 transition-colors'>Login Here</span></p>
        ) : (
          <p className='mt-2'>New here? <span onClick={() => setstate("Sign Up")} className='text-[#5f6fff] dark:text-blue-400 underline cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 transition-colors'>Create Account</span></p>
        )}
      </div>
    </form>
  );
};

export default Login;
