// pages/profile.js
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gis-registration/profile`,
          { withCredentials: true }
        );
        setProfile(response.data.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to load profile";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const GISProfile = ({ profile }) => {
    if (!profile) {
      return <div className="text-center text-gray-500 py-6">No profile data available.</div>;
    }

    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Profile Status</h2>
          <p><strong>Status:</strong> {profile.status || "N/A"}</p>
          <p><strong>Completion:</strong> {profile.profileCompletion || 0}%</p>
          <p><strong>Submitted:</strong> {profile.submittedAt ? new Date(profile.submittedAt).toLocaleString() : "N/A"}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.profileImage && (
              <Image
                src={profile.profileImage}
                alt="Profile Picture"
                width={128}
                height={128}
                className="rounded-full object-cover"
              />
            )}
            <p><strong>Name:</strong> {profile.fullName || "N/A"}</p>
            <p><strong>DOB:</strong> {profile.dob ? new Date(profile.dob).toLocaleDateString() : "N/A"}</p>
            <p><strong>Gender:</strong> {profile.gender || "N/A"}</p>
            <p><strong>Contact:</strong> {profile.contactNumber || "N/A"}</p>
            <p><strong>Email:</strong> {profile.email || "N/A"}</p>
            <p><strong>Nationality:</strong> {profile.nationality || "N/A"}</p>
            <p>
              <strong>Address:</strong> {profile.address || "N/A"}, {profile.city || "N/A"}, {profile.state || "N/A"} {profile.pinCode || ""}
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Education</h2>
          <p><strong>Institution:</strong> {profile.institution || "N/A"}</p>
          <p><strong>Degree:</strong> {profile.education || "N/A"}</p>
          <p><strong>Field:</strong> {profile.fieldOfStudy || "N/A"}</p>
          <p><strong>Year:</strong> {profile.year || "N/A"}</p>
          <p><strong>Certifications:</strong> {profile.certifications?.join(", ") || "N/A"}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Technical Skills</h2>
          <p><strong>GIS Software:</strong> {profile.gisSoftware?.join(", ") || profile.gisSoftwareOther || "N/A"}</p>
          <p><strong>Programming:</strong> {profile.programmingSkills?.join(", ") || profile.programmingSkillsOther || "N/A"}</p>
          <p><strong>Expertise:</strong> {profile.CoreExpertise?.join(", ") || profile.CoreExpertiseOther || "N/A"}</p>
          <p><strong>Drone Processing:</strong> {profile.droneDataProcessing || "N/A"}</p>
          <p><strong>Photogrammetry:</strong> {profile.photogrammetrySoftware?.join(", ") || profile.photogrammetrySoftwareOther || "N/A"}</p>
          <p><strong>Remote Sensing:</strong> {profile.remoteSensing || "N/A"}</p>
          <p><strong>LiDAR:</strong> {profile.lidarProcessing || "N/A"}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Professional Information</h2>
          <p><strong>Experience:</strong> {profile.experience || "N/A"}</p>
          <p><strong>Organization:</strong> {profile.organization || "N/A"}</p>
          <p><strong>Employer:</strong> {profile.employer || "N/A"}</p>
          <p><strong>Job Title:</strong> {profile.jobTitle || "N/A"}</p>
          <p><strong>Skills:</strong> {profile.skills?.join(", ") || "N/A"}</p>
          <p>
            <strong>LinkedIn:</strong>{" "}
            {profile.linkedIn ? (
              <Link href={profile.linkedIn} target="_blank" className="text-blue-500">
                {profile.linkedIn}
              </Link>
            ) : (
              "N/A"
            )}
          </p>
          <p>
            <strong>Portfolio:</strong>{" "}
            {profile.portfolio ? (
              <Link href={profile.portfolio} target="_blank" className="text-blue-500">
                {profile.portfolio}
              </Link>
            ) : (
              "N/A"
            )}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Work Preferences</h2>
          <p><strong>Mode:</strong> {profile.workMode || "N/A"}</p>
          <p><strong>Type:</strong> {profile.workType || "N/A"}</p>
          <p><strong>Hours:</strong> {profile.workHours || "N/A"}</p>
          <p><strong>Availability:</strong> {profile.availability || "N/A"}</p>
          <p><strong>Travel:</strong> {profile.travelWillingness || "N/A"}</p>
          <p><strong>Time Zones:</strong> {profile.preferredTimeZones || "N/A"}</p>
          <p><strong>Service Modes:</strong> {profile.serviceModes?.join(", ") || "N/A"}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          {profile.projects?.length > 0 ? (
            <ul className="list-disc pl-5">
              {profile.projects.map((project, index) => (
                <li key={index}>
                  <strong>{project.title || "Untitled"}</strong>: {project.description || "No description"} ({project.technologies || "N/A"})
                </li>
              ))}
            </ul>
          ) : (
            <p>No projects listed.</p>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Work Samples</h2>
          {profile.workSamples?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.workSamples.map((sample, index) => (
                <Link key={index} href={sample} target="_blank">
                  <Image src={sample} alt={`Work Sample ${index + 1}`} width={200} height={150} className="rounded object-cover" />
                </Link>
              ))}
            </div>
          ) : (
            <p>No work samples uploaded.</p>
          )}
          {profile.videoShowcase && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Video Showcase</h3>
              <Link href={profile.videoShowcase} target="_blank" className="text-blue-500">
                {profile.videoShowcase}
              </Link>
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Equipment</h2>
          <p><strong>Own Equipment:</strong> {profile.ownEquipment || "N/A"}</p>
          <p><strong>Available:</strong> {profile.availableEquipment?.join(", ") || "N/A"}</p>
          <p><strong>Name:</strong> {profile.equipmentName || "N/A"}</p>
          <p><strong>Brand:</strong> {profile.equipmentBrand || "N/A"}</p>
          <p><strong>Year:</strong> {profile.equipmentYear || "N/A"}</p>
          <p><strong>Specs:</strong> {profile.equipmentSpecs || "N/A"}</p>
          <p><strong>Maintenance:</strong> {profile.maintenanceSchedule || "N/A"}</p>
          <p><strong>Drone Certification:</strong> {profile.droneCertification || "N/A"}</p>
          {profile.certificationFile && (
            <p>
              <strong>Certification:</strong>{" "}
              <Link href={profile.certificationFile} target="_blank" className="text-blue-500">
                View
              </Link>
            </p>
          )}
          <p><strong>Rental:</strong> {profile.equipmentRental || "N/A"}</p>
          <p><strong>Rental Terms:</strong> {profile.rentalTerms || "N/A"}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Terms</h2>
          <p><strong>Accept Terms:</strong> {profile.acceptTerms ? "Yes" : "No"}</p>
          <p><strong>Marketing Consent:</strong> {profile.consentMarketing ? "Yes" : "No"}</p>
        </section>

        
      </div>
    );
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-6">GIS Member Profile</h1>
      <GISProfile profile={profile} />
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;