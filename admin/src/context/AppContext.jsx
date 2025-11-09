import { createContext } from "react";

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
  const value = {
    calculateAge,slotdateFormat
  };



  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppcontextProvider;
