"use client";

import { useState } from "react";
import Image from "next/image";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Logo */}
      <Image src="/Logo_Png-09_sifemw.png" alt="Aero2Astro Logo" width={150} height={50} />
      
      {/* Heading */}
      <h2 className="text-2xl font-bold mt-4">Login to Dashboard</h2>
      <p className="text-gray-500 mt-1">
        Or <a href="#" className="text-blue-500">Register as Partner</a>
      </p>

      {/* Form */}
      <div className="mt-5 w-96">
        <input
          type="email"
          placeholder="Email address"
          className="w-full p-3 border rounded-lg mb-3"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-3"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <p className="text-blue-500 text-sm text-right cursor-pointer">Forgot your password?</p>
        
        {/* Sign-in Button */}
        <button className="w-full bg-blue-600 text-white p-3 rounded-lg mt-3 hover:bg-blue-700">
          Sign in
        </button>
      </div>

      {/* Register Link */}
      <p className="mt-4 text-gray-600">
        Not having an account? <a href="#" className="text-blue-500">Register as Partner</a>
      </p>
    </div>
  );
}
