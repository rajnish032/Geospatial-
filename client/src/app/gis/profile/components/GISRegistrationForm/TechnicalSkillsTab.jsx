import React from "react";
import Input from "../forms/Input";
import Checkbox from "../forms/Checkbox";
import Select from "../forms/Select";
import TabContent from "../forms/TabContent";

const TechnicalSkillsTab = ({
  formData,
  handleChange,
  handleArrayChange,
  errors,
  savedTabs,
}) => {
  return (
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
  );
};

export default TechnicalSkillsTab;