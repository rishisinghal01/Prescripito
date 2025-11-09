import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdmincontextProvider = (props) => {
  const [aToken, setaToken] = useState(
    localStorage.getItem("atoken") ? localStorage.getItem("atoken") : ""
  );
  const [appointmentdata, setappointmentdata] = useState([])
  const [doctors, setdoctors] = useState([]);
  const [dashdata, setdashdata] = useState([])
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  // ✅ FIXED FUNCTION
  const changeAvailability = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendurl}/api/admin/change-availability`, // ✅ added backendurl
        { docId: id }, // ✅ fixed variable name
        {
          headers: { atoken: aToken }, // ✅ lowercase header to match backend
        }
      );

      if (data?.success) {
        toast.success(data.message);
        await getAllDoctors(); // ✅ refresh instantly
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("❌ changeAvailability Error:", err.message);
      toast.error(err.message);
    }
  };

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        `${backendurl}/api/admin/all-doctors`,
        {},
        {
          headers: {
            atoken: aToken, // ✅ Correct header key
          },
        }
      );

      if (data?.success) {
        setdoctors(data.doctors);
      } else {
        toast.error(data?.message || "Failed to fetch doctors");
      }
    } catch (error) {
      console.error("❌ getAllDoctors Error:", error.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };
  const appointment = async()=>{
    try{
    const {data}= await axios.get(`${backendurl}/api/admin/appointments`,{headers:{aToken:aToken}})
     if(data.success){
          setappointmentdata(data.appointments);
          toast.success(data.message)
     }
     else{
      toast.error(data.message)
     }
    }

    catch(error){
      toast.error(error.message)
      
    }
  }

  const cancelAppointment= async(appointmentId)=>{
    try{

      const {data}= await axios.post(`${backendurl}/api/admin/cancel-appointment`,{appointmentId},{headers:{aToken:aToken}})
      if(data.success){
        appointment();
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }
    }
    catch(err){
      toast.error(err.message)
    }
  }
  const getDashboardData = async () => {
  try {
    const { data } = await axios.get(`${backendurl}/api/admin/dashboard`, {
      headers: { aToken: aToken },
    });

    if (data.success) {
      setdashdata(data.dashdata);
      console.log("✅ Dashboard Data:", data.dashdata);
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error(err.message);
  }
};

  const value = {
    aToken,
    setaToken,
    backendurl,
    doctors,
    setdoctors,
    getAllDoctors,
    changeAvailability,
    appointmentdata,
    setappointmentdata,
    appointment, cancelAppointment,dashdata,getDashboardData
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdmincontextProvider;
