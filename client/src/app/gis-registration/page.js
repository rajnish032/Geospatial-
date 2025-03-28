"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// Memoized Form Components
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
        className={`border p-2 rounded w-full ${
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
        className={`border p-2 rounded w-full ${
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
        className="w-4 h-4"
        {...props}
      />
      <span>{label}</span>
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
        className={`border p-2 rounded w-full ${
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
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
);

const TabContent = React.memo(({ title, children, tabNumber, isSaved }) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      {isSaved && (
        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
          Saved
        </span>
      )}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
));

export default function GISRegistrationForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(1);
  const [workSamples, setWorkSamples] = useState([]);
  const [videoShowcase, setVideoShowcase] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedTabs, setSavedTabs] = useState([]);
  const [hasDraft, setHasDraft] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverMessage, setServerMessage] = useState({ type: "", message: "" });
  const [visitedTabs, setVisitedTabs] = useState(new Set([1]));

  // Initial form state
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

  // Load draft data
  useEffect(() => {
    const loadDraftData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/gis-registration/draft",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const { exists, draftData } = await response.json();
          if (exists && draftData) {
            // Parse projects if they are stringified
            const parsedProjects =
              draftData.projects && typeof draftData.projects === "string"
                ? JSON.parse(draftData.projects)
                : draftData.projects || initialFormData.projects;

            // Parse savedTabs if they are stringified
            const parsedSavedTabs =
              draftData.savedTabs && typeof draftData.savedTabs === "string"
                ? JSON.parse(draftData.savedTabs).map(Number)
                : (draftData.savedTabs || []).map(Number);

            setFormData((prev) => ({
              ...initialFormData,
              ...draftData,
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
        }
      } catch (error) {
        console.error("Error loading draft:", error);
        setServerMessage({
          type: "error",
          message: "Failed to load draft data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDraftData();
  }, []);

  // Form handlers
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
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
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value,
      };
      return {
        ...prev,
        projects: updatedProjects,
      };
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

    // Validate file type
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setServerMessage({
        type: "error",
        message: "Only JPEG or PNG images are allowed",
      });
      return;
    }

    // Validate file size
    if (file.size > 3 * 1024 * 1024) {
      setServerMessage({
        type: "error",
        message: "Profile image must be less than 3MB",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));
  }, []);

  // Save draft function
  const saveDraft = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const draftData = {
        ...formData,
        lastSavedTab: activeTab,
        savedTabs: [...new Set([...savedTabs, activeTab])].map(Number), // Ensure numbers
      };

      const formDataToSend = new FormData();

      // Handle regular fields
      Object.entries(draftData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (Array.isArray(value)) {
          // Handle arrays properly
          if (key === "projects") {
            // Stringify projects array
            formDataToSend.append(key, JSON.stringify(value));
          } else {
            // Append array items individually
            value.forEach((item) => {
              if (item !== null && item !== undefined) {
                formDataToSend.append(key, item);
              }
            });
          }
        } else if (typeof value === "object" && !(value instanceof File)) {
          // Stringify other objects
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          // Regular values
          formDataToSend.append(key, value);
        }
      });

      // Handle files
      if (formData.profileImage instanceof File) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      if (formData.workSamples && formData.workSamples.length) {
        formData.workSamples.forEach((file) => {
          if (file instanceof File) {
            formDataToSend.append("workSamples", file);
          }
        });
      }

      const response = await fetch("/api/gis-registration/draft", {
        method: "PUT",
        body: formDataToSend,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save draft");
      }

      setSavedTabs((prev) => [...new Set([...prev, activeTab])]);
      setServerMessage({
        type: "success",
        message: "Draft saved successfully!",
      });
      setHasDraft(true);
    } catch (err) {
      console.error("Draft save error:", err);
      setServerMessage({
        type: "error",
        message: err.message || "Failed to save draft",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formData,
    activeTab,
    savedTabs,
    setIsSubmitting,
    setServerMessage,
    setHasDraft,
  ]);

  // Auto-save functionality
  useEffect(() => {
    // Only auto-save if there are actual changes
    const hasChanges = Object.keys(formData).some((key) => {
      const value = formData[key];
      return value !== null && value !== undefined && value !== "";
    });

    if (activeTab > 1 && !isSubmitting && hasChanges) {
      const autoSaveTimer = setTimeout(() => {
        saveDraft();
      }, 30000); // 30 seconds debounce

      return () => clearTimeout(autoSaveTimer);
    }
  }, [formData, activeTab, isSubmitting, saveDraft]);

  // Validation
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

      // Custom validations
      if (tab === 1) {
        if (formData.email && !emailRegex.test(formData.email)) {
          newErrors.email = "Valid email is required";
        }
        if (
          formData.contactNumber &&
          !phoneRegex.test(formData.contactNumber)
        ) {
          newErrors.contactNumber = "Valid 10-digit phone number is required";
        }
        if (formData.pinCode && !pincodeRegex.test(formData.pinCode)) {
          newErrors.pinCode = "Valid 6-digit pin code is required";
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  // Form submission
  const handleSubmit = useCallback(async (e, isDraft = false) => {
    e.preventDefault();
  
    setIsSubmitting(true);
    setServerMessage({ type: '', message: '' });
  
    try {
      const formDataToSend = new FormData();
  
      // Add all non-file fields except projects, savedTabs, availableEquipment, and _id
      const nonFileFields = {
        ...formData,
        lastSavedTab: activeTab,
        isDraft
      };
      delete nonFileFields._id; // Explicitly remove _id
  
      Object.entries(nonFileFields).forEach(([key, value]) => {
        if (key !== 'projects' && key !== 'savedTabs' && key !== 'availableEquipment' && value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });
  
      // Handle projects array
      const filteredProjects = formData.projects.filter(p => p.title.trim() !== "");
      filteredProjects.forEach((project, index) => {
        formDataToSend.append(`projects[${index}][title]`, project.title);
        formDataToSend.append(`projects[${index}][description]`, project.description);
        formDataToSend.append(`projects[${index}][technologies]`, project.technologies);
      });
  
      // Handle savedTabs array
      const uniqueSavedTabs = [...new Set([...savedTabs, activeTab])].map(Number);
      uniqueSavedTabs.forEach((tab, index) => {
        formDataToSend.append(`savedTabs[${index}]`, tab);
      });
  
      // Handle availableEquipment array explicitly
      formData.availableEquipment.forEach((equipment, index) => {
        if (equipment && equipment.trim() !== '') {
          formDataToSend.append(`availableEquipment[${index}]`, equipment.trim());
        }
      });
  
      // Add files
      if (formData.profileImage instanceof File) {
        formDataToSend.append('profileImage', formData.profileImage);
      }
      workSamples.forEach(file => {
        formDataToSend.append('workSamples', file);
      });
      if (formData.certificationFile instanceof File) {
        formDataToSend.append('certificationFile', formData.certificationFile);
      }
  
      // Debugging: Log FormData contents
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value instanceof File ? value.name : value);
      }
  
      const endpoint = isDraft 
        ? 'http://localhost:8000/api/gis-registration/draft' 
        : 'http://localhost:8000/api/gis-registration/submit';
  
      const response = await fetch(endpoint, {
        method: isDraft ? 'PUT' : 'POST',
        body: formDataToSend,
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      
      if (isDraft) {
        setSavedTabs(prev => [...new Set([...prev, activeTab])]);
        setServerMessage({ type: 'success', message: "Draft saved successfully!" });
      } else {
        setServerMessage({ type: 'success', message: "Registration successful! Redirecting..." });
        setTimeout(() => router.push("/user/profile"), 1500);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setServerMessage({ 
        type: 'error', 
        message: err.message.includes('Unexpected field') 
          ? 'File upload configuration error. Please contact support.'
          : err.message || 'Submission failed'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, activeTab, savedTabs, workSamples, router]);

  // Delete draft
  const handleStartNewForm = useCallback(async () => {
    if (
      confirm(
        "Are you sure you want to start a new form? Your draft will be deleted."
      )
    ) {
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
    }
  }, []);

  const handleTabChange = useCallback((tabNumber) => {
    setVisitedTabs((prev) => new Set([...prev, tabNumber]));
    setActiveTab(tabNumber);
  }, []);

  const handleContinueDraft = useCallback(() => {
    setHasDraft(false);
  }, []);

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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (hasDraft) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Continue Your Registration
          </h2>
          {serverMessage.message && (
            <div
              className={`mb-4 p-3 rounded ${
                serverMessage.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {serverMessage.message}
            </div>
          )}
          <p className="mb-6 text-gray-600">
            We found an incomplete registration draft. Would you like to
            continue where you left off?
          </p>
          <div className="space-y-4">
            <button
              onClick={handleContinueDraft}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Continue Draft
            </button>
            <button
              onClick={handleStartNewForm}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
            >
              Start New Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-blue-600">
          GIS Processing Member Registration
        </h2>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(activeTab / 8) * 100}%` }}
          />
        </div>

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto border-b">
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
              className={`px-4 py-2 whitespace-nowrap ${
                activeTab === index + 1
                  ? "border-b-2 border-blue-500 font-medium"
                  : "text-gray-500"
              } ${visitedTabs.has(index + 1) ? "text-blue-600" : ""}`}
              onClick={() => handleTabChange(index + 1)}
            >
              {tab} {savedTabs.includes(index + 1) && "✓"}
            </button>
          ))}
        </div>

        {serverMessage.message && (
          <div
            className={`p-4 rounded ${
              serverMessage.type === "error"
                ? "bg-red-100 border-l-4 border-red-500 text-red-700"
                : "bg-green-100 border-l-4 border-green-500 text-green-700"
            }`}
          >
            <p>{serverMessage.message}</p>
          </div>
        )}

        <form
          onSubmit={(e) => handleSubmit(e, false)}
          className="p-4 border rounded"
        >
          {/* Tab 1: Personal Info */}
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
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="border p-2 rounded w-full"
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
                      className="w-24 h-24 rounded-full border object-cover"
                    />
                    <button
                      type="button"
                      className="ml-4 text-red-500 text-sm"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, profileImage: null }))
                      }
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
                <h4 className="text-lg font-medium mb-2">
                  Address Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Tab 2: Education */}
          {activeTab === 2 && (
            <TabContent
              title="Educational Background"
              tabNumber={2}
              isSaved={savedTabs.includes(2)}
            >
              <Input
                name="institution"
                label="University/Institute Name"
                value={formData.institution}
                onChange={handleChange}
                required
                error={errors.institution}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="md:col-span-2">
                <Textarea
                  name="certifications"
                  label="Certifications (comma separated)"
                  placeholder="GIS Professional Certification, Drone Pilot License, etc."
                  value={formData.certifications}
                  onChange={handleChange}
                />
              </div>
            </TabContent>
          )}

          {/* Tab 3: Technical Skills */}
          {activeTab === 3 && (
            <TabContent
              title="Technical Skills & Expertise"
              tabNumber={3}
              isSaved={savedTabs.includes(3)}
            >
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* GIS Software */}
                <div>
                  <h4 className="font-medium mb-2">GIS Software</h4>
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

                {/* Programming Skills */}
                <div>
                  <h4 className="font-medium mb-2">Programming Skills</h4>
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

                {/* Core Expertise */}
                <div>
                  <h4 className="font-medium mb-2">Core Expertise</h4>
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

                {/* Specialized Skills */}
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Drone Data Processing</h4>
                    <Select
                      name="droneDataProcessing"
                      label="Skill Level"
                      value={formData.droneDataProcessing}
                      onChange={handleChange}
                      options={["None", "Beginner", "Intermediate", "Advanced"]}
                    />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">
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

                  <div>
                    <h4 className="font-medium mb-2">LiDAR Processing</h4>
                    <Select
                      name="lidarProcessing"
                      label="Skill Level"
                      value={formData.lidarProcessing}
                      onChange={handleChange}
                      options={["None", "Beginner", "Intermediate", "Advanced"]}
                    />
                  </div>
                </div>
              </div>
            </TabContent>
          )}

          {/* Tab 4: Professional Info */}
          {activeTab === 4 && (
            <TabContent
              title="Professional Information"
              tabNumber={4}
              isSaved={savedTabs.includes(4)}
            >
              <Input
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
                placeholder="Brief summary of your key skills and expertise"
                value={formData.skills}
                onChange={handleChange}
              />
            </TabContent>
          )}

          {/* Tab 5: Projects */}
          {activeTab === 5 && (
            <TabContent
              title="Projects & Work Samples"
              tabNumber={5}
              isSaved={savedTabs.includes(5)}
            >
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium mb-2">Project Portfolio</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Please provide details of at least 3 projects you've worked on
                </p>

                {formData.projects.map((project, index) => (
                  <div
                    key={`project-${index}`}
                    className="border p-4 rounded-lg mb-4 bg-gray-50"
                  >
                    <h5 className="font-medium mb-2">Project {index + 1}</h5>
                    <Input
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
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  + Add Another Project
                </button>
              </div>

              <div className="md:col-span-2 mt-6">
                <h4 className="text-lg font-medium mb-2">Work Samples</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Upload samples of your work (PDF, images, etc.)
                </p>

                <FileUpload
                  name="workSamples"
                  label="Upload Work Samples (max 5 files)"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleWorkSampleUpload}
                  multiple
                />

                {workSamples.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Selected Files:</h5>
                    <ul className="list-disc pl-5">
                      {workSamples.map((file, index) => (
                        <li key={index} className="text-sm">
                          {file.name}
                          <button
                            type="button"
                            onClick={() =>
                              setWorkSamples(
                                workSamples.filter((_, i) => i !== index)
                              )
                            }
                            className="ml-2 text-red-500"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4">
                  <Input
                    name="videoShowcase"
                    label="Video Showcase URL (YouTube, Vimeo, etc.)"
                    type="url"
                    value={videoShowcase}
                    onChange={(e) => setVideoShowcase(e.target.value)}
                  />
                </div>
              </div>
            </TabContent>
          )}

          {/* Tab 6: Equipment */}
          {activeTab === 6 && (
            <TabContent
              title="Equipment & Hardware"
              tabNumber={6}
              isSaved={savedTabs.includes(6)}
            >
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium mb-2">
                  Equipment Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">
                      Do you own any GIS/surveying equipment?
                    </h5>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="ownEquipment"
                          value="Yes"
                          checked={formData.ownEquipment === "Yes"}
                          onChange={handleChange}
                          className="mr-2"
                        />
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
                        />
                        No
                      </label>
                    </div>
                  </div>

                  {formData.ownEquipment === "Yes" && (
                    <>
                      <div>
                        <h5 className="font-medium mb-2">
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

                      <div className="md:col-span-2">
                        <h5 className="font-medium mb-2">
                          Maintenance Schedule
                        </h5>
                        <Select
                          name="maintenanceSchedule"
                          value={formData.maintenanceSchedule}
                          onChange={handleChange}
                          options={[
                            "Monthly",
                            "Quarterly",
                            "Bi-annually",
                            "Annually",
                            "As needed",
                          ]}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <h5 className="font-medium mb-2">
                          Drone Certification (if applicable)
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
                            />
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
                            />
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

                      <div className="md:col-span-2">
                        <h5 className="font-medium mb-2">
                          Equipment Rental Availability
                        </h5>
                        <div className="flex gap-4 mb-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="equipmentRental"
                              value="Yes"
                              checked={formData.equipmentRental === "Yes"}
                              onChange={handleChange}
                              className="mr-2"
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="equipmentRental"
                              value="No"
                              checked={formData.equipmentRental === "No"}
                              onChange={handleChange}
                              className="mr-2"
                            />
                            No
                          </label>
                        </div>
                        {formData.equipmentRental === "Yes" && (
                          <Textarea
                            name="rentalTerms"
                            label="Rental Terms & Conditions"
                            value={formData.rentalTerms}
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

          {/* Tab 7: Availability */}
          {activeTab === 7 && (
            <TabContent
              title="Availability & Preferences"
              tabNumber={7}
              isSaved={savedTabs.includes(7)}
            >
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium mb-2">
                  Work Availability & Preferences
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
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
                    placeholder="e.g., 9am-5pm, Flexible"
                    value={formData.workHours}
                    onChange={handleChange}
                  />

                  <Input
                    name="preferredTimeZones"
                    label="Preferred Time Zone(s)"
                    placeholder="e.g., IST, EST, GMT"
                    value={formData.preferredTimeZones}
                    onChange={handleChange}
                  />

                  <div className="md:col-span-2">
                    <h5 className="font-medium mb-2">
                      Preferred Service Delivery Modes
                    </h5>
                    <div className="flex flex-wrap gap-4">
                      {["Online", "On-site", "Hybrid", "Consultation"].map(
                        (mode) => (
                          <label key={mode} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name="serviceModes"
                              value={mode}
                              checked={formData.serviceModes.includes(mode)}
                              onChange={(e) =>
                                handleArrayChange(e, "serviceModes")
                              }
                            />
                            {mode}
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabContent>
          )}

          {/* Tab 8: Terms */}
          {activeTab === 8 && (
            <TabContent title="Terms & Conditions">
              <div className="md:col-span-2">
                <h4 className="text-lg font-medium mb-2">Terms & Conditions</h4>

                <div className="border p-4 rounded-lg mb-4 bg-gray-50 max-h-60 overflow-y-auto">
                  <h5 className="font-medium mb-2">Privacy Policy</h5>
                  <p className="text-sm mb-4">
                    By submitting this form, you agree to our Privacy Policy. We
                    will use your information solely for the purpose of
                    processing your application and providing relevant services.
                    Your data will be protected according to our data protection
                    standards.
                  </p>

                  <h5 className="font-medium mb-2">Terms of Service</h5>
                  <p className="text-sm">
                    You certify that all information provided is accurate to the
                    best of your knowledge. Falsification of information may
                    result in termination of any agreements. You agree to be
                    contacted regarding your application and potential
                    opportunities.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="mt-1 mr-2"
                    />
                    <span>
                      I have read and agree to the{" "}
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
                      </a>
                      . *
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.acceptTerms}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="consentMarketing"
                      checked={formData.consentMarketing}
                      onChange={handleChange}
                      className="mt-1 mr-2"
                    />
                    <span>
                      I agree to receive occasional newsletters, updates, and
                      marketing communications from GIS Processing Hub.
                    </span>
                  </label>
                </div>

                <div className="flex justify-between items-center">
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
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
                  </button>
                </div>
              </div>
            </TabContent>
          )}
        </form>

        {/* Navigation Buttons */}
        {activeTab !== 8 && (
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeTab === 1 || isSubmitting}
              className={`px-4 py-2 rounded ${
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
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e, true);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400"
              >
                {isSubmitting ? "Saving..." : "Save Draft"}
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
