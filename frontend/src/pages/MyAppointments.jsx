import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/Appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';
import {useNavigate} from "react-router-dom"
const MyAppointments = () => {
  const { backendurl, token ,getDoctordata} = useContext(AppContext);
  const [appointments, setappointments] = useState([]);
const navigate= useNavigate();
  const getuserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/user/get-appointments`, {
        headers: { token: token }, // ✅ lowercase 'headers'
      });

      if (data.success) {
        setappointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId)=>{
        try{
           const {data} = await axios.post(`${backendurl}/api/user/cancel-appointment`,{appointmentId},{headers:{token:token}})     
           if(data.success){

            toast.success(data.message);
            getuserAppointments();
            getDoctordata();
           }   
           else{
            toast.error(data.message)
           }
        }
        catch(error){
          toast.error(error.message)
        }
  }

 const appointmentFees = async (appointmentId) => {
  try {
    const { data } = await axios.post(
      `${backendurl}/api/user/payment-razorpay`,
      { appointmentId },
      { headers: { token: token } }
    );

    if (data.success && data.order) {
      console.log("✅ Razorpay order created:", data.order);
      initPay(data.order);
    } else {
      toast.error(data.message || "Failed to create Razorpay order");
    }
  } catch (error) {
    console.error("Payment error:", error);
    toast.error(error.response?.data?.message || error.message);
  }
};

const initPay = (order) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ✅ from .env (must match backend key)
    amount: order.amount,
    currency: order.currency,
    name: "Prescripto Health",
    description: "Doctor Appointment Payment",
    order_id: order.id,
    receipt: order.receipt,
    handler: async function (response) {
      console.log("Payment success response:", response);
      toast.success("Payment successful!");
      try{
        const {data}=await axios.post(`${backendurl}/api/user/verify-razorpay`,response,{headers:{token:token}})
        if(data.success){
           getuserAppointments();
           navigate('/my-appointments')
        }
      }
      catch(error){
       console.log(error);
       toast.error(error.message);
        
      }
    },
    prefill: {
      name: userData?.name || "User",
      email: userData?.email || "",
      contact: userData?.phone || "",
    },
    theme: {
      color: "#5f6fff",
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();

  razorpay.on("payment.failed", function (response) {
    console.error("Payment failed:", response.error);
    toast.error("Payment failed: " + response.error.description);
  });
};


  useEffect(() => {
    if (token) {getuserAppointments()
    };
  }, [token]);

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>

      <div>
        {appointments.map((item, idx) => (
          <div
            key={idx}
            className='grid grid-cols-[1fr_3fr] gap-4 sm:flex sm:gap-6 py-2 border-b'
          >
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt='' />
            </div>

            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address?.line1}</p>
              <p className='text-xs'>{item.docData.address?.line2}</p>
              <p className='text-xs mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{' '}
                {item.slotDate.replaceAll('_', '/')} | {item.slotTime}
              </p>
            </div>

            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
             {!item.cancelled && !item.payment && !item.isCompleted &&  <button onClick={()=>{appointmentFees(item._id)}} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5f6fff] hover:text-white transition-all duration-300'>
                Pay Online
              </button> }
            {!item.cancelled && !item.isCompleted &&  <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
                Cancel Appointment
              </button> } 
              {item.cancelled && !item.isCompleted && <button className='sm:min-w:48 py-2 px-2 border border-red-500 rounded text-red-500'>Cancelled Appointment</button>}
              {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
