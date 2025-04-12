"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "antd";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch user data from cookies
  useEffect(() => {
    const fetchUser = () => {
      try {
        const userCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user='))
          ?.split('=')[1];
        
        if (userCookie) {
          const userData = JSON.parse(decodeURIComponent(userCookie));
          setUser(userData);
          // Also store in localStorage for quick access
          localStorage.setItem("user", JSON.stringify(userData));
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
    // Clear both cookies and localStorage
    document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  // Determine profile link based on user state
  const getProfileLink = () => {
    if (!user) return "/login";
    if (user.isGISRegistered) return "/gis/profile";
    return "/account/profile";
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
            src="/logo.png"
            alt="Aero2Astro"
            width={150}
            height={50}
            className="max-sm:scale-[1.4] lg:scale-[1.1]"
          />
        </Link>

        {/* Navigation */}
        <div className="gap-3 flex text-sm lg:mx-4 lg:justify-end flex-grow items-center max-md:hidden">
          {user && (
            <Link
              className="font-semibold px-2 hover:text-blue-400"
              href={getProfileLink()}
            >
              {user.isGISRegistered ? "GIS Profile" : "Complete Profile"}
            </Link>
          )}
          {user?.isGISRegistered && (
            <Link
              className="font-semibold px-2 hover:text-blue-500"
              href={"/gis/dashboard"}
            >
              Dashboard
            </Link>
          )}

          {user && !user.isApplied && (
            <button
              className="font-semibold relative text-white py-1 px-2 rounded hover:bg-blue-600 bg-blue-500"
            >
              Apply for Approval
            </button>
          )}
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
                    src={user?.profileImage || "/default-avatar.png"}
                    alt={user?.name}
                  />
                </button>
                {showDropdown && (
                  <div className="z-50 my-4 text-base fixed top-16 right-5 lg:right-52 list-none shadow-lg bg-white divide-y divide-gray-500 rounded-lg">
                    <div className="px-4 py-3">
                      <span className="block text-sm text-gray-900">
                        {user.name?.toUpperCase()}
                      </span>
                      <span className="block text-sm text-gray-900 truncate">
                        {user.email}
                      </span>
                    </div>
                    <ul className="py-2">
                      {user.isGISRegistered && (
                        <li>
                          <Link
                            href="/gis/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            GIS Dashboard
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          href={getProfileLink()}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {user.isGISRegistered ? "GIS Profile" : "My Profile"}
                        </Link>
                      </li>
                      {!user.isApplied && (
                        <li>
                          <Button className="block px-4 text-sm bg-green-500 font-semibold text-white mx-auto w-[90%] hover:bg-green-600">
                            Apply for Approval
                          </Button>
                        </li>
                      )}
                      <li>
                        <Button
                          onClick={handleLogout}
                          className="block px-4 text-sm bg-blue-500 font-bold text-white w-[90%] mx-auto my-2 hover:bg-blue-600"
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
              href="/account/login"
              className="font-semibold px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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