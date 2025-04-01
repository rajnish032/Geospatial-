"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Home, User, Settings, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useLogoutUserMutation } from "@/lib/services/auth";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [logoutUser] = useLogoutUserMutation();

  // Navigation items with routes
  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: User, label: "Profile", href: "/user/profile" },
    { icon: Settings, label: "Settings", href: "/user/settings" }, // Adjust route as needed
  ];

  // Logout handler
  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.data && response.data.status === "success") {
        localStorage.removeItem("token"); // Clear JWT token
        router.push("/"); // Redirect to home
      } else {
        console.error("Logout failed:", response.error);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <motion.div
      className={`fixed left-0 top-0 h-full bg-gray-900 text-white p-4 flex flex-col gap-6 transition-all duration-300 ${
        isOpen ? "w-60" : "w-16"
      }`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Logo Section */}
      <motion.div className="flex items-center gap-2">
        <motion.div
          className="bg-white p-2 rounded-full"
          animate={{ rotate: isOpen ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        />
        {isOpen && <span className="text-lg font-bold">Acet Labs</span>}
      </motion.div>

      {/* Navigation */}
      <nav className="flex flex-col gap-4">
        {navItems.map(({ icon: Icon, label, href }, index) => (
          <Link href={href} key={index}>
            <motion.div
              className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer ${
                pathname === href ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <Icon size={24} />
              {isOpen && <span>{label}</span>}
            </motion.div>
          </Link>
        ))}
        {/* Logout Item */}
        <motion.div
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={handleLogout}
        >
          <LogOut size={24} />
          {isOpen && <span>Logout</span>}
        </motion.div>
      </nav>

      {/* User Avatar Section */}
      <motion.div className="flex items-center gap-4 p-2 mt-auto">
        <img
          src="/user-avatar.png" // Replace with dynamic user avatar if available
          alt="User"
          className="w-10 h-10 rounded-full"
        />
        {isOpen && <span>Manu Arora</span>} {/* Replace with dynamic user name */}
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
