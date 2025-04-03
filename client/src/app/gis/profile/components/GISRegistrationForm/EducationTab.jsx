import React from "react";
import Input from "../forms/Input";
import Textarea from "../forms/Textarea";
import TabContent from "../forms/TabContent";

const EducationTab = ({ formData, handleChange, errors, savedTabs }) => {
  return (
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
  );
};

export default EducationTab;