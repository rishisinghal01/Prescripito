import React, { useState, useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ChatModal = ({ isOpen, onClose, appointmentId, patientName }) => {
  const { backendurl, dToken, profileData } = useContext(DoctorContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Prescription State
  const [isPrescriptionMode, setIsPrescriptionMode] = useState(false);
  const [rxData, setRxData] = useState({
    symptoms: "",
    diagnosis: "",
    advice: ""
  });
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", duration: "" }]);

  useEffect(() => {
    if (isOpen && appointmentId) {
      // Fetch existing messages
      axios.get(`${backendurl}/api/appointment-chat/${appointmentId}`, { headers: { dToken } })
        .then(res => {
          if (res.data.success) {
            setMessages(res.data.messages);
          }
        }).catch(err => console.error("Error fetching chat:", err));

      // Connect to Socket.io
      socketRef.current = io(backendurl);
      
      socketRef.current.emit("join_appointment_room", appointmentId);

      socketRef.current.on("receive_message", (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [isOpen, appointmentId, backendurl, dToken]);

  useEffect(() => {
    if (!isPrescriptionMode) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isPrescriptionMode]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || !socketRef.current) return;

    const data = {
      appointmentId,
      senderType: 'Doctor',
      senderId: profileData?._id || 'doctor',
      text: input,
      attachmentUrl: "",
      attachmentName: "",
      attachmentType: "",
    };

    socketRef.current.emit("send_message", data);
    setInput("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadFile(file);
  };

  const uploadFile = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("attachment", file);

    try {
      const res = await axios.post(`${backendurl}/api/appointment-chat/upload`, formData, {
        headers: { dToken, "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        const data = {
          appointmentId,
          senderType: 'Doctor',
          senderId: profileData?._id || 'doctor',
          text: "",
          attachmentUrl: res.data.attachmentUrl,
          attachmentName: res.data.attachmentName,
          attachmentType: res.data.attachmentType,
        };
        socketRef.current.emit("send_message", data);
      } else {
        toast.error("Upload failed: " + res.data.message);
      }
    } catch (err) {
      toast.error("Upload error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);
  };

  const generatePrescription = async () => {
    if (!rxData.symptoms || !rxData.diagnosis) {
      toast.error("Please fill in symptoms and diagnosis.");
      return;
    }

    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text("Prescripito", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Doctor: ${profileData?.name || 'Doctor'}`, 14, 28);
    doc.text(`Patient: ${patientName}`, 14, 34);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 40);

    doc.setLineWidth(0.5);
    doc.line(14, 45, 196, 45);

    // Body
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Symptoms:", 14, 55);
    doc.setFontSize(10);
    doc.text(rxData.symptoms, 14, 62);

    doc.setFontSize(12);
    doc.text("Diagnosis:", 14, 75);
    doc.setFontSize(10);
    doc.text(rxData.diagnosis, 14, 82);

    // Medicines Table
    const tableData = medicines.filter(m => m.name).map(m => [m.name, m.dosage, m.duration]);
    if (tableData.length > 0) {
      autoTable(doc, {
        startY: 95,
        head: [['Medicine', 'Dosage', 'Duration']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
      });
    }

    // Advice
    if (rxData.advice) {
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 105;
      doc.setFontSize(12);
      doc.text("Additional Advice:", 14, finalY);
      doc.setFontSize(10);
      doc.text(rxData.advice, 14, finalY + 7);
    }

    // Convert PDF to File
    const pdfBlob = doc.output('blob');
    const file = new File([pdfBlob], `${patientName}_Prescription_${new Date().getTime()}.pdf`, { type: 'application/pdf' });
    
    // Upload and send
    await uploadFile(file);
    setIsPrescriptionMode(false);
    toast.success("Prescription sent successfully!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden h-[80vh] border border-indigo-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
          <div>
            <h3 className="font-semibold text-lg">{isPrescriptionMode ? `Write Prescription for ${patientName}` : `Chat with ${patientName}`}</h3>
            <p className="text-xs text-blue-100 opacity-90">{isPrescriptionMode ? 'Digital Rx Generator' : 'Real-time consultation'}</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            ✕
          </button>
        </div>

        {isPrescriptionMode ? (
          /* Prescription Mode UI */
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms</label>
              <textarea value={rxData.symptoms} onChange={(e) => setRxData({...rxData, symptoms: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" rows="2" placeholder="E.g. Fever, Cough"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
              <textarea value={rxData.diagnosis} onChange={(e) => setRxData({...rxData, diagnosis: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" rows="2" placeholder="E.g. Viral Infection"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
              {medicines.map((med, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input type="text" placeholder="Name" value={med.name} onChange={(e) => { const newMeds = [...medicines]; newMeds[index].name = e.target.value; setMedicines(newMeds); }} className="flex-1 p-2 border border-gray-300 rounded-lg text-sm" />
                  <input type="text" placeholder="Dosage" value={med.dosage} onChange={(e) => { const newMeds = [...medicines]; newMeds[index].dosage = e.target.value; setMedicines(newMeds); }} className="w-1/4 p-2 border border-gray-300 rounded-lg text-sm" />
                  <input type="text" placeholder="Duration" value={med.duration} onChange={(e) => { const newMeds = [...medicines]; newMeds[index].duration = e.target.value; setMedicines(newMeds); }} className="w-1/4 p-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              ))}
              <button type="button" onClick={addMedicine} className="text-blue-600 text-sm font-medium hover:underline">+ Add Medicine</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Advice</label>
              <textarea value={rxData.advice} onChange={(e) => setRxData({...rxData, advice: e.target.value})} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" rows="2" placeholder="E.g. Drink plenty of water"></textarea>
            </div>
          </div>
        ) : (
          /* Chat Messages UI */
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.length === 0 ? (
              <div className="flex justify-center items-center h-full text-gray-400 text-sm">
                No messages yet.
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.senderType === 'Doctor' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-[15px] shadow-sm ${msg.senderType === 'Doctor' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
                    
                    {msg.attachmentUrl && msg.attachmentType === 'image' && (
                      <a href={msg.attachmentUrl} target="_blank" rel="noreferrer">
                        <img src={msg.attachmentUrl} alt="attachment" className="w-full max-w-[200px] rounded-lg mb-2 cursor-pointer hover:opacity-90" />
                      </a>
                    )}
                    {msg.attachmentUrl && msg.attachmentType === 'pdf' && (
                      <a href={msg.attachmentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 mb-2 p-2 bg-black/10 rounded-lg hover:bg-black/20 transition-colors" title={msg.attachmentName}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500 shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span className="text-xs font-medium underline truncate max-w-[150px]">{msg.attachmentName || "View PDF Document"}</span>
                      </a>
                    )}
                    
                    {msg.text && <div>{msg.text}</div>}
                    
                    <div className={`text-[10px] mt-1 text-right ${msg.senderType === 'Doctor' ? 'text-blue-200' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-200">
          {isPrescriptionMode ? (
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsPrescriptionMode(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-full font-medium text-sm transition-colors">
                Cancel
              </button>
              <button type="button" onClick={generatePrescription} disabled={isUploading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-full font-medium text-sm transition-colors shadow-md flex justify-center items-center gap-2">
                {isUploading ? "Sending..." : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                    Send Prescription
                  </>
                )}
              </button>
            </div>
          ) : (
            <form onSubmit={sendMessage} className="flex gap-2 items-center">
              
              {/* Prescription Button */}
              <button 
                type="button" 
                title="Write Prescription"
                onClick={() => setIsPrescriptionMode(true)}
                className="p-2 text-blue-500 hover:text-white hover:bg-blue-500 rounded-full transition-colors bg-blue-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </button>

              {/* Attachment Button */}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/*,.pdf"
              />
              <button 
                type="button" 
                title="Attach File"
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                )}
              </button>

              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..." 
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all"
              />
              <button type="submit" disabled={isUploading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-full font-medium text-sm transition-colors shadow-md">
                Send
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChatModal;
