import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployerDetails = () => {
  const [isIntialUpdate, setIsIntialUpdate] = useState(false);
 
 

  const initialFormData = {
   employerDetailsDTO:{
    employerId:"",
    employerName:"",
    employerAddress:"",
    employerPostCode:"",
    employerTelephone:"",
    employerEmail:"",
   }
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

   useEffect(() => {
    console.log("employerDetailsDTO updated:", formData. employerDetailsDTO);
  }, [formData.employerDetailsDTO]);


  useEffect(() => {
    const fetchEmployerData = async () => {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/employer/allEmployers`,
          {
            headers: {
              "Content-Type": "application/json",
              
            },
            
          }
          
        );
       
        if (response.status === 200 && response.data) {
          if (response.data.length > 0) {
            setFormData(response.data[0]);
            setSuccess("Employer data loaded from backend.");
          } else {
            setIsIntialUpdate(true);
          }
        } else {
          setFormData(initialFormData);
          setError("No data found, showing default empty form.");
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setFormData(initialFormData);
          setError("");
        } else {
          setError("Error fetching employer data.");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerData();
  }, []);

const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    if (isIntialUpdate) {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/v1/employer/register/employers`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
              
            },
          }
        );

        if (response.status === 200) {
          setSuccess("Employer details updated successfully!");
          alert("Employer details updated successfully!");
        } else {
          setError("Failed to update employer details.");
          alert("Failed to update employer details.");
        }
      } catch (err) {
        console.error("Error updating employer details", err);
        setError("Error updating employer details.");
        alert("Error updating employer details.");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await axios.put(
          `http://localhost:8080/api/v1/employer/update/employers/${formData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
             
            },
          }
        );

        if (response.status === 200) {
          setSuccess("Employer details updated successfully!");
          alert("Employer details updated successfully!");
        } else {
          setError("Failed to update employer details.");
          alert("Failed to update employer details.");
        }
         navigate("/employer-dashboard");
      } catch (err) {
        console.error("Error updating employer details", err);
        setError("Error updating employer details.");
        alert("Error updating employer details.");
      } finally {
        setLoading(false);
      }
    }
  };

 const renderBasicInformation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employer Name{" "}
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employerName}
            onChange={(e) => handleInputChange("employerName", e.target.value)}
            placeholder="Enter employer name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employer ID{" "}
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employerId}
            onChange={(e) => handleInputChange("employerId", e.target.value)}
            placeholder="Enter employer ID"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employerAddress}
            onChange={(e) =>
              handleInputChange("employerAddress", e.target.value)
            }
            placeholder="Enter address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Post Code
          </label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employerPostCode}
            onChange={(e) =>
              handleInputChange("employerPostCode", e.target.value)
            }
            placeholder="Enter post code"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telephone{" "}
          </label>
          <input
            type="tel"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employerTelephone}
            onChange={(e) =>
              handleInputChange("employerTelephone", e.target.value)
            }
            placeholder="Enter telephone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email{" "}
          </label>
          <input
            type="email"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employerEmail}
            onChange={(e) => handleInputChange("employerEmail", e.target.value)}
            placeholder="Enter email address"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Employer Details
              </h1>
              </div>
            <button
              onClick={() => navigate("/employer-dashboard")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        </div>
      )} */}

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          {/* Main content */}
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-full">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                     Employer Details
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Please fill in all required information for this section.
                    </p>
                  </div>
                  {renderBasicInformation()}
                </div>

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          {loading ? "Saving..." : "Save Details"}
                        </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmployerDetails;

