import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const AppcontextProvider = (props) => {
  const calculateAge= (dob)=>{
         const today=new Date()
         const birthdate= new Date(dob)
         let age= today.getFullYear()-birthdate.getFullYear();
         return age
  }
  const months=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Dec"]
  const slotdateFormat =(slotDate)=>{
    const dateArray = slotDate.split("_");
    return dateArray[0]+" "+months[Number(dateArray[1])] +" "+ dateArray[2]
  }
  const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const value = {
    calculateAge, slotdateFormat, theme, setTheme
  };



  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppcontextProvider;
