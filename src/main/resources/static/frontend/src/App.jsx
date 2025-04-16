import Contactform from "./components/forms/Contactform";
import Login from "./pages/auth/Login";
import Contact from "./pages/public/Contact";
import Home from "./pages/public/Home";
import Error from "./pages/public/Error";
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Package from "./pages/public/Package"
import Portfolio from "./pages/public/Portfolio"

function App() {
  

  return (
    <>
    <BrowserRouter>
      {/* <Login/> */}
      {/* <Contact/> */}
      <Home/>
      {/* <Error/> */}
      {/* <Package/> */}
      {/* <Portfolio/> */}

    </BrowserRouter>
      
      
    </>
  )
}

export default App
