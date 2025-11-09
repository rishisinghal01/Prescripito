import { useState } from "react";
import { createContext } from "react";
import axios from "axios"
import {toast} from 'react-toastify'
export const DoctorContext = createContext();

const DoctorcontextProvider = (props) => {
  const backendurl= import.meta.env.VITE_BACKEND_URL;
const [doctordash, setdoctordash] = useState([])
  const [dToken, setdToken] = useState(
    localStorage.getItem("dtoken") ? localStorage.getItem("dtoken") : ""
  );
  const [profileData, setprofileData] = useState(false)
  const [appointment, setappointment] = useState([]);
 const calculateAge= (dob)=>{
         const today=new Date()
         const birthdate= new Date(dob)
         let age= today.getFullYear()-birthdate.getFullYear();
         return age
  }
  const completeAppointment = async(appointmentId)=>{
    try{
        const {data}= await axios.post(`${backendurl}/api/doctor/complete-appointment`,{appointmentId},{headers:{dToken:dToken}})

        if(data.success){
           toast.success(data.message)
           docappointments()
        }
        else{
          toast.error(data.message)
        }
    }

    catch(err){
      toast.error(err.message)
    }
  }
  const cancelAppointment = async(appointmentId)=>{
    try{
        const {data}= await axios.post(`${backendurl}/api/doctor/cancel-appointment`,{appointmentId},{headers:{dToken:dToken}})

        if(data.success){

           toast.success(data.message)
           docappointments()
        }
        else{
          toast.error(data.message)
        }
    }

    catch(err){
      toast.error(err.message)
    }
  }
 const docappointments = async () => {
  try {
    const { data } = await axios.get(
      `${backendurl}/api/doctor/appointments`,
      { headers: { dtoken: dToken } } // ✅ only headers
    );

    if (data.success) {
      setappointment(data.appointment.reverse()); // ✅ matches backend key
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error(err.message);
  }
};

const getprofileData = async()=>{
  try{
    const {data} = await axios.get(`${backendurl}/api/doctor/profile`,{headers:{dtoken:dToken}})
    if(data.success){
      setprofileData(data.profileData);
    }
    else{
      toast.error(data.message)
    }
  }
  catch(err){
    toast.error(err.message)
  }

}


 

  const doctordashdata= async()=>{
        try{

          const {data}= await axios.get(`${backendurl}/api/doctor/dashboard`,{headers:{dToken:dToken}})

          if(data.success){
            setdoctordash(data.dashdata);

          }
          else{
            toast.error(data.error)
          }
        }
        catch(err){
          toast.error(err.message)
        }
  }
   const value = {
    backendurl,
    dToken,setdToken,
    docappointments,appointment,calculateAge,completeAppointment,cancelAppointment,doctordash,setdoctordash,doctordashdata,getprofileData,profileData,setprofileData
  };

  
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorcontextProvider;
