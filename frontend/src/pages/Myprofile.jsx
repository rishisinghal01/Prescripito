import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { AppContext } from '../context/Appcontext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Myprofile = () => {
  const {userData, setuserData,backendurl,token,loadUserData} = useContext(AppContext)

  const [isEdit, setisEdit] = useState(false)
const [image, setimage] = useState(false);
 const updateuserProfile = async () => {
  try {
    const formdata = new FormData();
    formdata.append("name", userData.name);
    formdata.append("phone", userData.phone);
    formdata.append("gender", userData.gender);
    formdata.append("dob", userData.dob);
    formdata.append("address", JSON.stringify(userData.address));
    if (image) formdata.append("image", image);

    const { data } = await axios.post(
      `${backendurl}/api/user/update-profile`,
      formdata,
      {
        headers: {
          token: token,
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      await loadUserData();   // ✅ Refresh data instantly
      setisEdit(false);
      setimage(null);         // ✅ Clear image state
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>

      {isEdit?<label htmlFor='image'>
        <div className='inline-block relative cursor-pointer'>
          <img  className="w-36 rounded opacity-75 " src={image?URL.createObjectURL(image):userData.image} alt="" />
          <img className='w-10 absolute bottom-12 right-12' src={image?"":assets.upload_icon} alt="" />

        </div>
        <input onChange={(e)=>setimage(e.target.files[0])} type="file" name="" id="image" hidden />
      </label>:
      
      <img className='w-36 rounded' src={userData.image} alt="Profile" />
      }

      {isEdit ? (
        <input
          className='bg-gray-50 text-3xl font-medium max-w-60 mt-4 outline-none border-b border-gray-300 focus:border-[#5f6fff]'
          value={userData.name}
          onChange={(e) => setuserData(prev => ({ ...prev, name: e.target.value }))}
          type='text'
        />
      ) : (
        <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      )}

      <hr className='bg-zinc-400 h-[1px] border-none mt-3' />

      {/* -------- Contact Information -------- */}
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>

          <p className='font-medium'>Phone:</p>
          {isEdit ? (
            <input
              className='bg-gray-50 max-w-52 outline-none border-b border-gray-300 focus:border-[#5f6fff]'
              value={userData.phone}
              onChange={(e) => setuserData(prev => ({ ...prev, phone: e.target.value }))}
              type='text'
            />
          ) : (
            <p className='text-blue-400'>{userData.phone}</p>
          )}

          <p className='font-medium'>Address:</p>
         {isEdit ? (
  <div>
    <input
      className="bg-gray-50 w-full outline-none border-b border-gray-300 focus:border-[#5f6fff]"
      onChange={(e) =>
        setuserData((prev) => ({
          ...prev,
          address: { ...(prev.address || {}), line1: e.target.value },
        }))
      }
      value={userData?.address?.line1 || ""}
      type="text"
      placeholder="Line 1"
    />
    <input
      className="bg-gray-50 w-full outline-none border-b border-gray-300 focus:border-[#5f6fff] mt-1"
      onChange={(e) =>
        setuserData((prev) => ({
          ...prev,
          address: { ...(prev.address || {}), line2: e.target.value },
        }))
      }
      value={userData?.address?.line2 || ""}
      type="text"
      placeholder="Line 2"
    />
  </div>
) : (
  <p className="text-gray-500">
    {userData?.address?.line1 || "—"}
    <br />
    {userData?.address?.line2 || ""}
  </p>
)}

        </div>
      </div>

      {/* -------- Basic Information -------- */}
      <div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {isEdit ? (
            <select
              className='max-w-20 bg-gray-100 border-b border-gray-300 focus:border-[#5f6fff] outline-none'
              value={userData.gender}
              onChange={(e) => setuserData(prev => ({ ...prev, gender: e.target.value }))}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className='text-gray-400'>{userData.gender}</p>
          )}

          <p className='font-medium'>Birthday:</p>
          {isEdit ? (
            <input
              className='max-w-28 bg-gray-100 border-b border-gray-300 focus:border-[#5f6fff] outline-none'
              type="date"
              value={userData.dob}
              onChange={(e) => setuserData(prev => ({ ...prev, dob: e.target.value }))}
            />
          ) : (
            <p className='text-gray-400'>{userData.dob}</p>
          )}
        </div>
      </div>

      {/* -------- Buttons -------- */}
      <div className='mt-10'>
        {isEdit ? (
          <button
            className='border border-[#5f6fff] px-8 py-2 rounded-full hover:bg-[#5f6fff] hover:text-white transition-all duration-500'
            onClick={updateuserProfile}
          >
            Save Information
          </button>
        ) : (
          <button
            className='border border-[#5f6fff] px-8 py-2 rounded-full hover:bg-[#5f6fff] hover:text-white transition-all duration-500'
            onClick={() => setisEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}

export default Myprofile
