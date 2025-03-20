// "use client"
// import { useGetUserQuery } from "@/lib/services/auth";
// import { useEffect, useState } from "react";
// const Profile = () => {
//   const [user, setUser] = useState({})
//   const { data, isSuccess } = useGetUserQuery()
//   useEffect(() => {
//     if (data && isSuccess) {
//       setUser(data.user)
//     }
//   }, [data, isSuccess])
//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
//         <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
//         <div className="mb-4">
//           <label className="block font-medium mb-2">Name: {user.name}</label>
//         </div>
//         <div className="mb-4">
//           <label className="block font-medium mb-2">Email: {user.email}</label>
//         </div>

        
//         <div className="mb-4">
//           <label className="block font-medium mb-2">Verified: {user.is_verified && "Yes"}</label>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Profile



"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetUserQuery } from "@/lib/services/auth"; // ✅ Import RTK Query hook

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [gisData, setGisData] = useState(null);
  const router = useRouter();

  // ✅ Fetch user data using RTK Query
  const { data, isSuccess, isError } = useGetUserQuery();

  useEffect(() => {
    if (isSuccess && data?.user) {
      setUser(data.user);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    const fetchGisData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const res = await fetch("http://localhost:8000/api/gis-registration/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to fetch GIS data");

        setGisData(json);
      } catch (error) {
        console.error("GIS Data Error:", error.message);
      }
    };

    fetchGisData();
  }, []);

  if (isError) {
    alert("You must be logged in to view your profile!");
    router.push("/account/login");
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center mb-6">User Profile</h2>

      {/* ✅ User Profile Box */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">User Information</h3>
        {user ? (
          <ProfileSection>
            <ProfileItem label="Full Name" value={user?.name} />
            <ProfileItem label="Email" value={user?.email} />
            <ProfileItem label="Verified" value={user?.is_verified && "Yes"} />
            <ProfileItem label="Contact Number" value={user?.contactNumber} />
            <ProfileItem label="Address" value={user?.address} />
          </ProfileSection>
        ) : (
          <p className="text-red-500">User data not found.</p>
        )}
      </div>

      {/* ✅ GIS Registration Box */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">GIS Registration Details</h3>
        {gisData ? (
          <ProfileSection>
            <ProfileItem label="Full Name" value={gisData?.fullName} />
            <ProfileItem label="Date of Birth" value={gisData?.dob} />
            <ProfileItem label="Gender" value={gisData?.gender} />
            <ProfileItem label="Contact Number" value={gisData?.contactNumber} />
            <ProfileItem label="Email" value={gisData?.email} />
            <ProfileItem label="Address" value={gisData?.address} />
            <ProfileItem label="Education" value={gisData?.education} />
            <ProfileItem label="Institution" value={gisData?.institution} />
            <ProfileItem label="Field of Study" value={gisData?.fieldOfStudy} />
            <ProfileItem label="Experience" value={gisData?.experience} />
            <ProfileItem label="Employer" value={gisData?.employer } />
            <ProfileItem label="Job Title" value={gisData?.jobTitle} />
            <ProfileItem label="Skills" value={gisData?.skills?.join(", ")} />
            <ProfileItem label="Work Mode" value={gisData?.workMode} />
            <ProfileItem label="Work Type" value={gisData?.workType} />
            <ProfileItem label="LinkedIn" value={gisData?.linkedIn} />
            <ProfileItem label="Portfolio" value={gisData?.portfolio} />
            <ProfileItem label="Certifications" value={gisData?.certifications} />
            <ProfileItem label="AdditionalInfo" value={gisData?.additionalInfo} />
            

          </ProfileSection>
        ) : (
          <p className="text-red-500">GIS Registration data not found.</p>
        )}
      </div>
    </div>
  );
}

// ✅ Reusable Components
const ProfileSection = ({ children }) => <div className="grid grid-cols-2 gap-4">{children}</div>;

const ProfileItem = ({ label, value }) => (
  <div className="border p-3 rounded-lg bg-gray-50 shadow-sm">
    <strong className="text-gray-700">{label}:</strong> {value || "N/A"}
  </div>
);
