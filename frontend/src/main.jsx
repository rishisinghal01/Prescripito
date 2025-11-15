import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/Appcontext.jsx'
import ChatContextProvider from './context/Chatcontext.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ChatContextProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ChatContextProvider>
  </BrowserRouter>
)
