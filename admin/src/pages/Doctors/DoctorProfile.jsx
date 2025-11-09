import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorProfile = () => {
  const { getprofileData, dToken, profileData, setprofileData, backendurl } = useContext(DoctorContext);
  const [isEdit, setisEdit] = useState(false);

  useEffect(() => {
    if (dToken) getprofileData();
  }, [dToken]);

  const updateprofile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
        name: profileData.name
      };

      const { data } = await axios.post(
        `${backendurl}/api/doctor/update-profile`, // ✅ FIXED route
        updateData,
        { headers: { dtoken: dToken } } // ✅ lowercase header
      );

      if (data.success) {
        toast.success(data.message);
        setisEdit(false);
        getprofileData(); // refresh profile after saving
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return profileData && (
    <div>
      <div className='flex flex-col gap-4 m-5'>
        <div>
          <img className='bg-[#5f6fff]/80 w-full sm:max-w-64 rounded-lg ' src={profileData.image} alt="" />
        </div>
        <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
          <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>
            {isEdit ? (
              <input
                type='text'
                onChange={(e) =>
                  setprofileData((prev) => ({ ...prev, name: e.target.value }))
                }
                value={profileData.name}
              />
            ) : (
              profileData.name
            )}
          </p>

          <div className='flex items-center gap-2 mt-1 text-gray-600'>
            <p>{profileData.degree}</p> - <p>{profileData.speciality}</p>
            <button className='px-2 py-0.5 border text-xs rounded-full border-gray-100'>
              {profileData.experience}
            </button>
          </div>

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
              {profileData.about}
            </p>
          </div>

          <p className='text-gray-600 font-medium mt-4'>
            Appointment fees:{" "}
            <span className='text-gray-800'>
              ${" "}
              {isEdit ? (
                <input
                  type='text'
                  value={profileData.fees}
                  onChange={(e) =>
                    setprofileData((prev) => ({ ...prev, fees: e.target.value }))
                  }
                />
              ) : (
                profileData.fees
              )}
            </span>
          </p>

          <div className='flex gap-2 py-2'>
            <p>Address:</p>
            <p className='text-sm'>
              {isEdit ? (
                <input
                  type='text'
                  onChange={(e) =>
                    setprofileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  value={profileData.address.line1}
                />
              ) : (
                profileData.address.line1
              )}
              <br />
              {isEdit ? (
                <input
                  type='text'
                  onChange={(e) =>
                    setprofileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  value={profileData.address.line2}
                />
              ) : (
                profileData.address.line2
              )}
            </p>
          </div>

          <div className='flex gap-1 pt-2'>
            <input
              onChange={() =>
                isEdit &&
                setprofileData((prev) => ({
                  ...prev,
                  available: !prev.available,
                }))
              }
              checked={profileData.available}
              type='checkbox'
              id='Available'
            />
            <label htmlFor='Available'>Available</label>
          </div>

          {isEdit ? (
            <button
              onClick={updateprofile}
              className='px-4 py-1 border-[#5f6fff] border text-sm rounded-full mt-5 hover:bg-[#5f6fff] hover:transition-all duration-500 hover:text-white'
            >
              Save information
            </button>
          ) : (
            <button
              onClick={() => setisEdit(true)}
              className='px-4 py-1 border-[#5f6fff] border text-sm rounded-full mt-5 hover:bg-[#5f6fff] hover:transition-all duration-500 hover:text-white'
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
