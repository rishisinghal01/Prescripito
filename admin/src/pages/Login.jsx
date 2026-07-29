import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_admin/assets";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {  backendurl, dToken, setdToken } = useContext(DoctorContext);
const {setaToken}= useContext(AdminContext)
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Admin") {
        // ✅ ADMIN LOGIN
        const { data } = await axios.post(`${backendurl}/api/admin/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("atoken", data.token);
          setaToken(data.token);
          toast.success("Admin login successful!");
        } else {
          toast.error(data.message);
        }
      } else {
        // ✅ DOCTOR LOGIN
        const { data } = await axios.post(`${backendurl}/api/doctor/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("dtoken", data.token);
          setdToken(data.token);
          console.log(dToken)

          toast.success("Doctor login successful!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="min-h-[80vh] flex items-center justify-center transition-colors duration-300"
    >
      <div className="flex flex-col gap-3 p-8 min-w-[340px] sm:min-w-96 border border-gray-200 dark:border-gray-700 rounded-xl text-[#5E5E5E] dark:text-gray-300 text-sm shadow-lg dark:shadow-2xl bg-white dark:bg-gray-800 transition-colors">
        <p className="text-2xl font-semibold text-center mb-4 dark:text-white">
          <span className="text-[#5f6fff] dark:text-blue-400">{state}</span> Login
        </p>

        <div className="w-full">
          <p className="dark:text-gray-400">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6fff] transition-colors"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p className="dark:text-gray-400">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded w-full p-2 mt-1 focus:outline-none focus:border-[#5f6fff] transition-colors"
            type="password"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#5f6fff] dark:bg-blue-600 text-white w-full py-2 mt-2 rounded-md text-base hover:bg-[#4e57ff] dark:hover:bg-blue-500 transition-all shadow-sm"
        >
          Login
        </button>

        {state === "Admin" ? (
          <p className="text-center mt-3">
            Doctor Login?{" "}
            <span
              className="text-[#5f6fff] dark:text-blue-400 underline cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              onClick={() => setState("Doctor")}
            >
              Click Here
            </span>
          </p>
        ) : (
          <p className="text-center mt-3">
            Admin Login?{" "}
            <span
              className="text-[#5f6fff] dark:text-blue-400 underline cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              onClick={() => setState("Admin")}
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
