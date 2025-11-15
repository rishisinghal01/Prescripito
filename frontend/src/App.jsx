import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import Myprofile from "./pages/Myprofile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import Completeai from "./components/Completeai";
import Ai from "./components/Ai";


const App = () => {
  const location = useLocation(); // 👈 detect current route

  const isAiPage = location.pathname === "/ai"; // 👈 clean boolean

  return (
    <div className="">
      <div className="mx-4 sm:mx-[10%]">
        {/* ✅ Navbar should show on all pages */}
        <Navbar />

        <ToastContainer />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-profile" element={<Myprofile />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/appointment/:docId" element={<Appointment />} />
          <Route path="/ai" element={<Ai />} />
        </Routes>

        {/* ✅ Floating AI icon on all pages except /ai */}
        {!isAiPage && <Completeai />}

        {/* ✅ Footer visible everywhere EXCEPT on /ai */}
        {!isAiPage && <Footer />}
      </div>
    </div>
  );
};

export default App;
