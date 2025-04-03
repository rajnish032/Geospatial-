"use client";
import { useGetUserQuery } from "@/lib/services/auth";
import { useEffect, useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/services/auth";

const enhancedAuthApi = authApi.injectEndpoints({
  endpoints: (builder) => ({
    getGisRegistration: builder.query({
      query: () => ({
        url: "http://localhost:8000/api/gis-registration/me",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data?.message || "Failed to load GIS data",
    }),
  }),
});

const { useGetGisRegistrationQuery } = enhancedAuthApi;

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  const { data: userData, isSuccess: userSuccess } = useGetUserQuery();
  const { data: gisData, isLoading: gisLoading, error: gisError } = useGetGisRegistrationQuery();

  useEffect(() => {
    if (userSuccess && userData) {
      setUser(userData.user || userData);
    }
    if (!gisLoading) {
      setLoading(false);
    }
  }, [userData, userSuccess, gisLoading]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const calculateProfileCompletion = () => {
    if (!gisData) return 0;
    const fields = [
      gisData.fullName, gisData.contactNumber, gisData.dob, gisData.gender, gisData.nationality,
      gisData.address, gisData.institution, gisData.fieldOfStudy, gisData.education,
      gisData.experience, gisData.projects?.length > 0, gisData.gisSoftware?.length > 0,
      gisData.workMode
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="relative -mt-16 mb-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col sm:flex-row items-center gap-8 transform transition-all hover:shadow-3xl">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {user.name?.charAt(0) || "U"}
              </div>
              <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full border-4 border-white ${user.is_verified ? "bg-green-500" : "bg-gray-400"} shadow`}>
                {user.is_verified && (
                  <svg className="w-5 h-5 text-white mx-auto mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user.name || "User"}</h1>
              <p className="text-gray-600 text-lg">{user.email || "user@example.com"}</p>
              <div className="mt-3 flex items-center justify-center sm:justify-start gap-4">
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${user.is_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {user.is_verified ? "Verified" : "Not Verified"}
                </span>
                {gisData && (
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path d="M18 2.0845a15.9155 15.9155 0 0 0 0 31.831a15.9155 15.9155 0 0 0 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3.8" />
                      <path d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#4f46e5" strokeWidth="3.8" strokeDasharray={`${calculateProfileCompletion()}, 100`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-800">
                      {calculateProfileCompletion()}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <h2 className="text-3xl font-bold tracking-tight">GIS Professional Profile</h2>
              <p className="opacity-90 text-lg">Showcase your geospatial expertise</p>
            </div>

            <div className="p-8">
              {gisError ? (
                gisError === "No registration data found" ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                      <svg className="h-16 w-16 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Complete Your GIS Profile</h3>
                    <p className="text-gray-600 mb-6 max-w-lg mx-auto text-lg">
                      Elevate your career by showcasing your skills and experience to the geospatial community.
                    </p>
                    <Link href="/gis-registration">
                      <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Get Started
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-6">
                      <svg className="h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Error Loading Profile</h3>
                    <p className="text-red-600 mb-6 text-lg">{gisError}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-semibold transition-all duration-300"
                    >
                      Retry
                    </button>
                  </div>
                )
              ) : gisData ? (
                <div className="space-y-6">
                  {/* Collapsible Sections */}
                  {[
                    {
                      title: "Personal Information",
                      badge: "Basic Info",
                      color: "blue",
                      content: (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {gisData.profileImage && (
                            <div className="md:col-span-2 flex justify-center">
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/${gisData.profileImage}`}
                                alt="Profile"
                                className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-lg transform hover:scale-105 transition-all duration-300"
                                onError={(e) => (e.target.src = "/fallback-image.jpg")}
                              />
                            </div>
                          )}
                          <InfoCard label="Full Name" value={gisData.fullName} />
                          <InfoCard label="Contact" value={gisData.contactNumber} />
                          <InfoCard label="Date of Birth" value={gisData.dob} />
                          <InfoCard label="Gender" value={gisData.gender} />
                          <InfoCard label="Nationality" value={gisData.nationality} />
                          <InfoCard label="Address" value={`${gisData.address}, ${gisData.city}, ${gisData.state} ${gisData.pinCode}`} span={2} />
                        </div>
                      ),
                    },
                    {
                      title: "Education",
                      badge: "Qualifications",
                      color: "green",
                      content: (
                        <div className="space-y-4">
                          <InfoCard label="Institution" value={gisData.institution} />
                          <InfoCard label="Field of Study" value={gisData.fieldOfStudy} />
                          <InfoCard label="Highest Qualification" value={gisData.education} />
                          <InfoCard label="Year of Graduation" value={gisData.year} />
                          {gisData.certifications?.length > 0 && (
                            <div className="bg-white p-5 rounded-xl shadow-sm">
                              <label className="block text-sm font-medium text-gray-500 mb-2">Certifications</label>
                              <div className="flex flex-wrap gap-3">
                                {gisData.certifications.map((cert, index) => (
                                  <span key={index} className="bg-green-100 text-green-800 text-sm px-4 py-1 rounded-full shadow-sm">
                                    {cert}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ),
                    },
                    {
                      title: "Technical Skills",
                      badge: "Expertise",
                      color: "purple",
                      content: (
                        <div className="space-y-4">
                          {gisData.gisSoftware?.length > 0 && (
                            <SkillCard label="GIS Software" skills={[...gisData.gisSoftware, gisData.gisSoftwareOther].filter(Boolean)} color="green" />
                          )}
                          {gisData.programmingSkills?.length > 0 && (
                            <SkillCard label="Programming" skills={[...gisData.programmingSkills, gisData.programmingSkillsOther].filter(Boolean)} color="yellow" />
                          )}
                          {gisData.CoreExpertise?.length > 0 && (
                            <SkillCard label="Core Expertise" skills={[...gisData.CoreExpertise, gisData.CoreExpertiseOther].filter(Boolean)} color="red" />
                          )}
                          <div className="grid grid-cols-2 gap-4">
                            <InfoCard label="Drone Processing" value={gisData.droneDataProcessing} />
                            <InfoCard label="LiDAR Processing" value={gisData.lidarProcessing} />
                          </div>
                          {gisData.photogrammetrySoftware?.length > 0 && (
                            <SkillCard label="Photogrammetry" skills={[...gisData.photogrammetrySoftware, gisData.photogrammetrySoftwareOther].filter(Boolean)} color="indigo" />
                          )}
                        </div>
                      ),
                    },
                    {
                      title: "Professional Experience",
                      badge: "Career",
                      color: "orange",
                      content: (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InfoCard label="Experience" value={gisData.experience} />
                          <InfoCard label="Organization" value={gisData.organization} />
                          <InfoCard label="Job Title" value={gisData.jobTitle} />
                          <InfoCard label="Employment Type" value={gisData.employer} />
                          {gisData.skills?.length > 0 && (
                            <SkillCard label="Key Skills" skills={gisData.skills} color="blue" span={2} />
                          )}
                          {gisData.linkedIn && <LinkCard label="LinkedIn" url={gisData.linkedIn} />}
                          {gisData.portfolio && <LinkCard label="Portfolio" url={gisData.portfolio} />}
                        </div>
                      ),
                    },
                    {
                      title: "Projects",
                      badge: "Work",
                      color: "teal",
                      content: gisData.projects?.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {gisData.projects.map((project, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-teal-500">
                              <h4 className="text-xl font-semibold text-gray-900 mb-3">{project.title || "Untitled Project"}</h4>
                              <p className="text-gray-700 mb-4">{project.description || "No description available"}</p>
                              {project.technologies && (
                                <div className="mt-3">
                                  <span className="text-sm font-medium text-gray-500">Technologies:</span>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {project.technologies.split(",").map((tech, i) => (
                                      <span key={i} className="bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded-full shadow-sm">
                                        {tech.trim()}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ),
                    },
                    {
                      title: "Equipment",
                      badge: "Tools",
                      color: "amber",
                      content: (
                        <div className="space-y-4">
                          <InfoCard label="Owns Equipment" value={gisData.ownEquipment} />
                          {gisData.ownEquipment === "Yes" && (
                            <>
                              {gisData.availableEquipment?.length > 0 && (
                                <SkillCard label="Available Equipment" skills={gisData.availableEquipment} color="purple" />
                              )}
                              <div className="grid grid-cols-2 gap-4">
                                <InfoCard label="Brand" value={gisData.equipmentBrand} />
                                <InfoCard label="Year" value={gisData.equipmentYear} />
                              </div>
                              <InfoCard label="Model" value={gisData.equipmentName} />
                              {gisData.equipmentSpecs && <InfoCard label="Specifications" value={gisData.equipmentSpecs} span={2} />}
                              <div className="grid grid-cols-2 gap-4">
                                <InfoCard label="Maintenance" value={gisData.maintenanceSchedule} />
                                <InfoCard label="Certification" value={gisData.droneCertification} />
                              </div>
                            </>
                          )}
                        </div>
                      ),
                    },
                    {
                      title: "Availability",
                      badge: "Preferences",
                      color: "cyan",
                      content: (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <InfoCard label="Work Mode" value={gisData.workMode} />
                            <InfoCard label="Work Type" value={gisData.workType} />
                          </div>
                          <InfoCard label="Availability" value={gisData.availability} />
                          <InfoCard label="Travel" value={gisData.travelWillingness} />
                          <div className="grid grid-cols-2 gap-4">
                            <InfoCard label="Work Hours" value={gisData.workHours} />
                            <InfoCard label="Time Zones" value={gisData.preferredTimeZones} />
                          </div>
                          {gisData.serviceModes?.length > 0 && (
                            <SkillCard label="Service Modes" skills={gisData.serviceModes} color="cyan" />
                          )}
                        </div>
                      ),
                    },
                  ].map((section, index) => (
                    <CollapsibleCard
                      key={index}
                      title={section.title}
                      badge={section.badge}
                      color={section.color}
                      isExpanded={expandedSections[section.title]}
                      toggle={() => toggleSection(section.title)}
                    >
                      {section.content || <p className="text-gray-600">No data available</p>}
                    </CollapsibleCard>
                  ))}

                  {/* Status & Actions */}
                  <div className="mt-8 bg-white p-6 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${gisData.isDraft ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                        {gisData.isDraft ? (
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        ) : (
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">Profile Status</h4>
                        <p className={gisData.isDraft ? "text-yellow-600" : "text-green-600"}>
                          {gisData.isDraft ? "Draft (Not visible to others)" : "Published (Visible to clients)"}
                        </p>
                      </div>
                    </div>
                    <Link href="/gis-registration">
                      <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Create Your GIS Profile</h3>
                  <p className="text-gray-600 mb-6 max-w-lg mx-auto text-lg">
                    Build a standout profile to connect with opportunities in the geospatial industry.
                  </p>
                  <Link href="/gis-registration">
                    <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Create Profile
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const CollapsibleCard = ({ title, badge, color, isExpanded, toggle, children }) => (
  <div className="bg-gray-50 rounded-xl shadow-sm overflow-hidden mb-4">
    <button
      onClick={toggle}
      className={`w-full p-5 flex justify-between items-center bg-${color}-50 text-${color}-800 hover:bg-${color}-100 transition-all duration-300`}
    >
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <span className={`bg-${color}-100 text-${color}-800 text-xs px-3 py-1 rounded-full`}>{badge}</span>
      </div>
      <svg className={`w-6 h-6 transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isExpanded && <div className="p-6 animate-fade-in">{children}</div>}
  </div>
);

const InfoCard = ({ label, value, span = 1 }) => (
  <div className={`bg-white p-5 rounded-xl shadow-sm ${span === 2 ? "md:col-span-2" : ""}`}>
    <label className="block text-sm font-medium text-gray-500 mb-2">{label}</label>
    <p className="text-lg text-gray-900 font-medium">{value || "Not provided"}</p>
  </div>
);

const SkillCard = ({ label, skills, color, span = 1 }) => (
  <div className={`bg-white p-5 rounded-xl shadow-sm ${span === 2 ? "md:col-span-2" : ""}`}>
    <label className="block text-sm font-medium text-gray-500 mb-2">{label}</label>
    <div className="flex flex-wrap gap-3">
      {skills.map((skill, index) => (
        <span key={index} className={`bg-${color}-100 text-${color}-800 text-sm px-4 py-1 rounded-full shadow-sm`}>
          {skill}
        </span>
      ))}
    </div>
  </div>
);

const LinkCard = ({ label, url }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm">
    <label className="block text-sm font-medium text-gray-500 mb-2">{label}</label>
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2">
      {label === "LinkedIn" ? (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )}
      View {label}
    </a>
  </div>
);

export default Profile;