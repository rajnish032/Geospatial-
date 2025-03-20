// "use client"
// import { motion } from "framer-motion";
// import React from "react";
// import { useRouter } from "next/navigation"; // Import useRouter
// import { ImagesSlider } from "./ui/images-slider";

// export function ImagesSliderDemo() {
//   const router = useRouter(); // Initialize router

//   const images = [
//     "https://images.unsplash.com/photo-1485433592409-9018e83a1f0d?q=80&w=1814&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     "https://images.unsplash.com/photo-1482189349482-3defd547e0e9?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   ];

//   return (
//     <ImagesSlider className="h-[40rem]" images={images}>
//       <motion.div
//         initial={{ opacity: 0, y: -80 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="z-50 flex flex-col justify-center items-center"
//       >
//         <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
//           Aero2Astro Geospatial Experts <br /> Network
//         </motion.p>
//         <motion.p className="font-semibold text-xl md:text-3xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
//           Collaborate, Contribute & Elevate Transform Drone Data into Actionable <br /> Intelligence
//         </motion.p>
//         <button
//           onClick={() => router.push("account/register")} // Redirect to register page
//           className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4"
//         >
//           <span>Join now →</span>
//           <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
//         </button>
//       </motion.div>
//     </ImagesSlider>
//   );
// }
"use client";
import Link from "next/link";
import { useState } from "react";
import { useFormik } from "formik";
import { registerSchema } from '@/validation/schemas';
import { useCreateUserMutation } from "@/lib/services/auth";
import { useRouter } from 'next/navigation';
import Image from "next/image";


const initialValues = {
  name: "",
  email: "",
  password: "",
  password_confirmation: ""
};

const Register = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [serverSuccessMessage, setServerSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [createUser] = useCreateUserMutation();

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values, action) => {
      setLoading(true);
      try {
        const response = await createUser(values);

        if (response?.data?.status === "success") {
          setServerSuccessMessage(response.data.message);
          setServerErrorMessage('');
          action.resetForm();
          setLoading(false);

          if (response.data.redirectTo) {
            router.push(response.data.redirectTo);
          } else {
            router.push('/account/verify-email'); // Fallback URL
          }
        } else {
          setServerErrorMessage(response?.error?.data?.message || "Something went wrong. Please try again.");
          setServerSuccessMessage('');
          setLoading(false);
        }
      } catch (error) {
        setServerErrorMessage(error?.response?.data?.message || "Network error. Please check your connection.");
        setLoading(false);
      }
    }
  });

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/landingpage/assests/hero.png" 
          layout="fill"
          objectFit="cover"
          alt="Header Background"
          className=" absolute inset-0 opacity-90"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full h-full px-6 lg:px-24">
        {/* Left Side Content */}
        <div className="text-white max-w-2xl text-center lg:text-left space-y-6  lg:mr-16">
          <h1 className="text-5xl font-bold leading-tight animate-fadeIn">
            Aero2Astro Geospatial Experts Network
          </h1>
          <p className="text-lg opacity-80">
            Collaborate, Contribute & Elevate - Transform Drone Data into Actionable Intelligence.
          </p>
          <button className="mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition transform hover:scale-105">
            Join now →
          </button>
        </div>

        {/* Register Form  */}
        <div className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-xl shadow-lg max-w-sm w-[90%] space-y-4 border border-gray-200 lg:ml-16">
          <h2 className="text-center text-2xl font-extrabold text-blue-500">Register as Geospatial</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {["name", "email", "password", "password_confirmation"].map((field, index) => (
              <div key={index}>
                <label htmlFor={field} className="block text-white font-medium mb-1">
                  {field.replace("_", " ")}
                </label>
                <input
                  type={field.includes("password") ? "password" : "text"}
                  id={field}
                  name={field}
                  value={values[field]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full p-2 text-sm border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-200 transition"
                  placeholder={`Enter your ${field.replace("_", " ")}`}
                />
                {touched[field] && errors[field] && <div className="text-sm text-red-500 px-1">{errors[field]}</div>}
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition transform hover:scale-105 text-sm"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-white text-center">
            Already a user? <Link href="/account/login" className="text-blue-600 hover:text-blue-700">Login</Link>
          </p>

          {serverSuccessMessage && <div className="text-sm text-green-400 font-semibold text-center">{serverSuccessMessage}</div>}
          {serverErrorMessage && <div className="text-sm text-red-400 font-semibold text-center">{serverErrorMessage}</div>}
        </div>
      </div>
    </div>
  );
};

export default Register;
