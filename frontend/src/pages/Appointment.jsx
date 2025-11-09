import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/Appcontext'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'
import appointmentModel from '../../../backend/models/appointmentModel'

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const daysofWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const { doctors, token, currencysymbol, getDoctordata, backendurl } = useContext(AppContext)
  const [docInfo, setdocInfo] = useState(null)
  const [docSlots, setdocSlots] = useState([])
  const [slotIndex, setslotIndex] = useState(0)
  const [slotTime, setslotTime] = useState('')
  const fetchDocInfo = async () => {
    const docinfo = doctors.find(doc => String(doc._id) === String(docId))
    setdocInfo(docinfo)
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to Book Appointment")
      return navigate('/login')
    }
    try {
      const date = docSlots[slotIndex][0].datetime
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year

      const { data } = await axios.post(`${backendurl}/api/user/book-appointment`, { docId, slotDate, slotTime }, { headers: { token: token } });
      if (data.success) {
        toast.success(data.message);
        getDoctordata();
        navigate('/my-appointments')
      }

      else {
        toast.error(data.message);
      }


    }
    catch (error) {
      toast.error(data.message);
    }

  }

  useEffect(() => {
    fetchDocInfo()
  }, [docId, doctors])

  useEffect(() => {
    if (docInfo) getAvailableSlots()
  }, [docInfo])

  const getAvailableSlots = async () => {
    setdocSlots([])

    let today = new Date()
    const hourNow = today.getHours()

    // ✅ If it's already past 9 PM, start from tomorrow
    if (hourNow >= 21) {
      today.setDate(today.getDate() + 1)
      today.setHours(0, 0, 0, 0)
    }

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let startTime = new Date(currentDate)
      let endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)

      if (i === 0) {
        // ✅ For today, start from current time + 1 hour (if <9 PM)
        const now = new Date()
        if (hourNow < 21) {
          startTime.setHours(Math.max(now.getHours() + 1, 10))
          startTime.setMinutes(now.getMinutes() > 30 ? 30 : 0)
        } else {
          startTime.setHours(10)
          startTime.setMinutes(0)
        }
      } else {
        startTime.setHours(10)
        startTime.setMinutes(0)
      }

      let timeSlots = []
      while (startTime < endTime) {
        let formattedTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

let date = currentDate.getDate();
let month = currentDate.getMonth() + 1;
let year = currentDate.getFullYear();
let slot_date = date + "_" + month + "_" + year;

const isslotAvailable =
  docInfo.slots_booked &&
  docInfo.slots_booked[slot_date] &&
  docInfo.slots_booked[slot_date].includes(formattedTime)
    ? false
    : true;

if (isslotAvailable) {
  timeSlots.push({
    datetime: new Date(startTime),
    time: formattedTime,
  });
}



        startTime.setMinutes(startTime.getMinutes() + 30)
      }

      setdocSlots(prev => [...prev, timeSlots])
    }
  }


  useEffect(() => {
  }, [docSlots])

  return (
    docInfo && (
      <div>
        <div className='flex flex-col gap-4 sm:flex-row'>
          <div>
            <img
              className='bg-[#5f6fff] w-full sm:max-w-72 rounded-lg'
              src={docInfo.image}
              alt=''
            />
          </div>
          <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              {docInfo.name} <img className='w-5' src={assets.verified_icon} alt='' />
            </p>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
            </div>
            <div>
              <p className='flex items-center gap-1 text-sm font-medium mt-3 text-gray-600'>
                About <img src={assets.info_icon} alt='' />
              </p>
              <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
            </div>
            <p className='text-gray-500 font-medium mt-4'>
              Appointment Fee: <span className='text-gray-500'>{currencysymbol}{docInfo.fees}</span>
            </p>
          </div>
        </div>

        {/* ------- Booking Slots --------- */}
        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700 '>
          <p>Booking Slots</p>

          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {
              docSlots.length > 0 && docSlots.map((item, idx) => (
                <div
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === idx ? "bg-[#5f6fff] text-white" : "border border-gray-200"}`}
                  key={idx}
                  onClick={() => setslotIndex(idx)}
                >
                  <p>{item[0] && daysofWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
            }
          </div>
          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
            {docSlots.length && docSlots[slotIndex].map((item, idx) => {
              return <p onClick={() => { setslotTime(item.time) }} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? "bg-[#5f6fff] text-white" : "text-gray-400 border border-gray-300"} `} key={idx}>
                {item.time.toLowerCase()}
              </p>
            })}
          </div>
          <button onClick={bookAppointment} className='bg-[#5f6fff] text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>
        </div>
        {/* Listing Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  )
}

export default Appointment
