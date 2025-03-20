// "use client";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function GISRegistrationForm() {
//   const [step, setStep] = useState(1);
//   const totalSteps = 5;
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     dob: "",
//     gender: "Male",
//     contactNumber: "",
//     email: "",
//     nationality: "",
//     profileImage: null,
//     address: "",
//     education: "",
//     institution: "",
//     fieldOfStudy: "",
//     experience: "",
//     employer: "",
//     jobTitle: "",
//     skills: [],
//     workMode: "Remote",
//     workType: "Full-time",
//     workHours: "",
//     linkedIn: "",
//     portfolio: "",
//     certifications: [],
//     additionalInfo: "",
//   });

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await fetch("http://localhost:8000/api/user/me", {
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error("Unauthorized");
//       } catch (error) {
//         alert("You must be logged in to access this page!");
//         router.push("/account/login");
//       }
//     };
//     checkAuth();
//   }, [router]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox"
//           ? checked
//             ? [...prev.skills, value]
//             : prev.skills.filter((s) => s !== value)
//           : value,
//     }));
//   };
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData((prev) => ({
//           ...prev,
//           profileImage: reader.result, // Store Base64 image
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const validateForm = () => {
//     const { fullName, contactNumber, email, institution, fieldOfStudy } =
//       formData;
//     if (!fullName) return "Full Name is required.";
//     if (!contactNumber.match(/^\d{10}$/))
//       return "Invalid contact number. Must be 10 digits.";
//     if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
//       return "Invalid email format.";
//     if (!institution) return "Institution is required.";
//     if (!fieldOfStudy) return "Field of study is required.";
//     return null;
//   };

//   const handleSubmit = async () => {
//     const error = validateForm();
//     if (error) return alert(error);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("You must be logged in to submit this form.");
//         router.push("/account/login");
//         return;
//       }

//       const res = await fetch("http://localhost:8000/api/gis-registration", {
//         method: "POST",

        
//         credentials: "include",

//         // headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         // body: JSON.stringify(formData),
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`, // If using JWT
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         const errors = Array.isArray(data.errors)
//           ? data.errors.map((err) => `${err.path}: ${err.msg}`).join(", ")
//           : "Unknown error";
//         return alert(`Error: ${errors}`);
//       }

//       alert("Registration successful! Redirecting...");
//       router.push("/user/profile");
//     } catch (err) {
//       alert(`Error: ${err.message}`);
//     }
//   };

//   return (
    
//     <div className="min-h-full flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-screen-xl w-full space-y-8">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-600">
//           GIS Processing Member Registration
//         </h2>

//         {step === 1 && (
//           <StepSection title="Personal Information">
//             <Input
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleChange}
//               placeholder="Full Name"
//             />
//             <Input
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Email Address"
//             />
//             <Input
//               name="contactNumber"
//               value={formData.contactNumber}
//               onChange={handleChange}
//               placeholder="Contact Number"
//             />
//             <Input
//               name="dob"
//               type="date"
//               value={formData.dob}
//               onChange={handleChange}
//             />
//             <Select
//               name="gender"
//               value={formData.gender}
//               onChange={handleChange}
//               options={["Male", "Female", "Other"]}
//             />
//             <Select
//               name="nationality"
//               value={formData.nationality}
//               onChange={handleChange}
//               options={["Indian", "American", "Canadian", "Other"]}
//             />

//             <Input
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Address"
//             />
//             {/* Profile Picture Upload */}
//             <label className="block text-sm font-medium text-gray-700">
//               Upload Profile Picture
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="border p-2 rounded w-full"
//             />

//             {/* Display Image Preview */}
//             {formData.profileImage && (
//               <img
//                 src={formData.profileImage}
//                 alt="Profile Preview"
//                 className="mt-2 w-24 h-24 rounded-full border"
//               />
//             )}
//           </StepSection>
//         )}

//         {step === 2 && (
//           <StepSection title="Educational Background">
//             <Input
//               name="education"
//               value={formData.education}
//               onChange={handleChange}
//               placeholder="Highest Educational Qualification"
//             />
//             <Input
//               name="institution"
//               value={formData.institution}
//               onChange={handleChange}
//               placeholder="Institution/University"
//             />
//             <Input
//               name="fieldOfStudy"
//               value={formData.fieldOfStudy}
//               onChange={handleChange}
//               placeholder="Field of Study"
//             />
//             <Input
//               name="year of graduation"
//               value={formData.experience}
//               onChange={handleChange}
//               placeholder="Year of Graduation"
//             />
//             <Input
//               name="Certifications"
//               value={formData.employer}
//               onChange={handleChange}
//               placeholder="Certifications (if any)"
//             />
            
//           </StepSection>
//         )}

//         {step === 3 && (
//           <StepSection title="Technical Skills & Expertise">
//             <div className="grid grid-cols-2 gap-4">
//               {["QGIS", "ArcGIS", "ERDAS", "ENVI", "Global Mapper"].map(
//                 (skill) => (
//                   <Checkbox
//                     key={skill}
//                     label={skill}
//                     name="skills"
//                     value={skill}
//                     checked={formData.skills.includes(skill)}
//                     onChange={handleChange}
//                   />
//                 )
//               )}
//             </div>
//             <Input
//               name="otherSkills"
//               value={formData.otherSkills}
//               onChange={handleChange}
//               placeholder="Other GIS Software"
//             />
//           </StepSection>
//         )}

//         {step === 4 && (
//           <StepSection title="Work Preferences">
//             <Select
//               name="workMode"
//               value={formData.workMode}
//               onChange={handleChange}
//               options={["Remote", "On-site", "Hybrid"]}
//             />
//             <Select
//               name="workType"
//               value={formData.workType}
//               onChange={handleChange}
//               options={["Part-time", "Full-time", "Freelance"]}
//             />
//             <Input
//               name="workHours"
//               value={formData.workHours}
//               onChange={handleChange}
//               placeholder="Preferred Working Hours"
//             />
//           </StepSection>
//         )}

//         {step === 5 && (
//           <StepSection title="Additional Information">
//             <Input
//               name="linkedIn"
//               value={formData.linkedIn}
//               onChange={handleChange}
//               placeholder="LinkedIn Profile"
//             />
//             <Input
//               name="portfolio"
//               value={formData.portfolio}
//               onChange={handleChange}
//               placeholder="Portfolio"
//             />
//             <Input
//               name="certifications"
//               value={formData.certifications.join(", ")}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   certifications: e.target.value
//                     .split(",")
//                     .map((item) => item.trim()),
//                 })
//               }
//               placeholder="Enter certifications separated by commas"
//             />
//           </StepSection>
//         )}

//         <div className="flex justify-between gap-4 mt-4">
//           {step > 1 && (
//             <Button onClick={() => setStep(step - 1)} color="gray">
//               Back
//             </Button>
//           )}
//           {step < totalSteps ? (
//             <Button onClick={() => setStep(step + 1)} color="blue">
//               Next
//             </Button>
//           ) : (
//             <Button onClick={handleSubmit} color="green">
//               Submit
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // UI Components
// const StepSection = ({ title, children }) => (
//   <section className="mb-6">
//     <h3 className="text-xl font-semibold mb-2">{title}</h3>
//     <div className="grid grid-cols-2 gap-4">{children}</div>
//   </section>
// );
// const Input = ({ name, type = "text", ...props }) => (
//   <input
//     type={type}
//     name={name}
//     {...props}
//     className="border p-2 rounded w-full"
//   />
// );
// const Select = ({ name, options, ...props }) => (
//   <select name={name} {...props} className="border p-2 rounded w-full">
//     {options.map((opt) => (
//       <option key={opt} value={opt}>
//         {opt}
//       </option>
//     ))}
//   </select>
// );
// const Checkbox = ({ label, ...props }) => (
//   <label className="flex items-center space-x-2">
//     <input type="checkbox" {...props} className="w-4 h-4" />
//     <span>{label}</span>
//   </label>
// );
// const Button = ({ onClick, color, children }) => {
//   const colors = {
//     gray: "bg-gray-500 hover:bg-gray-600",
//     blue: "bg-blue-500 hover:bg-blue-600",
//     green: "bg-green-500 hover:bg-green-600",
//   };

//   return (
//     <button
//       onClick={onClick}
//       className={`px-4 py-2 rounded text-white ${colors[color]} border`}
//     >
//       {children}
//     </button>
//   );
// };


"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GISRegistrationForm() {
  const [activeTab, setActiveTab] = useState(1);
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "Male",
    contactNumber: "",
    email: "",
    nationality: "",
    profileImage: null,
    address: "",
    education: "",
    institution: "",
    fieldOfStudy: "",
    experience: "",
    employer: "",
    jobTitle: "",
    skills: [],
    workMode: "Remote",
    workType: "Full-time",
    workHours: "",
    linkedIn: "",
    portfolio: "",
    certifications: [],
    additionalInfo: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");
      } catch (error) {
        alert("You must be logged in to access this page!");
        router.push("/account/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? [...prev.skills, value]
            : prev.skills.filter((s) => s !== value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    alert("Form Submitted Successfully!");
  };

  return (
    <div className="min-h-full flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-blue-600">
          GIS Processing Member Registration
        </h2>

        {/* Tabs Navigation */}
        <div className="flex border-b">
          {["Personal Info", "Education", "Skills", "Work Preferences", "Additional Info"].map((tab, index) => (
            <button
              key={index}
              className={`px-4 py-2 ${activeTab === index + 1 ? "border-b-2 border-blue-500" : ""}`}
              onClick={() => setActiveTab(index + 1)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tabs Content */}
        <div className="p-4 border rounded">
          {activeTab === 1 && (
            <TabContent title="Personal Information">
              <Input name="fullName" placeholder="Full Name" onChange={handleChange} />
              <Input name="email" placeholder="Email" onChange={handleChange} />
              <Input name="contactNumber" placeholder="Contact Number" onChange={handleChange} />
              <Input name="dob" type="date" onChange={handleChange} />
              <Select name="gender" options={["Male", "Female", "Other"]} onChange={handleChange} />
              <Select name="nationality" options={["Indian", "American", "Canadian", "Other"]} onChange={handleChange} />
            </TabContent>
          )}

          {activeTab === 2 && (
            <TabContent title="Educational Background">
              <Input name="education" placeholder="Highest Qualification" onChange={handleChange} />
              <Input name="institution" placeholder="Institution" onChange={handleChange} />
              <Input name="fieldOfStudy" placeholder="Field of Study" onChange={handleChange} />
            </TabContent>
          )}

          {activeTab === 3 && (
            <TabContent title="Technical Skills & Expertise">
              {["QGIS", "ArcGIS", "ERDAS", "ENVI", "Global Mapper"].map((skill) => (
                <Checkbox key={skill} label={skill} name="skills" value={skill} onChange={handleChange} />
              ))}
            </TabContent>
          )}

          {activeTab === 4 && (
            <TabContent title="Work Preferences">
              <Select name="workMode" options={["Remote", "On-site", "Hybrid"]} onChange={handleChange} />
              <Select name="workType" options={["Part-time", "Full-time", "Freelance"]} onChange={handleChange} />
              <Input name="workHours" placeholder="Preferred Working Hours" onChange={handleChange} />
            </TabContent>
          )}

          {activeTab === 5 && (
            <TabContent title="Additional Information">
              <Input name="linkedIn" placeholder="LinkedIn Profile" onChange={handleChange} />
              <Input name="portfolio" placeholder="Portfolio" onChange={handleChange} />
            </TabContent>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

// UI Components
const TabContent = ({ title, children }) => (
  <div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <div className="grid grid-cols-2 gap-4">{children}</div>
  </div>
);

const Input = ({ name, type = "text", ...props }) => (
  <input type={type} name={name} {...props} className="border p-2 rounded w-full" />
);

const Select = ({ name, options, ...props }) => (
  <select name={name} {...props} className="border p-2 rounded w-full">
    {options.map((opt) => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
);

const Checkbox = ({ label, ...props }) => (
  <label className="flex items-center space-x-2">
    <input type="checkbox" {...props} className="w-4 h-4" />
    <span>{label}</span>
  </label>
);