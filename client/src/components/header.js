"use client";
import Link from "next/link";
import { useState, useEffect } from "react"; // Add useEffect
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
  const [isHydrated, setIsHydrated] = useState(false); // Add hydration flag
  const router = useRouter();
  const [createUser] = useCreateUserMutation();

  // Ensure Formik only runs after hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
            router.push('/account/verify-email');
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

  // Render a placeholder until hydration completes
  if (!isHydrated) {
    return (
      <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/landingpage/assests/hero.png"
            layout="fill"
            objectFit="cover"
            alt="Header Background"
            className="absolute inset-0 opacity-90"
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full h-full px-6 lg:px-24">
          <div className="text-white max-w-2xl text-center lg:text-left space-y-6 lg:mr-16">
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
          <div className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-xl shadow-lg max-w-sm w-[90%] space-y-4 border border-gray-200 lg:ml-16">
            <h2 className="text-center text-2xl font-extrabold text-blue-500">Register as Geospatial</h2>
            <div className="space-y-3">
              {["name", "email", "password", "password_confirmation"].map((field, index) => (
                <div key={index}>
                  <label htmlFor={field} className="block text-white font-medium mb-1">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type={field.includes("password") ? "password" : "text"}
                    id={field}
                    name={field}
                    className="w-full p-2 text-sm border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-200 transition"
                    placeholder={`Enter your ${field.replace("_", " ")}`}
                  />
                </div>
              ))}
              <button
                type="button"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition transform hover:scale-105 text-sm"
                disabled
              >
                Register
              </button>
            </div>
            <p className="text-sm text-white text-center">
              Already a user? <Link href="/account/login" className="text-blue-600 hover:text-blue-700">Login</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src="/landingpage/assests/hero.png"
          layout="fill"
          objectFit="cover"
          alt="Header Background"
          className="absolute inset-0 opacity-90"
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full h-full px-6 lg:px-24">
        <div className="text-white max-w-2xl text-center lg:text-left space-y-6 lg:mr-16">
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
