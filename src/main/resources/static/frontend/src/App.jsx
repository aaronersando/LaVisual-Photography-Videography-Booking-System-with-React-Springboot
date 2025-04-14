import Contactform from "./components/forms/Contactform";
import Login from "./pages/auth/Login";
import Contact from "./pages/public/Contact";
import Home from "./pages/public/Home";
import Error from "./pages/public/Error";
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  

  return (
    <>
    <BrowserRouter>
      <Error/>
    </BrowserRouter>
      {/* <Login/> */}
      {/* <Contact/> */}
      {/* <Home/> */}
      
    </>
  )
}

export default App
