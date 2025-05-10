// Import Main Dependencies
import React from 'react';
import { BrowserRouter, createBrowserRouter, RouterProvider, Routes, Route, Navigate } from "react-router-dom";

// Import of main pages & components for the whole website
import Login from "./pages/auth/Login";
import Contact from "./pages/public/Contact";
import Home from "./pages/public/Home";
import Error from "./pages/public/Error";
import About from "./pages/public/About";
import Package from "./pages/public/Package"
import Portfolio from "./pages/public/Portfolio"
import Booking from "./pages/public/Booking";
import Admin from "./pages/admin/Admin";

// Import minor components
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedAdminRoute from "./components/common/ProtectedRoute";

// Main App
function App() {
  return (
    <>
    <BrowserRouter> {/* Imported */}
      <ScrollToTop /> {/* Custom component for scrolling to top whenever swtiching pages  */}
      <Routes> {/* Container component that manages the following route definitions */}
        <Route path={"/"} element={<Home/>} /> 
        <Route path={"/home"} element={<Home/>}/>
        <Route path={"/contact"} element={<Contact/>}/>
        <Route path={"/portfolio"} element={<Portfolio/>}/>
        <Route path={"/packages"} element={<Package/>}/>
        <Route path={"/about"} element={<About/>}/>
        <Route path={"/booking"} element={<Booking/>}/>
        <Route path={"/login"} element={<Login/>} />
        
        {/* Protected Admin Route */}
        <Route path="/admin" element={
          <ProtectedAdminRoute> {/* Custom Component that checks if a user is authorized to access the child components */}
            <Admin />
          </ProtectedAdminRoute>
        } />
        
        {/* Error route that catches any URLs that the website does not have (Fallback)*/}
        <Route path={"*"} element={<Error/>} />
      </Routes>
    </BrowserRouter> 
    </>
  )
}

export default App
