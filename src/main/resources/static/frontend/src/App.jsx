import Contactform from "./components/forms/Contactform";
import Login from "./pages/auth/Login";
import Contact from "./pages/public/Contact";
import Home from "./pages/public/Home";
import Error from "./pages/public/Error";
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Package from "./pages/public/Package"
import Portfolio from "./pages/public/Portfolio"
import Booking from "./pages/public/Booking";
import Admin from "./pages/admin/Admin";
import Calendar2 from "./components/admin/Calendar2";
import AddAdminModal from "./components/admin/AddAdminModal";
import SetManualSchedule from "./components/admin/SetManualSchedule";

function App() {
  

  return (
    <>
    <BrowserRouter>
      {/* <Login/> */}
      {/* <Contact/> */}
      {/* <Home/> */}
      {/* <Error/> */}
      {/* <Package/> */}
      {/* <Portfolio/> */}
      {/* <Booking/> */}
      <Admin/>

      {/* <SetManualSchedule/> */}
      {/* <Calendar2/> */}

    </BrowserRouter>
      
      
    </>
  )
}

export default App
