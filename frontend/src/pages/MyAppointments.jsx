import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Appcontext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendurl, token, getDoctordata, userData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/user/get-appointments`, {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendurl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctordata();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // CREATE ORDER (frontend trigger)
  const appointmentFees = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendurl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success && data.order) {
        initPay(data.order);
      } else {
        toast.error(data.message || "Failed to create Razorpay order");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // INIT PAYMENT (minimal options to avoid tokenization issues in test mode)
 const initPay = (order) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "Prescripto Health",
    order_id: order.id,

    handler: async function (response) {
      try {
        const { data } = await axios.post(
          `${backendurl}/api/user/verify-razorpay`,
          response,
          { headers: { token } }
        );

        if (data.success) {
          toast.success("Payment successful!");
          getUserAppointments();
          navigate("/my-appointments");
        }
      } catch (err) {
        toast.error("Verification failed");
      }
    },

    checkout: {
      popup: true,                // forces old checkout
      method: { card: true },     // only card enabled
    },
  };

  // 👇 IMPORTANT: use SAME variable name everywhere
  const rzp = new window.Razorpay(options);

  rzp.open();

  rzp.on("payment.failed", function (response) {
    toast.error("Payment failed: " + (response?.error?.description || "Error"));
  });
  console.log(import.meta.env.VITE_RAZORPAY_KEY_ID)
};


  useEffect(() => {
    if (token) getUserAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>

      <div>
        {appointments.map((item, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_3fr] gap-4 sm:flex sm:gap-6 py-2 border-b">
            <div>
              <img className="w-32 bg-indigo-50" src={item.docData.image} alt="" />
            </div>

            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.docData.address?.line1}</p>
              <p className="text-xs">{item.docData.address?.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">Date & Time:</span>{" "}
                {item.slotDate.replaceAll("_", "/")} | {item.slotTime}
              </p>
            </div>

            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded bg-indigo-50 text-stone-500">Paid</button>
              )}

              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => appointmentFees(item._id)}
                  className="sm:min-w-48 py-2 border rounded hover:bg-[#5f6fff] hover:text-white transition-all"
                >
                  Pay Online
                </button>
              )}

              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all"
                >
                  Cancel Appointment
                </button>
              )}

              {item.cancelled && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded text-red-500 border-red-500">Cancelled Appointment</button>
              )}

              {item.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded border-green-500 text-green-500">Completed</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
