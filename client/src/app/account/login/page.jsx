"use client"
import Link from "next/link";
import { useFormik } from "formik";
import { loginSchema } from "@/validation/schemas";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLoginUserMutation } from "@/lib/services/auth";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverSuccessMessage, setServerSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [loginUser] = useLoginUserMutation();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/user/profile");
    }
  }, []);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, action) => {
      setLoading(true);
      try {
        console.log("Sending login request:", values); // ✅ Debugging Step 1
        const response = await loginUser(values);
        console.log("Server Response:", response); // ✅ Debugging Step 2

        if (response?.data?.status === "success") {
          console.log("Login Successful! Storing token...");
          setServerSuccessMessage(response.data.message);
          setServerErrorMessage("");
          action.resetForm();
          setLoading(false);

          // ✅ Store Token & User Info
          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          console.log("Stored Token:", localStorage.getItem("token")); // ✅ Debugging Step 3

          // ✅ Redirect based on GIS Registration status
          router.push(response.data.redirectTo || "/user/profile");
        } else {
          console.error("Login Error:", response?.error?.data);
          setServerErrorMessage(response?.error?.data?.message || "Something went wrong. Please try again.");
          setServerSuccessMessage("");
          setLoading(false);
        }
      } catch (error) {
        console.error("Login Error:", error);
        setServerErrorMessage(error?.response?.data?.message || "Network error. Please check your connection.");
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border-gray-300 rounded-md p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-200"
              placeholder="Enter your email"
            />
            {touched.email && errors.email && <div className="text-sm text-red-500 px-2">{errors.email}</div>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border-gray-300 rounded-md p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-200"
              placeholder="Enter your password"
            />
            {touched.password && errors.password && <div className="text-sm text-red-500 px-2">{errors.password}</div>}
          </div>

          <p className="text-sm text-gray-600 p-1">
            <Link href="/account/reset-password-link" className="text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out">
              Forgot Password?
            </Link>
          </p>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md focus:ring-indigo-200"
          >
            {loading ? <span className="animate-spin">🔄</span> : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-600 p-1">
          Not a User? <Link href="/account/register" className="text-indigo-500 hover:text-indigo-600">Create an account</Link>
        </p>

        {serverSuccessMessage && <div className="text-sm text-green-500 font-semibold px-2 text-center">{serverSuccessMessage}</div>}
        {serverErrorMessage && <div className="text-sm text-red-500 font-semibold px-2 text-center">{serverErrorMessage}</div>}
      </div>
    </div>
  );
};

export default Login;

