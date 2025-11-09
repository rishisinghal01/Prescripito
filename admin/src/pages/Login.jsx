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
      className="min-h-[80vh] flex items-center justify-center"
    >
      <div className="flex flex-col gap-3 p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white">
        <p className="text-2xl font-semibold text-center mb-4">
          <span className="text-[#5f6fff]">{state}</span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#5f6fff] text-white w-full py-2 mt-2 rounded-md text-base hover:bg-[#4e57ff] transition-all"
        >
          Login
        </button>

        {state === "Admin" ? (
          <p className="text-center mt-3">
            Doctor Login?{" "}
            <span
              className="text-[#5f6fff] underline cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click Here
            </span>
          </p>
        ) : (
          <p className="text-center mt-3">
            Admin Login?{" "}
            <span
              className="text-[#5f6fff] underline cursor-pointer"
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
