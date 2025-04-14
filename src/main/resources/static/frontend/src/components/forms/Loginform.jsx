import React from "react";
import "./forms.css";

const LoginBox = () => {
  return (
    <div className="login-box">
      <h2>Welcome Back</h2>
      <p className="subtext">Sign in to your account</p>

      <label>Email Address</label>
      <input type="email" placeholder="Enter your email" />

      <label>Password</label>
      <input type="password" placeholder="Enter your password" />

      {/* <div className="form-footer">
        <label className="remember">
          <input type="checkbox" /> Remember me
        </label>
        <a href="#">Forgot your password?</a>
      </div> */}

      <button type="submit">Sign in</button>

      {/* <p className="signup-text">
        Don’t have an account? <a href="#">Sign up</a>
      </p> */}
    </div>
  );
};

export default LoginBox;