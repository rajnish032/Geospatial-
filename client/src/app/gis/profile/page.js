"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const Input = React.memo(
  ({
    name,
    label,
    type = "text",
    required = false,
    value,
    onChange,
    error,
    ...props
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
);

const Select = React.memo(
  ({
    name,
    label,
    options,
    required = false,
    value,
    onChange,
    error,
    ...props
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        {...props}
        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
);

const Checkbox = React.memo(
  ({ name, label, value, checked, onChange, ...props }) => (
    <label className="flex items-center space-x-2 mb-2">
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        {...props}
      />
      <span className="text-gray-700">{label}</span>
    </label>
  )
);

const Textarea = React.memo(
  ({ name, label, required = false, value, onChange, error, ...props }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        {...props}
        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
);

const FileUpload = React.memo(
  ({ name, label, accept, onChange, error, multiple = false, ...props }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        multiple={multiple}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
);

const TabContent = React.memo(({ title, children, tabNumber, isSaved }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      {isSaved && (
        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
          Saved
        </span>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
));

export default function GISRegistrationForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);
  const [workSamples, setWorkSamples] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedTabs, setSavedTabs] = useState([]);
  const [hasDraft, setHasDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverMessage, setServerMessage] = useState({ type: "", message: "" });
  const [visitedTabs, setVisitedTabs] = useState(new Set([1]));
  const tabRefs = useRef([]);

  const initialFormData = {
    fullName: "",
    dob: "",
    gender: "Male",
    contactNumber: "",
    email: "",
    nationality: "Indian",
    profileImage: null,
    address: "",
    pinCode: "",
    city: "",
    state: "",
    institution: "",
    education: "Bachelor's Degree",
    certifications: [],
    fieldOfStudy: "Geoinformatics",
    year: new Date().getFullYear().toString(),
    gisSoftware: ["QGIS"],
    gisSoftwareOther: "",
    programmingSkills: [],
    programmingSkillsOther: "",
    CoreExpertise: [],
    CoreExpertiseOther: "",
    droneDataProcessing: "Beginner",
    photogrammetrySoftware: [],
    photogrammetrySoftwareOther: "",
    remoteSensing: "Beginner",
    lidarProcessing: "Beginner",
    experience: "1",
    organization: "",
    employer: "Freelancer",
    linkedIn: "",
    portfolio: "",
    jobTitle: "GIS Specialist",
    skills: ["GIS Analysis"],
    workMode: "Remote",
    workType: "Full-time",
    workHours: "9am-5pm",
    availability: "Full-time",
    travelWillingness: "Yes",
    preferredTimeZones: "IST",
    serviceModes: ["Online"],
    projects: [
      { title: "", description: "", technologies: "" },
      { title: "", description: "", technologies: "" },
      { title: "", description: "", technologies: "" },
    ],
    ownEquipment: "No",
    availableEquipment: [],
    equipmentName: "",
    equipmentBrand: "",
    equipmentYear: "",
    equipmentSpecs: "",
    maintenanceSchedule: "Annual",
    droneCertification: "No",
    equipmentRental: "No",
    rentalTerms: "",
    acceptTerms: false,
    consentMarketing: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const loadDraftData = async () => {
      console.log("Starting to load draft data...");
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1];
        console.log("Token for draft fetch:", token);

        const response = await fetch("http://localhost:8000/api/gis-registration/draft", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`, // Explicitly add token
          },
        });
        console.log("Draft fetch response status:", response.status);

        if (response.ok) {
          const { exists, draftData } = await response.json();
          console.log("Draft data received:", { exists, draftData });
          if (exists && draftData) {
            const parsedProjects =
              draftData.projects && typeof draftData.projects === "string"
                ? JSON.parse(draftData.projects)
                : draftData.projects || initialFormData.projects;
            const parsedSavedTabs =
              draftData.savedTabs && typeof draftData.savedTabs === "string"
                ? JSON.parse(draftData.savedTabs).map(Number)
                : (draftData.savedTabs || []).map(Number);

            let validatedDob = draftData.dob;
            if (validatedDob && !/^\d{4}-\d{2}-\d{2}$/.test(validatedDob)) {
              validatedDob = "";
              setErrors((prev) => ({
                ...prev,
                dob: "Loaded draft has invalid date format, please select again",
              }));
            }

            setFormData((prev) => ({
              ...prev,
              ...draftData,
              dob: validatedDob,
              projects: parsedProjects,
              savedTabs: parsedSavedTabs,
            }));
            setActiveTab(draftData.lastSavedTab || 1);
            setSavedTabs(parsedSavedTabs);
            setHasDraft(true);
            setVisitedTabs(
              (prev) => new Set([...prev, draftData.lastSavedTab || 1])
            );
          }
        } else {
          console.log("Draft fetch failed with status:", response.status);
        }
      } catch (error) {
        console.error("Error loading draft:", error);
        setServerMessage({
          type: "error",
          message: "Failed to load draft data",
        });
      } finally {
        console.log("Setting isLoading to false");
        setIsLoading(false);
      }
    };
    loadDraftData();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (name === "dob") {
      // Agar dob hai, toh ensure karo ki YYYY-MM-DD format mein hai
      if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          dob: "Date of birth must be in YYYY-MM-DD format (e.g., 1990-01-01)",
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, dob: "" })); // Error clear karo agar sahi hai
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  }, []);

  const handleArrayChange = useCallback((e, field) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  }, []);

  const handleProjectChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedProjects = [...prev.projects];
      updatedProjects[index] = { ...updatedProjects[index], [field]: value };
      return { ...prev, projects: updatedProjects };
    });
  }, []);

  const addProject = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: "", description: "", technologies: "" },
      ],
    }));
  }, []);

  const handleWorkSampleUpload = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      if (files.length + workSamples.length > 5) {
        setServerMessage({
          type: "error",
          message: "Maximum 5 work samples allowed",
        });
        return;
      }
      setWorkSamples((prev) => [...prev, ...files]);
    },
    [workSamples]
  );

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setServerMessage({
        type: "error",
        message: "Only JPEG or PNG images are allowed",
      });
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setServerMessage({
        type: "error",
        message: "Profile image must be less than 3MB",
      });
      return;
    }
    setFormData((prev) => ({ ...prev, profileImage: file }));
  }, []);

  const getTabData = (tabNumber, formData) => {
    switch (tabNumber) {
      case 1:
        return {
          fullName: formData.fullName,
          dob: formData.dob,
          gender: formData.gender,
          contactNumber: formData.contactNumber,
          email: formData.email,
          nationality: formData.nationality,
          profileImage: formData.profileImage,
          address: formData.address,
          pinCode: formData.pinCode,
          city: formData.city,
          state: formData.state,
        };
      case 2:
        return {
          institution: formData.institution,
          education: formData.education,
          certifications: formData.certifications,
          fieldOfStudy: formData.fieldOfStudy,
          year: formData.year,
        };
      case 3:
        return {
          gisSoftware: formData.gisSoftware,
          gisSoftwareOther: formData.gisSoftwareOther,
          programmingSkills: formData.programmingSkills,
          programmingSkillsOther: formData.programmingSkillsOther,
          CoreExpertise: formData.CoreExpertise,
          CoreExpertiseOther: formData.CoreExpertiseOther,
          droneDataProcessing: formData.droneDataProcessing,
          photogrammetrySoftware: formData.photogrammetrySoftware,
          photogrammetrySoftwareOther: formData.photogrammetrySoftwareOther,
          remoteSensing: formData.remoteSensing,
          lidarProcessing: formData.lidarProcessing,
        };
      case 4:
        return {
          experience: formData.experience,
          organization: formData.organization,
          employer: formData.employer,
          linkedIn: formData.linkedIn,
          portfolio: formData.portfolio,
          jobTitle: formData.jobTitle,
          skills: formData.skills,
        };
      case 5:
        return {
          projects: formData.projects,
          workSamples: formData.workSamples, // Handled separately via files
        };
      case 6:
        return {
          ownEquipment: formData.ownEquipment,
          availableEquipment: formData.availableEquipment,
          equipmentName: formData.equipmentName,
          equipmentBrand: formData.equipmentBrand,
          equipmentYear: formData.equipmentYear,
          equipmentSpecs: formData.equipmentSpecs,
          maintenanceSchedule: formData.maintenanceSchedule,
          droneCertification: formData.droneCertification,
          certificationFile: formData.certificationFile,
        };
      case 7:
        return {
          workMode: formData.workMode,
          workType: formData.workType,
          workHours: formData.workHours,
          availability: formData.availability,
          travelWillingness: formData.travelWillingness,
          preferredTimeZones: formData.preferredTimeZones,
          serviceModes: formData.serviceModes,
        };
      case 8:
        return {
          acceptTerms: formData.acceptTerms,
          consentMarketing: formData.consentMarketing,
        };
      default:
        return {};
    }
  };

  const handleSubmit = useCallback(
    async (e, isDraft = false) => {
      e.preventDefault();
      setIsSubmitting(true);
      setServerMessage({ type: "", message: "" });
  
      if (!isDraft) {
        // Full submission logic (unchanged)
        const requiredFields = [
          "fullName", "dob", "contactNumber", "email", "address", "pinCode",
          "city", "state", "institution", "education", "fieldOfStudy", "experience", "acceptTerms"
        ];
        const newErrors = {};
  
        requiredFields.forEach((field) => {
          if (!formData[field] || formData[field].toString().trim() === "") {
            newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          }
        });
  
        if (formData.dob && !/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
          newErrors.dob = "Date of birth must be in YYYY-MM-DD format (e.g., 1990-01-01)";
        }
        if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
          newErrors.contactNumber = "Contact number must be exactly 10 digits";
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = "Invalid email format";
        }
        if (!["Male", "Female", "Other", "Prefer not to say"].includes(formData.gender)) {
          newErrors.gender = "Invalid gender selection";
        }
        if (!formData.acceptTerms) {
          newErrors.acceptTerms = "You must accept the terms and conditions";
        }
        if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode)) {
          newErrors.pinCode = "Pin code must be exactly 6 digits";
        }
  
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          setServerMessage({ type: "error", message: "Please fix the errors before submitting" });
          setIsSubmitting(false);
          return;
        }
  
        const fileFormData = new FormData();
        for (const [key, value] of Object.entries(formData)) {
          if (Array.isArray(value)) {
            fileFormData.append(key, JSON.stringify(value));
          } else if (value instanceof File) {
            fileFormData.append(key, value);
          } else {
            fileFormData.append(key, value);
          }
        }
        workSamples.forEach((file) => fileFormData.append("workSamples", file));
  
        const endpoint = "http://localhost:8000/api/gis-registration/submit";
        const response = await fetch(endpoint, {
          method: "POST",
          body: fileFormData,
          credentials: "include",
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          setServerMessage({
            type: "error",
            message: `Submission failed: ${errorData.message}`,
            errors: errorData.errors || [],
          });
          setErrors(
            errorData.errors?.reduce((acc, err) => ({ ...acc, [err.field]: err.message }), {}) || {}
          );
          setIsSubmitting(false);
          throw new Error(errorData.message);
        }
  
        const data = await response.json();
        setServerMessage({
          type: "success",
          message: "Registration successful! Redirecting...",
        });
        setTimeout(() => {
          setFormData(initialFormData);
          router.push("/user/profile");
        }, 1500);
      } else {
        // Draft save: Send only current tab data
        const tabData = getTabData(activeTab, formData);
        const fileFormData = new FormData();
        fileFormData.append("tabNumber", activeTab);
        fileFormData.append("isDraft", "true");
  
        // Append tab-specific data
        for (const [key, value] of Object.entries(tabData)) {
          if (key === "profileImage" && value instanceof File) {
            fileFormData.append("profileImage", value);
          } else if (key === "certificationFile" && value instanceof File) {
            fileFormData.append("certificationFile", value);
          } else if (key === "workSamples") {
            workSamples.forEach((file) => fileFormData.append("workSamples", file));
          } else if (Array.isArray(value)) {
            fileFormData.append(key, JSON.stringify(value));
          } else {
            fileFormData.append(key, value);
          }
        }
  
        try {
          const response = await fetch("http://localhost:8000/api/gis-registration/draft", {
            method: "PUT",
            body: fileFormData,
            credentials: "include",
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to save draft");
          }
  
          const data = await response.json();
          setSavedTabs((prev) => [...new Set([...prev, activeTab])]);
          setServerMessage({ type: "success", message: `Tab ${activeTab} saved successfully!` });
        } catch (err) {
          setServerMessage({ type: "error", message: `Error: ${err.message}` });
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [formData, activeTab, workSamples, router]
  );

  const handleStartNewForm = useCallback(async () => {
    if (
      !confirm(
        "Are you sure you want to start a new form? Your draft will be deleted."
      )
    )
      return;
    try {
      const response = await fetch(
        "http://localhost:8000/api/gis-registration/draft",
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        setFormData(initialFormData);
        setActiveTab(1);
        setSavedTabs([]);
        setHasDraft(false);
        setWorkSamples([]);
        setServerMessage({
          type: "success",
          message: "Draft deleted successfully",
        });
      } else {
        throw new Error("Failed to delete draft");
      }
    } catch (error) {
      console.error("Error deleting draft:", error);
      setServerMessage({ type: "error", message: "Failed to delete draft" });
    }
  }, []);

  const handleTabChange = useCallback((tabNumber) => {
    setVisitedTabs((prev) => new Set([...prev, tabNumber]));
    setActiveTab(tabNumber);
    if (tabRefs.current[tabNumber - 1]) {
      tabRefs.current[tabNumber - 1].focus();
    }
  }, []);

  const validateForm = useCallback(
    (tab) => {
      const newErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10}$/;
      const pincodeRegex = /^\d{6}$/;

      const requiredFields = {
        1: ["fullName", "email", "contactNumber", "dob", "address", "pinCode"],
        2: ["institution", "fieldOfStudy"],
        5: formData.projects.map((_, i) => `projectTitle${i}`),
        8: ["acceptTerms"],
      };

      requiredFields[tab]?.forEach((field) => {
        if (field.startsWith("projectTitle")) {
          const index = parseInt(field.replace("projectTitle", ""));
          if (!formData.projects[index]?.title?.trim()) {
            newErrors[field] = `Project ${index + 1} title is required`;
          }
        } else if (!formData[field]?.toString().trim()) {
          newErrors[field] = `${
            field.charAt(0).toUpperCase() +
            field.slice(1).replace(/([A-Z])/g, " $1")
          } is required`;
        }
      });

      if (tab === 1) {
        if (formData.email && !emailRegex.test(formData.email))
          newErrors.email = "Valid email is required";
        if (formData.contactNumber && !phoneRegex.test(formData.contactNumber))
          newErrors.contactNumber = "Valid 10-digit phone number is required";
        if (formData.pinCode && !pincodeRegex.test(formData.pinCode))
          newErrors.pinCode = "Valid 6-digit pin code is required";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  const handleNext = useCallback(() => {
    if (validateForm(activeTab)) {
      setActiveTab((prev) => Math.min(prev + 1, 8));
      setVisitedTabs((prev) => new Set([...prev, activeTab + 1]));
    } else {
      setServerMessage({
        type: "error",
        message: "Please fix the errors before proceeding",
      });
    }
  }, [activeTab, validateForm]);

  const handlePrev = useCallback(() => {
    if (activeTab > 1) setActiveTab(activeTab - 1);
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (hasDraft) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Continue Your Registration
          </h2>
          {serverMessage.message && (
            <div
              className={`mb-4 p-3 rounded flex justify-between items-center ${
                serverMessage.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {serverMessage.message}
              <button
                onClick={() => setServerMessage({ type: "", message: "" })}
                className="text-sm"
              >
                ✕
              </button>
            </div>
          )}
          <p className="mb-6 text-gray-600 text-center">
            We found an incomplete registration draft. Would you like to
            continue?
          </p>
          <div className="space-y-4">
            <button
              onClick={() => setHasDraft(false)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Continue Draft
            </button>
            <button
              onClick={handleStartNewForm}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Start New Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <h2 className="text-center text-3xl font-bold text-blue-600">
          GIS Processing Member Registration
        </h2>

        {/* Progress Bar */}
        <div className="relative w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(activeTab / 8) * 100}%` }}
          />
          <span className="absolute top-[-20px] right-0 text-sm text-gray-600">
            {Math.round((activeTab / 8) * 100)}%
          </span>
        </div>

        {/* Sticky Tabs Navigation */}
        <div className="sticky top-0 z-10 bg-white shadow-md rounded-lg p-2 mb-4">
          <div className="flex overflow-x-auto">
            {[
              "Personal Info",
              "Education",
              "Technical Skills",
              "Professional Info",
              "Projects",
              "Equipment",
              "Availability",
              "Terms",
            ].map((tab, index) => (
              <button
                key={index}
                onClick={() => handleTabChange(index + 1)}
                className={`flex-1 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                  activeTab === index + 1
                    ? "bg-blue-100 text-blue-600 border-b-2 border-blue-500"
                    : visitedTabs.has(index + 1)
                    ? "text-blue-500 hover:bg-blue-50"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {tab}{" "}
                {savedTabs.includes(index + 1) && (
                  <span className="ml-1 text-green-500">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Server Message */}
        {serverMessage.message && (
          <div
            className={`p-4 rounded-lg flex justify-between items-center shadow-md ${
              serverMessage.type === "error"
                ? "bg-red-50 border-l-4 border-red-500 text-red-700"
                : "bg-green-50 border-l-4 border-green-500 text-green-700"
            }`}
          >
            <p>{serverMessage.message}</p>
            <button
              onClick={() => setServerMessage({ type: "", message: "" })}
              className="text-sm"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          {activeTab === 1 && (
            <TabContent
              title="Personal Information"
              tabNumber={1}
              isSaved={savedTabs.includes(1)}
            >
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <input
                  ref={(el) => (tabRefs.current[0] = el)} // Auto-focus
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full p-2 border rounded-lg bg-gray-50"
                />
                {formData.profileImage && (
                  <div className="mt-2 flex items-center">
                    <img
                      src={
                        formData.profileImage instanceof File
                          ? URL.createObjectURL(formData.profileImage)
                          : formData.profileImage
                      }
                      alt="Profile Preview"
                      className="w-24 h-24 rounded-full border object-cover shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, profileImage: null }))
                      }
                      className="ml-4 text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <Input
                name="fullName"
                label="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                error={errors.fullName}
              />
              <Input
                name="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
              />
              <Input
                name="contactNumber"
                type="tel"
                label="Contact Number"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                error={errors.contactNumber}
              />
              <Input
                name="dob"
                type="date"
                label="Date of Birth"
                value={formData.dob}
                onChange={handleChange}
                required
                error={errors.dob}
              />
              <Select
                name="gender"
                label="Gender"
                value={formData.gender}
                onChange={handleChange}
                options={["Male", "Female", "Other", "Prefer not to say"]}
                required
              />
              <Select
                name="nationality"
                label="Nationality"
                value={formData.nationality}
                onChange={handleChange}
                options={[
                  "Indian",
                  "American",
                  "Canadian",
                  "British",
                  "Australian",
                  "Other",
                ]}
                required
              />
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  Address Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Textarea
                    name="address"
                    label="Street Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    error={errors.address}
                  />
                  <Input
                    name="pinCode"
                    label="Pin Code"
                    value={formData.pinCode}
                    onChange={handleChange}
                    required
                    error={errors.pinCode}
                  />
                  <Input
                    name="city"
                    label="City"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="state"
                    label="State/Province"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </TabContent>
          )}

          {activeTab === 2 && (
            <TabContent
              title="Educational Background"
              tabNumber={2}
              isSaved={savedTabs.includes(2)}
            >
              <Input
                ref={(el) => (tabRefs.current[1] = el)}
                name="institution"
                label="University/Institute Name"
                value={formData.institution}
                onChange={handleChange}
                required
                error={errors.institution}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="education"
                  label="Highest Qualification"
                  value={formData.education}
                  onChange={handleChange}
                />
                <Input
                  name="fieldOfStudy"
                  label="Field of Study"
                  value={formData.fieldOfStudy}
                  onChange={handleChange}
                  required
                  error={errors.fieldOfStudy}
                />
                <Input
                  name="year"
                  label="Year of Graduation"
                  type="number"
                  min="1900"
                  max="2099"
                  value={formData.year}
                  onChange={handleChange}
                />
              </div>
              <Textarea
                name="certifications"
                label="Certifications (comma separated)"
                placeholder="e.g., GIS Professional Certification"
                value={formData.certifications}
                onChange={handleChange}
                className="md:col-span-2"
              />
            </TabContent>
          )}

          {activeTab === 3 && (
            <TabContent
              title="Technical Skills & Expertise"
              tabNumber={3}
              isSaved={savedTabs.includes(3)}
            >
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    GIS Software
                  </h4>
                  {[
                    "ArcGIS",
                    "QGIS",
                    "AutoCAD",
                    "Global Mapper",
                    "ERDAS Imagine",
                    "ENVI",
                    "GRASS GIS",
                    "MapInfo",
                  ].map((software) => (
                    <Checkbox
                      key={software}
                      name="gisSoftware"
                      value={software}
                      label={software}
                      checked={formData.gisSoftware.includes(software)}
                      onChange={(e) => handleArrayChange(e, "gisSoftware")}
                    />
                  ))}
                  <Input
                    name="gisSoftwareOther"
                    label="Other GIS Software"
                    value={formData.gisSoftwareOther}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Programming Skills
                  </h4>
                  {[
                    "Python",
                    "JavaScript",
                    "R",
                    "SQL",
                    "Java",
                    "C++",
                    "MATLAB",
                    "PHP",
                  ].map((lang) => (
                    <Checkbox
                      key={lang}
                      name="programmingSkills"
                      value={lang}
                      label={lang}
                      checked={formData.programmingSkills.includes(lang)}
                      onChange={(e) =>
                        handleArrayChange(e, "programmingSkills")
                      }
                    />
                  ))}
                  <Input
                    name="programmingSkillsOther"
                    label="Other Languages"
                    value={formData.programmingSkillsOther}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Core Expertise
                  </h4>
                  {[
                    "Remote Sensing",
                    "Spatial Analysis",
                    "Cartography",
                    "Geodatabases",
                    "Web GIS",
                    "Geostatistics",
                    "3D Modeling",
                    "Hydrology",
                  ].map((expertise) => (
                    <Checkbox
                      key={expertise}
                      name="CoreExpertise"
                      value={expertise}
                      label={expertise}
                      checked={formData.CoreExpertise.includes(expertise)}
                      onChange={(e) => handleArrayChange(e, "CoreExpertise")}
                    />
                  ))}
                  <Input
                    name="CoreExpertiseOther"
                    label="Other Expertise"
                    value={formData.CoreExpertiseOther}
                    onChange={handleChange}
                  />
                </div>
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Select
                    name="droneDataProcessing"
                    label="Drone Data Processing"
                    value={formData.droneDataProcessing}
                    onChange={handleChange}
                    options={["None", "Beginner", "Intermediate", "Advanced"]}
                  />
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Photogrammetry Software
                    </h4>
                    {["Pix4D", "Agisoft", "DroneDeploy", "WebODM"].map(
                      (software) => (
                        <Checkbox
                          key={software}
                          name="photogrammetrySoftware"
                          value={software}
                          label={software}
                          checked={formData.photogrammetrySoftware.includes(
                            software
                          )}
                          onChange={(e) =>
                            handleArrayChange(e, "photogrammetrySoftware")
                          }
                        />
                      )
                    )}
                    <Input
                      name="photogrammetrySoftwareOther"
                      label="Other Software"
                      value={formData.photogrammetrySoftwareOther}
                      onChange={handleChange}
                    />
                  </div>
                  <Select
                    name="lidarProcessing"
                    label="LiDAR Processing"
                    value={formData.lidarProcessing}
                    onChange={handleChange}
                    options={["None", "Beginner", "Intermediate", "Advanced"]}
                  />
                </div>
              </div>
            </TabContent>
          )}

          {activeTab === 4 && (
            <TabContent
              title="Professional Information"
              tabNumber={4}
              isSaved={savedTabs.includes(4)}
            >
              <Input
                ref={(el) => (tabRefs.current[3] = el)}
                name="experience"
                label="Years of Experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={handleChange}
              />
              <Input
                name="organization"
                label="Current Organization"
                value={formData.organization}
                onChange={handleChange}
              />
              <Select
                name="employer"
                label="Employment Type"
                value={formData.employer}
                onChange={handleChange}
                options={[
                  "Full-time",
                  "Part-time",
                  "Freelancer",
                  "Student",
                  "Unemployed",
                  "Other",
                ]}
              />
              <Input
                name="jobTitle"
                label="Current Job Title"
                value={formData.jobTitle}
                onChange={handleChange}
              />
              <Input
                name="linkedIn"
                label="LinkedIn Profile URL"
                type="url"
                value={formData.linkedIn}
                onChange={handleChange}
              />
              <Input
                name="portfolio"
                label="Portfolio Website"
                type="url"
                value={formData.portfolio}
                onChange={handleChange}
              />
              <Textarea
                name="skills"
                label="Key Skills Summary"
                placeholder="Brief summary of your key skills"
                value={formData.skills}
                onChange={handleChange}
              />
            </TabContent>
          )}

          {activeTab === 5 && (
            <TabContent
              title="Projects & Work Samples"
              tabNumber={5}
              isSaved={savedTabs.includes(5)}
            >
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  Project Portfolio
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Provide details of at least 3 projects you've worked on.
                </p>
                {formData.projects.map((project, index) => (
                  <div
                    key={`project-${index}`}
                    className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm"
                  >
                    <h5 className="font-medium text-gray-800 mb-2">
                      Project {index + 1}
                    </h5>
                    <Input
                      ref={(el) => index === 0 && (tabRefs.current[4] = el)} // Auto-focus first project
                      name={`projectTitle${index}`}
                      label="Project Title"
                      value={project.title}
                      onChange={(e) =>
                        handleProjectChange(index, "title", e.target.value)
                      }
                      required
                      error={errors[`projectTitle${index}`]}
                    />
                    <Textarea
                      name={`projectDesc${index}`}
                      label="Description"
                      value={project.description}
                      onChange={(e) =>
                        handleProjectChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      required
                    />
                    <Input
                      name={`projectTech${index}`}
                      label="Technologies Used"
                      value={project.technologies}
                      onChange={(e) =>
                        handleProjectChange(
                          index,
                          "technologies",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProject}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  + Add Another Project
                </button>
              </div>
              <div className="md:col-span-2 mt-6">
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  Work Samples
                </h4>
                <FileUpload
                  name="workSamples"
                  label="Upload Work Samples (max 5 files)"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleWorkSampleUpload}
                  multiple
                />
                {workSamples.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-800 mb-2">
                      Selected Files:
                    </h5>
                    <ul className="list-disc pl-5">
                      {workSamples.map((file, index) => (
                        <li key={index} className="text-sm text-gray-700">
                          {file.name}
                          <button
                            type="button"
                            onClick={() =>
                              setWorkSamples(
                                workSamples.filter((_, i) => i !== index)
                              )
                            }
                            className="ml-2 text-red-500 hover:underline"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabContent>
          )}

          {activeTab === 6 && (
            <TabContent
              title="Equipment & Hardware"
              tabNumber={6}
              isSaved={savedTabs.includes(6)}
            >
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  Equipment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">
                      Do you own any GIS/surveying equipment?
                    </h5>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          ref={(el) => (tabRefs.current[5] = el)}
                          type="radio"
                          name="ownEquipment"
                          value="Yes"
                          checked={formData.ownEquipment === "Yes"}
                          onChange={handleChange}
                          className="mr-2"
                        />{" "}
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="ownEquipment"
                          value="No"
                          checked={formData.ownEquipment === "No"}
                          onChange={handleChange}
                          className="mr-2"
                        />{" "}
                        No
                      </label>
                    </div>
                  </div>
                  {formData.ownEquipment === "Yes" && (
                    <>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">
                          Available Equipment
                        </h5>
                        {[
                          "GPS Receiver",
                          "Total Station",
                          "Drone/UAV",
                          "3D Scanner",
                          "Survey Grade Tablet",
                          "Laser Distance Meter",
                          "Other",
                        ].map((equipment) => (
                          <Checkbox
                            key={equipment}
                            name="availableEquipment"
                            value={equipment}
                            label={equipment}
                            checked={formData.availableEquipment.includes(
                              equipment
                            )}
                            onChange={(e) =>
                              handleArrayChange(e, "availableEquipment")
                            }
                          />
                        ))}
                      </div>
                      <Input
                        name="equipmentName"
                        label="Primary Equipment Name/Model"
                        value={formData.equipmentName}
                        onChange={handleChange}
                      />
                      <Input
                        name="equipmentBrand"
                        label="Brand/Manufacturer"
                        value={formData.equipmentBrand}
                        onChange={handleChange}
                      />
                      <Input
                        name="equipmentYear"
                        label="Year of Purchase"
                        type="number"
                        min="2000"
                        max={new Date().getFullYear()}
                        value={formData.equipmentYear}
                        onChange={handleChange}
                      />
                      <Textarea
                        name="equipmentSpecs"
                        label="Equipment Specifications"
                        value={formData.equipmentSpecs}
                        onChange={handleChange}
                        className="md:col-span-2"
                      />
                      <Select
                        name="maintenanceSchedule"
                        label="Maintenance Schedule"
                        value={formData.maintenanceSchedule}
                        onChange={handleChange}
                        options={[
                          "Monthly",
                          "Quarterly",
                          "Bi-annually",
                          "Annually",
                          "As needed",
                        ]}
                        className="md:col-span-2"
                      />
                      <div className="md:col-span-2">
                        <h5 className="font-medium text-gray-800 mb-2">
                          Drone Certification
                        </h5>
                        <div className="flex gap-4 mb-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="droneCertification"
                              value="Yes"
                              checked={formData.droneCertification === "Yes"}
                              onChange={handleChange}
                              className="mr-2"
                            />{" "}
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="droneCertification"
                              value="No"
                              checked={formData.droneCertification === "No"}
                              onChange={handleChange}
                              className="mr-2"
                            />{" "}
                            No
                          </label>
                        </div>
                        {formData.droneCertification === "Yes" && (
                          <FileUpload
                            name="certificationFile"
                            label="Upload Certification"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleChange}
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabContent>
          )}

          {activeTab === 7 && (
            <TabContent
              title="Availability & Preferences"
              tabNumber={7}
              isSaved={savedTabs.includes(7)}
            >
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  Work Availability & Preferences
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    ref={(el) => (tabRefs.current[6] = el)}
                    name="workMode"
                    label="Preferred Work Mode"
                    value={formData.workMode}
                    onChange={handleChange}
                    options={["Remote", "On-site", "Hybrid"]}
                  />
                  <Select
                    name="workType"
                    label="Preferred Work Type"
                    value={formData.workType}
                    onChange={handleChange}
                    options={[
                      "Full-time",
                      "Part-time",
                      "Contract",
                      "Freelance",
                    ]}
                  />
                  <Select
                    name="availability"
                    label="Current Availability"
                    value={formData.availability}
                    onChange={handleChange}
                    options={[
                      "Immediately Available",
                      "Available in 1-2 weeks",
                      "Available in 1 month",
                      "Not currently available",
                    ]}
                  />
                  <Select
                    name="travelWillingness"
                    label="Willingness to Travel"
                    value={formData.travelWillingness}
                    onChange={handleChange}
                    options={["Yes", "No", "Limited"]}
                  />
                  <Input
                    name="workHours"
                    label="Preferred Working Hours"
                    placeholder="e.g., 9am-5pm"
                    value={formData.workHours}
                    onChange={handleChange}
                  />
                  <Input
                    name="preferredTimeZones"
                    label="Preferred Time Zone(s)"
                    placeholder="e.g., IST, EST"
                    value={formData.preferredTimeZones}
                    onChange={handleChange}
                  />
                  <div className="md:col-span-2">
                    <h5 className="font-medium text-gray-800 mb-2">
                      Preferred Service Delivery Modes
                    </h5>
                    <div className="flex flex-wrap gap-4">
                      {["Online", "On-site", "Hybrid", "Consultation"].map(
                        (mode) => (
                          <Checkbox
                            key={mode}
                            name="serviceModes"
                            value={mode}
                            label={mode}
                            checked={formData.serviceModes.includes(mode)}
                            onChange={(e) =>
                              handleArrayChange(e, "serviceModes")
                            }
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabContent>
          )}

          {activeTab === 8 && (
            <TabContent
              title="Terms & Conditions"
              tabNumber={8}
              isSaved={savedTabs.includes(8)}
            >
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  Terms & Conditions
                </h4>
                <div className="border p-4 rounded-lg mb-4 bg-gray-50 shadow-sm max-h-60 overflow-y-auto">
                  <h5 className="font-medium text-gray-800 mb-2">
                    Privacy Policy
                  </h5>
                  <p className="text-sm text-gray-600 mb-4">
                    By submitting this form, you agree to our Privacy Policy...
                  </p>
                  <h5 className="font-medium text-gray-800 mb-2">
                    Terms of Service
                  </h5>
                  <p className="text-sm text-gray-600">
                    You certify that all information provided is accurate...
                  </p>
                </div>
                <div className="mb-4">
                  <Checkbox
                    ref={(el) => (tabRefs.current[7] = el)}
                    name="acceptTerms"
                    label={
                      <span>
                        I agree to the{" "}
                        <a
                          href="/terms"
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Privacy Policy
                        </a>{" "}
                        *
                      </span>
                    }
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
                  {errors.acceptTerms && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.acceptTerms}
                    </p>
                  )}
                </div>
                <Checkbox
                  name="consentMarketing"
                  label="I agree to receive newsletters and updates"
                  checked={formData.consentMarketing}
                  onChange={handleChange}
                />
                <div className="flex justify-between items-center mt-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab(1)}
                    className="text-blue-600 hover:underline"
                  >
                    ← Review My Information
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
                  </button>
                </div>
              </div>
            </TabContent>
          )}

          {activeTab !== 8 && (
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handlePrev}
                disabled={activeTab === 1 || isSubmitting}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  activeTab === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              <div className="flex gap-4">
              <button
  type="button"
  onClick={(e) => handleSubmit(e, true)}
  disabled={isSubmitting}
  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200 disabled:bg-gray-400"
>
  {isSubmitting ? "Saving..." : `Save Tab ${activeTab} Draft`}
</button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
