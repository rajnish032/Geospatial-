"use client";
import Link from "next/link";
import { useState } from "react";
import { useFormik } from 'formik';
import { registerSchema } from '@/validation/schemas'
import { useCreateUserMutation } from "@/lib/services/auth";
import { useRouter } from 'next/navigation';

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

          // ✅ Use backend-provided redirect URL
          if (response.data.redirectTo) {
            router.push(response.data.redirectTo);
          } else {
            router.push('/account/verify-email'); // 🔄 Fallback URL
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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Register as GIS</h2>
        <form onSubmit={handleSubmit}>
          {["name", "email", "password", "password_confirmation"].map((field, index) => (
            <div className="mb-4" key={index}>
              <label htmlFor={field} className="block font-medium mb-2">{field.replace("_", " ").toUpperCase()}</label>
              <input
                type={field.includes("password") ? "password" : "text"}
                id={field}
                name={field}
                value={values[field]}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full border-gray-300 rounded-md p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-200"
                placeholder={`Enter your ${field.replace("_", " ")}`}
              />
              {touched[field] && errors[field] && <div className="text-sm text-red-500 px-2">{errors[field]}</div>}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md focus:ring-indigo-200 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-600 p-1">
          Already a user? <Link href="/account/login" className="text-indigo-500 hover:text-indigo-600">Login</Link>
        </p>

        {serverSuccessMessage && <div className="text-sm text-green-500 font-semibold px-2 text-center">{serverSuccessMessage}</div>}
        {serverErrorMessage && <div className="text-sm text-red-500 font-semibold px-2 text-center">{serverErrorMessage}</div>}
      </div>
    </div>
  );
};

export default Register;
