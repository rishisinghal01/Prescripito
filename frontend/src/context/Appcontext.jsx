import { createContext, useEffect, useState } from "react";
import axios from "axios"
export const AppContext = createContext();
import { toast } from 'react-toastify'
const AppContextProvider = (props) => {
  const currencysymbol = "$"
  const backendurl = import.meta.env.VITE_BACKEND_URL
  const [doctors, setdoctors] = useState([])
  const [token, settoken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : false)
  const [userData, setuserData] = useState(false);
  
  const loadUserData = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/user/get-profile`, {
        headers: {
          token: token
        }
      })
      if (data.success) {
        setuserData(data.user)
      }
      else {

        toast.error(data.message)
      }
    }
    catch (err) {

      toast.error(err.message)
    }
  }
  const getDoctordata = async () => {
    try {

      const { data } = await axios.get(`${backendurl}/api/doctor/list`)
      if (data.success) {
        setdoctors(data.doctors)
      }
      else {
        toast.error(data.message)
      }

    }

    catch (err) {
      toast.error(err.message)
    }
  }
  useEffect(() => {
    getDoctordata();
  }, [])
  useEffect(() => {
    if (token) {
      loadUserData();
    }
    else {
      setuserData(false)
    }
  }, [token])
  const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const value = {
    doctors, currencysymbol, token, settoken, backendurl, userData, setuserData, loadUserData, getDoctordata, theme, setTheme
  };
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
