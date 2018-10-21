import React from "react";
import './login.css';

const LoginView = ({ onSubmit }) => {
  return (
    <div className="login-container">
      <h1>Log In</h1>
      <form onSubmit={onSubmit}>
      <div className="form-container">
        <label>
          Email&nbsp;
          <input
            name="email"
            type="email"
            placeholder="Email"
          />
        </label>
        <label>
          Password&nbsp;
          <input
            name="password"
            type="password"
            placeholder="Password"
          />
        </label>
      </div>
      <div className="button-container">
         <button type="submit">Log in</button>
      </div>
      </form>
    </div>
  );
};

export default LoginView;
