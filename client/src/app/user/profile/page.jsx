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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Floating profile card */}
        <div className="relative -mt-16 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row items-center gap-6 transform transition-all hover:shadow-2xl">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white ${user.is_verified ? 'bg-green-500' : 'bg-gray-400'}`}>
                {user.is_verified && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-800">{user.name || "User"}</h1>
              <p className="text-gray-600">{user.email || "user@example.com"}</p>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {user.is_verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-8">
          {/* GIS Registration Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <h2 className="text-2xl font-bold tracking-tight">GIS Professional Profile</h2>
              <p className="opacity-90">Your comprehensive geospatial information profile</p>
            </div>

            <div className="p-6">
              {gisError ? (
                gisError === "No registration data found" ? (
                  <div className="text-center py-10">
                    <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Complete Your GIS Profile</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Unlock more opportunities by completing your GIS professional profile. Showcase your skills, experience, and expertise to potential clients and employers.
                    </p>
                    <Link href="/gis-registration">
                      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Get Started
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Error Loading Profile</h3>
                    <p className="text-red-500 mb-6">{gisError}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium transition-all duration-300"
                    >
                      Try Again
                    </button>
                  </div>
                )
              ) : gisData ? (
                <div className="space-y-8">
                  {/* Personal Information Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Basic Info</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gisData.profileImage && (
                        <div className="md:col-span-2 flex justify-center">
                          <div className="relative">
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/${gisData.profileImage}`}
                              alt="Profile"
                              className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
                              onError={(e) => (e.target.src = "/fallback-image.jpg")}
                            />
                            <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow">
                              <div className="bg-blue-600 p-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-white p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                        <p className="text-lg text-gray-900 font-medium">{gisData.fullName || "Not provided"}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Contact</label>
                        <p className="text-lg text-gray-900 font-medium">{gisData.contactNumber || "Not provided"}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                        <p className="text-lg text-gray-900 font-medium">{gisData.dob || "Not provided"}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                        <p className="text-lg text-gray-900 font-medium">{gisData.gender || "Not provided"}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Nationality</label>
                        <p className="text-lg text-gray-900 font-medium">{gisData.nationality || "Not provided"}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg md:col-span-2">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                        <p className="text-lg text-gray-900 font-medium">
                          {gisData.address ? `${gisData.address}, ${gisData.city}, ${gisData.state} ${gisData.pinCode}` : "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Education & Skills Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Education Card */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Education</h3>
                        <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">Qualifications</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Institution</label>
                          <p className="text-lg text-gray-900 font-medium">{gisData.institution || "Not provided"}</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Field of Study</label>
                          <p className="text-lg text-gray-900 font-medium">{gisData.fieldOfStudy || "Not provided"}</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Highest Qualification</label>
                          <p className="text-lg text-gray-900 font-medium">{gisData.education || "Not provided"}</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Year of Graduation</label>
                          <p className="text-lg text-gray-900 font-medium">{gisData.year || "Not provided"}</p>
                        </div>
                        
                        {gisData.certifications?.length > 0 && (
                          <div className="bg-white p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Certifications</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {gisData.certifications.map((cert, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Skills Card */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Technical Skills</h3>
                        <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">Expertise</span>
                      </div>
                      
                      <div className="space-y-4">
                        {gisData.gisSoftware?.length > 0 && (
                          <div className="bg-white p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-500 mb-1">GIS Software</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {[...gisData.gisSoftware, gisData.gisSoftwareOther].filter(Boolean).map((software, index) => (
                                <span key={index} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                                  {software}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {gisData.programmingSkills?.length > 0 && (
                          <div className="bg-white p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Programming</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {[...gisData.programmingSkills, gisData.programmingSkillsOther].filter(Boolean).map((skill, index) => (
                                <span key={index} className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {gisData.CoreExpertise?.length > 0 && (
                          <div className="bg-white p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Core Expertise</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {[...gisData.CoreExpertise, gisData.CoreExpertiseOther].filter(Boolean).map((expertise, index) => (
                                <span key={index} className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                                  {expertise}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Drone Processing</label>
                            <p className="text-lg text-gray-900 font-medium">{gisData.droneDataProcessing || "Not provided"}</p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-500 mb-1">LiDAR Processing</label>
                            <p className="text-lg text-gray-900 font-medium">{gisData.lidarProcessing || "Not provided"}</p>
                          </div>
                        </div>
                        
                        {gisData.photogrammetrySoftware?.length > 0 && (
                          <div className="bg-white p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Photogrammetry</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {[...gisData.photogrammetrySoftware, gisData.photogrammetrySoftwareOther].filter(Boolean).map((tool, index) => (
                                <span key={index} className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional Experience Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Professional Experience</h3>
                      <span className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full">Career</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Experience</label>
                        <p className="text-lg text-gray-900 font-medium">{gisData.experience || "Not provided"}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Organization</label>
                        <p className="text-lg text-gray-900 font-medium">{gisData.organization || "Not provided"}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Job Title</label>
                        <p className="text-lg text-gray-900 font-medium">{gisData.jobTitle || "Not provided"}</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Employment Type</label>
                        <p className="text-lg text-gray-900 font-medium">{gisData.employer || "Not provided"}</p>
                      </div>
                      
                      {gisData.skills?.length > 0 && (
                        <div className="bg-white p-4 rounded-lg md:col-span-2">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Key Skills</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {gisData.skills.map((skill, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {gisData.linkedIn && (
                        <div className="bg-white p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-500 mb-1">LinkedIn</label>
                          <a 
                            href={gisData.linkedIn} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                            View Profile
                          </a>
                        </div>
                      )}
                      
                      {gisData.portfolio && (
                        <div className="bg-white p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Portfolio</label>
                          <a 
                            href={gisData.portfolio} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            Visit Site
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Projects Section */}
                  {gisData.projects?.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Projects</h3>
                        <span className="bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full">Work</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gisData.projects.map((project, index) => (
                          <div
                            key={index}
                            className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-all duration-300 border-l-4 border-blue-500"
                          >
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                              {project.title || "Untitled Project"}
                            </h4>
                            <p className="text-gray-600 mb-3">{project.description || "No description available"}</p>
                            {project.technologies && (
                              <div className="mt-3">
                                <span className="text-sm font-medium text-gray-500">Technologies:</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {project.technologies.split(',').map((tech, i) => (
                                    <span key={i} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                      {tech.trim()}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Equipment & Availability Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Equipment Card */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Equipment</h3>
                        <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full">Tools</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Owns Equipment</label>
                          <p className="text-lg text-gray-900 font-medium">{gisData.ownEquipment || "Not provided"}</p>
                        </div>
                        
                        {gisData.ownEquipment === "Yes" && (
                          <>
                            {gisData.availableEquipment?.length > 0 && (
                              <div className="bg-white p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Available Equipment</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {gisData.availableEquipment.map((equip, index) => (
                                    <span key={index} className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                                      {equip}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Brand</label>
                                <p className="text-lg text-gray-900 font-medium">{gisData.equipmentBrand || "Not provided"}</p>
                              </div>
                              
                              <div className="bg-white p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Year</label>
                                <p className="text-lg text-gray-900 font-medium">{gisData.equipmentYear || "Not provided"}</p>
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded-lg">
                              <label className="block text-sm font-medium text-gray-500 mb-1">Model</label>
                              <p className="text-lg text-gray-900 font-medium">{gisData.equipmentName || "Not provided"}</p>
                            </div>
                            
                            {gisData.equipmentSpecs && (
                              <div className="bg-white p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Specifications</label>
                                <p className="text-gray-900 whitespace-pre-line">{gisData.equipmentSpecs}</p>
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Maintenance</label>
                                <p className="text-lg text-gray-900 font-medium">{gisData.maintenanceSchedule || "Not provided"}</p>
                              </div>
                              
                              <div className="bg-white p-4 rounded-lg">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Certification</label>
                                <p className="text-lg text-gray-900 font-medium">{gisData.droneCertification || "Not provided"}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Availability Card */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Availability</h3>
                        <span className="bg-cyan-100 text-cyan-800 text-xs px-3 py-1 rounded-full">Preferences</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Work Mode</label>
                            <p className="text-lg text-gray-900 font-medium">{gisData.workMode || "Not provided"}</p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Work Type</label>
                            <p className="text-lg text-gray-900 font-medium">{gisData.workType || "Not provided"}</p>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Availability</label>
                          <p className="text-lg text-gray-900 font-medium">{gisData.availability || "Not provided"}</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg">
                          <label className="block text-sm font-medium text-gray-500 mb-1">Travel</label>
                          <p className="text-lg text-gray-900 font-medium">{gisData.travelWillingness || "Not provided"}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Work Hours</label>
                            <p className="text-lg text-gray-900 font-medium">{gisData.workHours || "Not provided"}</p>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Time Zones</label>
                            <p className="text-lg text-gray-900 font-medium">{gisData.preferredTimeZones || "Not provided"}</p>
                          </div>
                        </div>
                        
                        {gisData.serviceModes?.length > 0 && (
                          <div className="bg-white p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Service Modes</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {gisData.serviceModes.map((mode, index) => (
                                <span key={index} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                                  {mode}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="mt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${gisData.isDraft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                          {gisData.isDraft ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Profile Status</h4>
                          <p className={gisData.isDraft ? 'text-yellow-600' : 'text-green-600'}>
                            {gisData.isDraft ? 'Draft (Not visible to others)' : 'Published (Visible to potential clients)'}
                          </p>
                        </div>
                      </div>
                      
                      <Link href="/gis-registration">
                        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Profile
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Create Your GIS Profile</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Stand out in the geospatial community by creating a comprehensive professional profile that showcases your skills and experience.
                  </p>
                  <Link href="/gis-registration">
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
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

export default Profile;