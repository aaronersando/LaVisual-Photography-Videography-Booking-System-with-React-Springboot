import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../service/AdminService";

function Loginform() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const userData = await AdminService.login(email, password)
        console.log(userData)
        if (userData.token) {
            localStorage.setItem('token', userData.token)
            localStorage.setItem('role', userData.role)
            navigate('/admin')
        }else{
            setError(userData.message)
        }
        
    } catch (error) {
        console.log(error)
        setError(error.message)
        setTimeout(()=>{
            setError('');
        }, 5000);
    }
}


  return (
    <div className="w-[448px] h-[410px] bg-gray-800 rounded-lg p-8 mx-auto my-12 flex flex-col text-white">
      <h2 className="text-2xl font-bold text-center mb-1">
        Welcome Back
      </h2>
      
      <p className="text-sm text-gray-400 text-center mb-6">
        Sign in to your account
      </p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3.5 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors duration-200 mt-4"
            >
              Sign in
            </button>

          </div>
          </form>
    </div>
  );
}

export default Loginform;