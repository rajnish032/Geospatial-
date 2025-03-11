"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GISRegistrationForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "Male",
    contactNumber: "",
    email: "",
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
      [name]: type === "checkbox"
        ? checked
          ? [...prev.skills, value]
          : prev.skills.filter((s) => s !== value)
        : value,
    }));
  };

  const validateForm = () => {
    const { fullName, contactNumber, email, institution, fieldOfStudy } = formData;
    if (!fullName) return "Full Name is required.";
    if (!contactNumber.match(/^\d{10}$/)) return "Invalid contact number. Must be 10 digits.";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Invalid email format.";
    if (!institution) return "Institution is required.";
    if (!fieldOfStudy) return "Field of study is required.";
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) return alert(error);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to submit this form.");
        router.push("/account/login");
        return;
      }

      const res = await fetch("http://localhost:8000/api/gis-registration", {
        method: "POST",

        // Allow cookies and authentication headers
        credentials: "include",

        // headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        // body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // If using JWT
        },
        body: JSON.stringify(formData),

      });

      const data = await res.json();
      if (!res.ok) {
        const errors = Array.isArray(data.errors) ? data.errors.map(err => `${err.path}: ${err.msg}`).join(", ") : "Unknown error";
        return alert(`Error: ${errors}`);
      }

      alert("Registration successful! Redirecting...");
      router.push("/user/profile");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">GIS Processing Member Registration</h2>

      {step === 1 && (
        <StepSection title="Personal Information">
          <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
          <Input name="dob" type="date" value={formData.dob} onChange={handleChange} />
          <Select name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other"]} />
          <Input name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" />
          <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" />
          <Input name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
        </StepSection>
      )}

      {step === 2 && (
        <StepSection title="Professional Information">
          <Input name="education" value={formData.education} onChange={handleChange} placeholder="Highest Educational Qualification" />
          <Input name="institution" value={formData.institution} onChange={handleChange} placeholder="Institution/University" />
          <Input name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} placeholder="Field of Study" />
          <Input name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience (Years)" />
          <Input name="employer" value={formData.employer} onChange={handleChange} placeholder="Current Employer" />
          <Input name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Job Title" />
        </StepSection>
      )}

      {step === 3 && (
        <StepSection title="Technical Skills & Expertise">
          <div className="grid grid-cols-2 gap-4">
            {["QGIS", "ArcGIS", "ERDAS", "ENVI", "Global Mapper"].map(skill => (
              <Checkbox key={skill} label={skill} name="skills" value={skill} checked={formData.skills.includes(skill)} onChange={handleChange} />
            ))}
          </div>
          <Input name="otherSkills" value={formData.otherSkills} onChange={handleChange} placeholder="Other GIS Software" />
        </StepSection>
      )}

      {step === 4 && (
        <StepSection title="Work Preferences">
          <Select name="workMode" value={formData.workMode} onChange={handleChange} options={["Remote", "On-site", "Hybrid"]} />
          <Select name="workType" value={formData.workType} onChange={handleChange} options={["Part-time", "Full-time", "Freelance"]} />
          <Input name="workHours" value={formData.workHours} onChange={handleChange} placeholder="Preferred Working Hours" />
        </StepSection>
      )}

      {step === 5 && (
        <StepSection title="Additional Information">
          <Input name="linkedIn" value={formData.linkedIn} onChange={handleChange} placeholder="LinkedIn Profile" />
          <Input name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="Portfolio" />
          <Input name="certifications" value={formData.certifications.join(", ")} onChange={(e) => setFormData({ ...formData, certifications: e.target.value.split(",").map(item => item.trim()) })} placeholder="Enter certifications separated by commas" />
        </StepSection>
      )}

      <div className="flex justify-between mt-4">
        {step > 1 && <Button onClick={() => setStep(step - 1)} color="gray">Back</Button>}
        {step < totalSteps ? <Button onClick={() => setStep(step + 1)} color="blue">Next</Button> : <Button onClick={handleSubmit} color="green">Submit</Button>}
      </div>
    </div>
  );
}

// UI Components
const StepSection = ({ title, children }) => <section className="mb-6"><h3 className="text-xl font-semibold mb-2">{title}</h3><div className="grid grid-cols-2 gap-4">{children}</div></section>;
const Input = ({ name, type = "text", ...props }) => <input type={type} name={name} {...props} className="border p-2 rounded w-full" />;
const Select = ({ name, options, ...props }) => <select name={name} {...props} className="border p-2 rounded w-full">{options.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>;
const Checkbox = ({ label, ...props }) => <label className="flex items-center space-x-2"><input type="checkbox" {...props} className="w-4 h-4" /><span>{label}</span></label>;
const Button = ({ onClick, color, children }) => <button onClick={onClick} className={`px-4 py-2 rounded text-white bg-${color}-500 hover:bg-${color}-600`}>{children}</button>;


