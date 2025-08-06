import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HMRCIntegration = () => {
  const [hmrcCredentials, setHmrcCredentials] = useState({
    userId: "",
    password: "",
    vendorId: "",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  const handleCredentialChange = (e) => {
    const { name, value } = e.target;
    setHmrcCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async () => {
  try {
    const response = await axios.post("http://localhost:8080/api/hmrc/submit-fps", {
      employeeId: "3" // Pass any needed data to backend
    });
    console.log("HMRC Response:", response.data);
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
};



  return (
     <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HMRC Integration</h1>
              <p className="text-sm text-gray-600">Manage your HMRC connection and submissions</p>
            </div>
            <button
              onClick={() => navigate("/reports")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Reports
            </button>
          </div>
        </div>
      </div>
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">HMRC RTI Test Submission</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sender ID (e.g. ABC913)
          </label>
          <input
            type="text"
            name="userId"
            value={hmrcCredentials.userId}
            onChange={handleCredentialChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            placeholder="Enter Sender ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            HMRC Test Password
          </label>
          <input
            type="password"
            name="password"
            value={hmrcCredentials.password}
            onChange={handleCredentialChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            placeholder="Enter password from HMRC test document"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vendor ID (9018)
          </label>
          <input
            type="text"
            name="vendorId"
            value={hmrcCredentials.vendorId}
           onChange={handleCredentialChange}
            className="mt-1 block w-full text-gray-600 border-gray-300 rounded-md shadow-sm sm:text-sm px-3 py-2 border"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
      >
        Submit FPS to HMRC (Test)
      </button>

      {statusMessage && (
        <div className="mt-4 text-sm text-blue-700 bg-blue-50 p-3 rounded-md border border-blue-200">
          {statusMessage}
        </div>
      )}
    </div>
    </div>
  );
};

export default HMRCIntegration;
