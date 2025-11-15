import React from "react";
import { Route, Routes, useNavigate, useLocation, Navigate } from "react-router-dom";
import { chatassets } from "../assets/gpt-assets/chatasset";
import Ai from "./Ai";
import { useContext } from "react";
import { ChatContext } from "../context/Chatcontext";
import Loading from "../pages/Loading";

const Completeai = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {user,loadinguser}= useContext(ChatContext)
  const isAiPage = location.pathname.startsWith("/ai");
if (location.pathname === "/ai/loading" || loadinguser) {
  return <Loading />;
}
  return (
    <div>
      {/* Floating Icon - only show when not inside /ai */}
      {!isAiPage && (
        <img
          src={chatassets.logo}
          alt="AI Assistant"
          onClick={() => navigate("/ai/chatbot")}
          className="cursor-pointer w-14 h-14 fixed bottom-5 right-5 shadow-xl hover:scale-110 transition-transform duration-200 rounded-full bg-white p-2 border border-[#5f6fff]/40"
        />
      )}

      {/* AI Routes */}
      <Routes>
        <Route path="/ai/*" element={<Ai />} />
        {/* Redirect /ai → /ai/chatbot */}
        <Route path="/ai" element={<Navigate to="/ai/chatbot" replace />} />
      </Routes>
    </div>
  );
};

export default Completeai;
