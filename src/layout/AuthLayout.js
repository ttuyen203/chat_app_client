import React from "react";
import logo from "../assets/logo.png";
const AuthLayout = ({ children }) => {
  return (
    <>
      <header className="flex justify-center items-center py-1 h-20 shadow bg-white">
        <img src={logo} alt="logo" />
      </header>

      {children}
    </>
  );
};

export default AuthLayout;
