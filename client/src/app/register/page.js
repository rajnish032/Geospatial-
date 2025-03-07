"use client";
import { useState } from "react";

export default function RegistrationForm() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => (prev < 8 ? prev + 1 : prev));
  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

  return (
    <div className="h-full ml-7 mt-4">
      {/* Step Progress Indicator */}
      <div className="flex items-center mb-6 relative">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num, index) => (
          <div key={num} className="relative flex items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-white z-10 ${
                step >= num ? "bg-teal-500" : "bg-gray-300"
              }`}
            >
              {step > num ? "✅" : num}
            </div>
            {index < 7 && (
              <div
                className={`flex-1 h-1 mx-6 ${
                  step > num ? "bg-teal-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Personal & Contact Information */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Personal & Contact Information</h2>
          <input type="text" placeholder="Full Name" className="w-full p-2 mb-3 border rounded" />
          <input type="email" placeholder="Email Address" className="w-full p-2 mb-3 border rounded" />
          <input type="text" placeholder="Phone Number (Optional)" className="w-full p-2 mb-3 border rounded" />
          <input type="text" placeholder="Location (City, Country)" className="w-full p-2 mb-3 border rounded" />
          <input type="url" placeholder="LinkedIn/GitHub/Portfolio (Optional)" className="w-full p-2 mb-3 border rounded" />
          <input type="file" className="w-full p-2 mb-3 border rounded" />
        </div>
      )}

      {/* Step 2: Professional Summary */}
      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Professional Summary</h2>
          <select className="w-full p-2 mb-3 border rounded">
            <option>Photogrammetry Specialist</option>
            <option>Geospatial Analyst</option>
            <option>3D Mapping Expert</option>
          </select>
          <select className="w-full p-2 mb-3 border rounded">
            <option>0-2 Years</option>
            <option>3-5 Years</option>
            <option>6-10 Years</option>
            <option>10+ Years</option>
          </select>
          <input type="text" placeholder="Degree & Institution" className="w-full p-2 mb-3 border rounded" />
          <input type="text" placeholder="Certifications" className="w-full p-2 mb-3 border rounded" />
        </div>
      )}

      {/* Step 3: Skills & Specializations */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Skills & Specializations</h2>
          {["Aerial Photogrammetry", "Terrestrial Photogrammetry", "Close-Range Photogrammetry", "3D Model Reconstruction", "DEM/DTM/DSM Generation"].map(skill => (
            <label key={skill} className="block"><input type="checkbox" className="mr-2" /> {skill}</label>
          ))}
        </div>
      )}

      {/* Step 4: Portfolio & Work Experience */}
      {step === 4 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Portfolio & Work Experience</h2>
          <input type="file" className="w-full p-2 mb-3 border rounded" />
          {["Surveying & Mapping", "Agriculture & Precision Farming", "Construction & Infrastructure"].map(experience => (
            <label key={experience} className="block"><input type="checkbox" className="mr-2" /> {experience}</label>
          ))}
        </div>
      )}

      {/* Step 5: Work Preferences & Availability */}
      {step === 5 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Work Preferences & Availability</h2>
          <select className="w-full p-2 mb-3 border rounded">
            <option>Remote</option>
            <option>On-Site</option>
            <option>Hybrid</option>
          </select>
          <select className="w-full p-2 mb-3 border rounded">
            <option>Part-time</option>
            <option>Full-time</option>
            <option>Project-based</option>
          </select>
          <input type="number" placeholder="Expected Hourly Rate (USD)" className="w-full p-2 mb-3 border rounded" />
          <select className="w-full p-2 mb-3 border rounded">
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
      )}

      {/* Step 6: Languages & Proficiency */}
      {step === 6 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Languages & Proficiency</h2>
          {["English", "Spanish", "French", "German", "Mandarin"].map(language => (
            <label key={language} className="block"><input type="checkbox" className="mr-2" /> {language}</label>
          ))}
        </div>
      )}

      {/* Step 7: Additional Information */}
      {step === 7 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <textarea placeholder="Any other relevant information" className="w-full p-2 mb-3 border rounded"></textarea>
        </div>
      )}

      {/* Step 8: Review & Submit */}
      {step === 8 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
          <p className="mb-4">Please review all your information before submitting.</p>
          <button className="bg-green-500 text-white py-2 px-4 rounded">Submit</button>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 1 && <button onClick={prevStep} className="bg-gray-500 text-white py-2 px-4 rounded">Previous</button>}
        {step < 8 && <button onClick={nextStep} className="bg-teal-500 text-white py-2 px-4 rounded">Next</button>}
      </div>
    </div>
  );
}
