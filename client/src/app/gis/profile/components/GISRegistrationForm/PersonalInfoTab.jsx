import React from "react";
import Input from "../forms/Input";
import Select from "../forms/Select";
import Textarea from "../forms/Textarea";
import TabContent from "../forms/TabContent";

const PersonalInfoTab = ({
  formData,
  handleChange,
  handleImageUpload,
  errors,
  savedTabs,
  tabRefs,
}) => {
  return (
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
  );
};

export default PersonalInfoTab;