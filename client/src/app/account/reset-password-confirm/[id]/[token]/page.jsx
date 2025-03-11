"use client";
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import { resetPasswordSchema } from '@/validation/schemas';
import { useResetPasswordMutation } from '@/lib/services/auth';
import { useState } from 'react';

const initialValues = {
  password: "",
  password_confirmation: ""
};

const ResetPasswordConfirm = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [serverSuccessMessage, setServerSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id, token } = useParams();
  const [resetPassword] = useResetPasswordMutation();

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: async (values, action) => {
      setLoading(true);
      setServerErrorMessage('');
      setServerSuccessMessage('');

      try {
        const response = await resetPassword({ ...values, id, token });

        if (response?.data?.status === "success") {
          setServerSuccessMessage(response.data.message);
          action.resetForm();
          setTimeout(() => router.push('/account/login'), 2000);
        } else {
          setServerErrorMessage(response?.error?.data?.message || "Something went wrong.");
        }
      } catch (error) {
        setServerErrorMessage("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        <form onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              placeholder="Enter your new password"
            />
            {touched.password && errors.password && (
              <div className="text-sm text-red-500 px-2">{errors.password}</div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label htmlFor="password_confirmation" className="block font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={values.password_confirmation}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              placeholder="Confirm your new password"
            />
            {touched.password_confirmation && errors.password_confirmation && (
              <div className="text-sm text-red-500 px-2">{errors.password_confirmation}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        {/* Success & Error Messages */}
        {serverSuccessMessage && <div className="text-sm text-green-500 font-semibold px-2 text-center mt-2">{serverSuccessMessage}</div>}
        {serverErrorMessage && <div className="text-sm text-red-500 font-semibold px-2 text-center mt-2">{serverErrorMessage}</div>}
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;
