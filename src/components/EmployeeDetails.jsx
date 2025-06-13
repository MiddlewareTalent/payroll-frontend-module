import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeDetails = ({ onUpdateEmployee }) => {
  const navigate = useNavigate();
  
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [employees, setEmployees] = useState([]);


  useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/employee-details/allEmployees");
      console.log("Data fetched:", response.data);
      setEmployees(response.data);  // <-- update state here
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };
  fetchEmployees();
}, []);

  const handleEdit = (employee) => {
    localStorage.setItem("selectedEmployee", JSON.stringify(employee)) 
    setSelectedEmployee(employee)
    setEditData(employee)
    setIsEditing(true)
  }

   const handleSave = () => {
    onUpdateEmployee(selectedEmployee.employeeId, editData)
    localStorage.removeItem("selectedEmployee")
    setIsEditing(false)
    setSelectedEmployee(null)
  }

  const handleCancel = () => {
    localStorage.removeItem("selectedEmployee")
    setIsEditing(false)
    setSelectedEmployee(null)
    setEditData({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Details</h1>
              <p className="text-sm text-gray-600">Manage all employee information</p>
            </div>
            <button
              onClick={() => navigate("/employer")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {selectedEmployee && !isEditing && (
  <div className="bg-white shadow rounded-md p-6 mb-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Selected Employee Details</h2>
    <p><strong>Name:</strong> {selectedEmployee.firstName} {selectedEmployee.personalDetails.lastName}</p>
    <p><strong>Email:</strong> {selectedEmployee.email}</p>
    <p><strong>Address:</strong> {selectedEmployee.address}</p>
    <p><strong>Post Code:</strong> {selectedEmployee.postCode}</p>
    <p><strong>Employee ID:</strong> {selectedEmployee.employeeId}</p>
    <p><strong>Job Title:</strong> {selectedEmployee.jobTitle || "No job title"}</p>
    <div className="mt-4">
      <button
        onClick={() => handleEdit(selectedEmployee)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Edit Again
      </button>
    </div>
  </div>
)}

          {employees.length === 0 ? (
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No employees</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new employee.</p>
              <div className="mt-6">
                
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {employees.map((employee) => (
                  <li key={employee.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {employee.firstName[0]}
                                {employee.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-indigo-600 truncate">
                                {employee.firstName} {employee.lastName}
                              </p>
                            </div>
                            <div className="mt-2 flex">
                              <div className="flex items-center text-sm text-gray-500">
                                <svg
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                {employee.email}
                              </div>
                              <div className="ml-6 flex items-center text-sm text-gray-500">
                                <svg
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                  />
                                </svg>
                                ID: {employee.employeeId}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
  setSelectedEmployee(employee);
  setIsEditing(false);
  localStorage.setItem("selectedEmployee", JSON.stringify(employee));
}}

                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            View Details
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {employee.address}, {employee.postCode}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 1m7-1l1 1m-1-1v6a2 2 0 01-2 2H10a2 2 0 01-2-2V8m6 0V7"
                            />
                          </svg>
                          {employee.jobTitle || "No job title"}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Employee Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                    value={editData.firstName || ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                    value={editData.lastName || ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                    value={editData.email || ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                    value={editData.address || ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Post Code</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                    value={editData.postCode || ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, postCode: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeDetails
