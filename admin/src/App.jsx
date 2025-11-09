import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointment from './pages/Admin/AllAppointment';
import DoctorList from './pages/Admin/DoctorList';
import AddDoctor from './pages/Admin/AddDoctor';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctors/DoctorDashboard';
import DoctorsAppointments from './pages/Doctors/DoctorsAppointments';
import DoctorProfile from './pages/Doctors/DoctorProfile';

const App = () => {
  const { aToken } = useContext(AdminContext)
  const {dToken}= useContext(DoctorContext)
  return aToken || dToken ? (
    <div>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointment />} />
          <Route path="/doctor-list" element={<DoctorList />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          {/* Doctor Routes */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor-appointments" element={<DoctorsAppointments/>} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />

        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App
