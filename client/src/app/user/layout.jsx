"use client";
import UserSidebar from "@/components/UserSidebar";

import React from "react";

const UserLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <div className="flex-1 bg-gray-100 p-8">{children}</div>
    </div>
  );
};

export default UserLayout;
