import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets_admin/assets'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddDoctor = () => {

    const [docImg, setdocImg] = useState(false)
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [experience, setexperience] = useState("1 Year")
    const [fees, setfees] = useState("")
    const [speciality, setspeciality] = useState("General physician")
    const [degree, setdegree] = useState("")
    const [address1, setaddress1] = useState("")
    const [address2, setaddress2] = useState("")
    const [about, setabout] = useState("")
    const { backendurl, aToken } = useContext(AdminContext);

    const submithandler = async (e) => {
        e.preventDefault();
        try {
            if (!docImg) {
                return toast.error("Please upload doctor image")
            }
            const formdata = new FormData();
            formdata.append("name", name);
            formdata.append("email", email);
            formdata.append("password", password);
            formdata.append("experience", experience);
            formdata.append("fees", fees);
            formdata.append("speciality", speciality);
            formdata.append("degree",degree);
            formdata.append("address", JSON.stringify({ line1: address1, line2: address2 }));
            formdata.append("about", about);
            formdata.append("image", docImg);

 const { data } = await axios.post(`${backendurl}/api/admin/add-doctor`, formdata, {
  headers: {
    aToken: aToken,                          // ✅ your auth token
    'Content-Type': 'multipart/form-data'    // ✅ correctly placed inside headers
  }
});


  if(data.success){
    toast.success(data.message)
    setname("")
    setemail("")
    setpassword("")
    setexperience("1 Year")
    setfees("")
    setspeciality("General physician")
    setdegree("")
    setaddress1("")
    setaddress2("")
    setabout("")
    setdocImg(false)
  }
  else{
    toast.error(data.message)
  }
            
        }
        catch (err) {
    toast.error(err.message)
    console.log(err);
        }
    }
    return (
        <form onSubmit={submithandler} action="" className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Doctor</p>
            <div className='bg-white px-8 py-8 border border-gray-100 rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll shadow-lg  '>
                <div className='flex items-center gap-4 mb-8 text-gray-500  '>


                    <label htmlFor="doc-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setdocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                    <p>Upload doctor <br />picture </p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4 '>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Name</p>
                            <input onChange={(e) => { setname(e.target.value) }} value={name} className='border  border-gray-100 rounded px-3 py-2' type="text" placeholder="Name" id="" />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={(e) => { setemail(e.target.value) }} value={email} className='border  border-gray-100 rounded px-3 py-2' type="text" placeholder="Email" id="" />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Password</p>
                            <input onChange={(e) => { setpassword(e.target.value) }} value={password} className='border  border-gray-100 rounded px-3 py-2' type="password" placeholder="Password" id="" />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experience</p>
                            <select onChange={(e) => { setexperience(e.target.value) }} value={experience} className='border  border-gray-100 rounded px-3 py-2' name="" id="">
                                <option value="1 Year">1 year</option>
                                <option value="2 Year">2 year</option>
                                <option value="3 Year">3 year</option>
                                <option value="4 Year">4 year</option>
                                <option value="5 Year">5 year</option>
                                <option value="6 Year">6 year</option>
                                <option value="7 Year">7 year</option>
                                <option value="8 Year">8 year</option>
                                <option value="9 Year">9 year</option>
                                <option value="10 Year">10 year</option>

                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={(e) => { setfees(e.target.value) }} value={fees} className='border  border-gray-100 rounded px-3 py-2' type="text" placeholder="Fees" id="" />
                        </div>
                    </div>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Specaility </p>
                            <select onChange={(e) => { setspeciality(e.target.value) }} value={speciality} className='border  border-gray-100 rounded px-3 py-2' name="" id="">
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>

                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Education</p>
                            <input onChange={(e) => { setdegree(e.target.value) }} value={degree} className='border  border-gray-100 rounded px-3 py-2' type="text" placeholder='Education' name="" id="" />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={(e) => { setaddress1(e.target.value) }} value={address1} className='border  border-gray-100 rounded px-3 py-2' type="text" placeholder='address 1' name="" id="" required />
                            <input onChange={(e) => { setaddress2(e.target.value) }} value={address2} className='border  border-gray-100 rounded px-3 py-2' type="text" placeholder='address 2' name="" id="" required />

                        </div>

                    </div>
                </div>
                <div>
                    <p className='mt-4 mb-2'>About Doctor</p>
                    <textarea onChange={(e) => { setabout(e.target.value) }} value={about} className='w-full py-4 pt-2 border  border-gray-100 rounded ' name="" type="text" placeholder='Write some about doctor' rows={5} id=""></textarea>
                </div>
                <button type='submit' className='bg-[#5f6fff] px-10 py-3 mt-4 text-white rounded-full'>Add Doctor</button>
            </div>
        </form>
    )
}

export default AddDoctor