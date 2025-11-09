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
    <form onSubmit={submitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state === "Sign Up" ? "sign up" : "log in"} to book an appointment</p>

        {state === "Sign Up" && (
          <div className='w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setname(e.target.value)} value={name} required />
          </div>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setemail(e.target.value)} value={email} required />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setpassword(e.target.value)} value={password} required />
        </div>

        <button type='submit' className='bg-[#5f6fff] text-white w-full py-2 rounded-md text-base'>
          {state === 'Sign Up' ? "Create Account" : "Login"}
        </button>

        {state === "Sign Up" ? (
          <p>Already have an account? <span onClick={() => setstate("Login")} className='text-[#5f6fff] underline cursor-pointer'>Login Here</span></p>
        ) : (
          <p>New here? <span onClick={() => setstate("Sign Up")} className='text-[#5f6fff] underline cursor-pointer'>Create Account</span></p>
        )}
      </div>
    </form>
  );
};

export default Login;
