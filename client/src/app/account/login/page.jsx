// "use client";
// import Link from "next/link";
// import { useFormik } from "formik";
// import { loginSchema } from "@/validation/schemas";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useLoginUserMutation } from "@/lib/services/auth";

// const Login = () => {
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const [loginUser] = useLoginUserMutation();

//   // Redirect if already logged in
//   useEffect(() => {
//     if (localStorage.getItem("token")) {
//       router.push("/user/profile");
//     }
//   }, []);

//   const formik = useFormik({
//     initialValues: { email: "", password: "" },
//     validationSchema: loginSchema,
//     onSubmit: async (values, action) => {
//       setLoading(true);
//       setErrorMessage("");
//       try {
//         const response = await loginUser(values);

//         if (response?.data?.status === "success") {
//           localStorage.setItem("token", response.data.access_token);
//           localStorage.setItem("user", JSON.stringify(response.data.user));

//           router.push(response.data.redirectTo || "/user/profile");
//           action.resetForm();
//         } else {
//           setErrorMessage(response?.error?.data?.message || "Login failed. Try again.");
//         }
//       } catch (error) {
//         setErrorMessage(error?.response?.data?.message || "Network error. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     },
//   });

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//         <form onSubmit={formik.handleSubmit}>
//           {/* Email Field */}
//           <div className="mb-4">
//             <label htmlFor="email" className="block font-medium mb-2">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="w-full border-gray-300 rounded-md p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-200"
//               placeholder="Enter your email"
//             />
//             {formik.touched.email && formik.errors.email && (
//               <div className="text-sm text-red-500 px-2">{formik.errors.email}</div>
//             )}
//           </div>

//           {/* Password Field */}
//           <div className="mb-6">
//             <label htmlFor="password" className="block font-medium mb-2">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formik.values.password}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="w-full border-gray-300 rounded-md p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-200"
//               placeholder="Enter your password"
//             />
//             {formik.touched.password && formik.errors.password && (
//               <div className="text-sm text-red-500 px-2">{formik.errors.password}</div>
//             )}
//           </div>

//           {/* Forgot Password Link */}
//           <p className="text-sm text-gray-600 p-1">
//             <Link href="/account/reset-password-link" className="text-indigo-500 hover:text-indigo-600">
//               Forgot Password?
//             </Link>
//           </p>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md focus:ring-indigo-200"
//           >
//             {loading ? <span className="animate-spin">🔄</span> : "Login"}
//           </button>
//         </form>

//         {/* Register Link */}
//         <p className="text-sm text-gray-600 p-1">
//           Not a User? <Link href="/account/register" className="text-indigo-500 hover:text-indigo-600">Create an account</Link>
//         </p>

//         {/* Error Message */}
//         {errorMessage && <div className="text-sm text-red-500 font-semibold px-2 text-center">{errorMessage}</div>}
//       </div>
//     </div>
//   );
// };

// export default Login;

"use client";
import Link from "next/link";
import { useFormik } from "formik";
import { loginSchema } from "@/validation/schemas";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLoginUserMutation } from "@/lib/services/auth";
import Image from "next/image";


const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [loginUser] = useLoginUserMutation();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/user/profile");
    }
  }, []);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, action) => {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await loginUser(values);

        if (response?.data?.status === "success") {
          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          router.push(response.data.redirectTo || "/user/profile");
          action.resetForm();
        } else {
          setErrorMessage(response?.error?.data?.message || "Login failed. Try again.");
        }
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || "Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href={"/"} className="overflow-clip relative block mx-auto h-24 w-40">
          <img src="/logo.png" className="absolute inset-0 scale-150 " width={"100%"} height={"100%"} alt="Aero2Astro"></img>
          </Link>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login to Dashboard</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register as Partner
            </Link>
          </p>

        </div>
        <form onSubmit={formik.handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border-gray-300 rounded-md p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-200"
              placeholder="Enter your email"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-sm text-red-500 px-2">{formik.errors.email}</div>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border-gray-300 rounded-md p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-200"
              placeholder="Enter your password"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-sm text-red-500 px-2">{formik.errors.password}</div>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-sm">
            <Link href="/account/reset-password-link" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot Your Password?
            </Link>
          </div>

          {/* Submit Button */}
          <div>
          <button
            type="submit"
            className="mt-2 group relative w-full flex justify-center py-2 px-4 border-transparent  text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
            {loading ? "Logging in..." : "Sign in"}
          </button>
          </div>
        </form>

        {/* Register Link */}
        <div className="items-center relative bottom-4 gap-2 flex">
         <p>Not having account?</p>  
         <Link href="/account/register" className="font-medium text-blue-600 hover:text-blue-500">Register as Partner</Link>
        </div>

        {/* Error Message */}
        {errorMessage && <div className="text-sm text-red-500 font-semibold px-2 text-center">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Login;


