import Contactform from "./components/forms/Contactform";
import Login from "./pages/auth/Login";
import Contact from "./pages/public/Contact";
import Home from "./pages/public/Home";
import Error from "./pages/public/Error";
import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Package from "./pages/public/Package"
import Portfolio from "./pages/public/Portfolio"
import Booking from "./pages/public/Booking";
// import Admin from "./pages/admin/Admin";
import Calendar2 from "./components/admin/Calendar2";
import AddAdminModal from "./components/admin/AddAdminModal";
import SetManualSchedule from "./components/admin/SetManualSchedule";
import { BrowserRouter, createBrowserRouter, RouterProvider, Routes, Route, Navigate } from "react-router-dom";
import { Router } from "lucide-react";
import Admin from "./pages/admin/Admin";
import AdminService from "./components/service/AdminService";

// const router = createBrowserRouter([
//   {path:"/", element: <Home/>},
//   {path:"/home", element: <Home/>},
//   {path:"/contact", element: <Contact/>},
//   {path:"/portfolio", element: <Portfolio/>},
//   {path:"/packages", element: <Package/>},
//   // {path:"/about", element: <About/>},
//   {path:"/booking", element: <Booking/>},
//   {path:"/auth/login", element: <Login/>},
//   {path:"*", element: <Error/>},
  

// ])

function App() {
  

  return (
    <>
    {/* <RouterProvider router={router}/> */}

    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Home/>} />
        <Route path={"/home"} element={<Home/>}/>
        <Route path={"/contact"} element={<Contact/>}/>
        <Route path={"/portfolio"} element={<Portfolio/>}/>
        <Route path={"/packages"} element={<Package/>}/>
        {/* <Route path={"/about"} element={<About/>}/> */}
        <Route path={"/booking"} element={<Booking/>}/>
{/* //  <Route path={"/auth/login"} element={<Login/>}/> */}
        <Route path={"*"} element={<Error/>} />
        <Route path={"/login"} element={<Login/>} />

        {AdminService.adminOnly() && (
              <>
                <Route path={"/admin"} element={<Admin/>} />
                {/* <Route path="/register" element={<RegistrationPage />} />
                <Route path="/admin/user-management" element={<UserManagementPage />} />
                <Route path="/update-user/:userId" element={<UpdateUser />} /> */}
              </>
            )}


      {/* <Login/> */}
      {/* <Contact/> */}
      {/* <Home/> */} 
      {/* <Error/> */}
      {/* <Package/> */}
      {/* <Portfolio/> */}
      {/* <Booking/> */}
      {/* <Admin/> */}
      {/* <SetManualSchedule/> */}
      {/* <Calendar2/> */}

      </Routes>
    </BrowserRouter> 
    </>
  )
}

export default App
