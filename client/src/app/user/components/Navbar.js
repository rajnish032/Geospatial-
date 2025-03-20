"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "antd";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch user data from localStorage or API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch user data from API or localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user from storage
    setUser(null); // Update state
    window.location.href = "/login"; // Redirect to login
  };

  return (
    <header className="sticky top-0 z-[2000] border-b border-blue-400 mb-5 shadow-md bg-white text-gray-700">
      <div className="max-w-screen-xl relative flex flex-wrap items-center justify-between px-3 lg:px-5">
        {/* Logo */}
        <Link
          href={"/"}
          className="lg:mx-20 bg-cover cursor-pointer inline-flex overflow-hidden relative md:w-[300px] h-16 w-[150px] items-center"
        >
          <Image
            src="/logo.png" // Ensure this path is correct
            alt="Aero2Astro"
            width={150} // ✅ Add width
            height={50} // ✅ Add height
            className="max-sm:scale-[1.4] lg:scale-[1.1]"
          />
        </Link>

        {/* Navigation */}
        <div className="gap-3 flex text-sm lg:mx-4 lg:justify-end flex-grow items-center max-md:hidden">
          {!user?.isApplied ? (
            <Link
              className="font-semibold px-2 hover:text-blue-400"
              href={"/account/profile"}
            >
              Profile
            </Link>
          ) : (
            <Link
              className="font-semibold px-2 hover:text-blue-400"
              href={"/user/preview"}
            >
              View Profile
            </Link>
          )}
          <Link
            className="font-semibold px-2 hover:text-blue-500"
            href={"/admin/dashboard"}
          >
            Dashboard
          </Link>

          <button
            className={`font-semibold relative text-white py-1 px-2 rounded hover:bg-blue-600 ${
              user?.isApplied ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500"
            }`}
          >
            {!user?.isApplied ? "Apply for Approval" : "Applied"}
          </button>
        </div>

        {/* User Info and Dropdown */}
        <div className="items-center flex md:flex-row-reverse gap-5 relative">
          {loading ? (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full animate-pulse bg-gray-500"></div>
              <div className="flex flex-col min-w-[100px] gap-1">
                <div className="h-2 animate-pulse bg-gray-800 min-w-full rounded-2xl"></div>
                <div className="h-2 max-w-[80%] animate-pulse bg-gray-800 rounded-2xl"></div>
                <div className="h-2 max-w-[70%] animate-pulse bg-gray-800 rounded-2xl"></div>
              </div>
            </div>
          ) : user ? (
            <>
              <div className="w-fit py-2">
                <p className="font-semibold max-sm:text-sm">{user?.fullName}</p>
                <p className="text-xs">{user?.role}</p>
                <p className="text-xs mt-1">
                  {user?.status === "pending" ? (
                    <span className="bg-red-600 px-1 text-center w-fit text-white">
                      Not Applied
                    </span>
                  ) : user?.status === "review" ? (
                    <span className="bg-yellow-600 text-center w-fit px-1 text-white">
                      {user?.status}
                    </span>
                  ) : user?.status === "rejected" ? (
                    <span className="bg-red-600 text-center w-fit px-1 text-white">
                      {user?.status}
                    </span>
                  ) : user?.status === "approved" ? (
                    <span className="bg-green-600 text-center w-fit px-1 text-white">
                      {user?.status}
                    </span>
                  ) : null}
                </p>
              </div>

              {/* User Dropdown */}
              <div className="flex items-center relative md:order-2 space-x-3 md:space-x-0">
                <button
                  type="button"
                  className="flex text-sm ring-1 ring-blue-500 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user?.avatar || "/default-avatar.png"}
                    alt={user?.fullName}
                  />
                </button>
                {showDropdown && (
                  <div className="z-50 my-4 text-base fixed top-16 right-5 lg:right-52 list-none shadow-lg bg-white divide-y divide-gray-500 rounded-lg">
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900">
                        {user.fullName.toUpperCase()}
                      </span>
                      <span className="block text-sm text-gray-900 truncate">
                        {user.email}
                      </span>
                    </div>
                    <ul className="py-2">
                      <li>
                        <Link
                          href="/user/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700"
                        >
                          Dashboard
                        </Link>
                      </li>
                      {!user?.isApplied && (
                        <li>
                          <Link
                            href="/user/profile"
                            className="block px-4 py-2 text-sm text-gray-700"
                          >
                            My Profile
                          </Link>
                        </li>
                      )}
                      <li>
                        <Button className="block px-4 text-sm bg-green-500 font-semibold text-white mx-auto w-[90%]">
                          Apply for Approval
                        </Button>
                      </li>
                      <li>
                        <Button
                          onClick={handleLogout}
                          className="block px-4 text-sm bg-blue-500 font-bold text-white w-[90%] mx-auto my-2"
                        >
                          Sign out
                        </Button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="font-semibold px-4 py-2 bg-blue-500 text-white rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
