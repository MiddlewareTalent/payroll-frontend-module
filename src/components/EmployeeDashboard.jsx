import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeDashboard = ({ payslips }) => {
  const { id } = useParams();
  const navigate = useNavigate();

   const handleLogout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login"; 
};

  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const email = storedUser?.email;

        if (!email) {
          console.error("No email found in localStorage");
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/employee-details/employee/email/${email}`);
        setEmployee(response.data);
      } catch (error) {
        console.error("Failed to fetch employee:", error);
      }
    };

    fetchEmployee();
  }, []);

  // Filter payslips for this employee once employee is loaded
  const employeePayslips = employee
    ? payslips.filter((slip) => slip.employeeId === employee.employeeId)
    : [];

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Loading employee data...</h2>
        </div>
      </div>
    );
  }

  // Optional: if id param doesn't match employee id, redirect or show not found
  if (id && id !== employee.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Employee not found</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              {/* <h1 className="text-2xl font-bold text-gray-900">
                {employee.firstName} {employee.lastName}
              </h1> */}
              <p className="text-2xl font-bold text-blue-600">Employee Dashboard</p>
            </div>
            <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
  >
    Logout
  </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">First Name</label>
                      <p className="mt-1 text-sm text-gray-900">{employee.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Last Name</label>
                      <p className="mt-1 text-sm text-gray-900">{employee.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{employee.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Employee ID</label>
                      <p className="mt-1 text-sm text-gray-900">{employee.employeeId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(employee.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                    {/* <div>
  <label className="block text-sm font-medium text-gray-700">Gender</label>
  <select
    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
  >
    <option value="">Select</option>
    <option value="MALE">Male</option>
    <option value="FEMALE">Female</option>
   <option value="OTHER">Other</option>
    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
  </select>
</div> */}
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Post Code</label>
                      <p className="mt-1 text-sm text-gray-900">{employee.postCode}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500">Address</label>
                      <p className="mt-1 text-sm text-gray-900">{employee.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div className="mt-6 bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Employment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Job Title</label>
                      <p className="mt-1 text-sm text-gray-900">{employee.employment?.jobTitle || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Department</label>
                      <p className="mt-1 text-sm text-gray-900">{employee.employeeDepartment || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Start Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {employee.employmentStartedDate
                          ? new Date(employee.employmentStartedDate).toLocaleDateString()
                          : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Employment Type</label>
                      <p className="mt-1 text-sm text-gray-900">{employee.employmentType || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Working Hours</label>
                      <p className="mt-1 text-sm text-gray-900">{employee.workingHours || 0} hours/week</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Annual Salary</label>
                      <p className="mt-1 text-sm text-gray-900">£{employee.grossIncome || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              {/* <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Payslips</span>
                      <span className="text-sm font-medium text-gray-900">{employeePayslips.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">YTD Gross Pay</span>
                      <span className="text-sm font-medium text-gray-900">
                        £
                        {employeePayslips
                          .reduce((sum, slip) => sum + Number.parseFloat(slip.grossPayTotal || 0), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">YTD Tax Paid</span>
                      <span className="text-sm font-medium text-gray-900">
                        £
                        {employeePayslips
                          .reduce((sum, slip) => sum + Number.parseFloat(slip.incomeTaxTotal || 0), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">YTD NI Paid</span>
                      <span className="text-sm font-medium text-gray-900">
                        £
                        {employeePayslips
                          .reduce((sum, slip) => sum + Number.parseFloat(slip.nationalInsurance || 0), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Tax Information */}
              {/* <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Tax Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Tax Code</span>
                      <span className="text-sm font-medium text-gray-900">{employee.taxCode || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">NI Number</span>
                      <span className="text-sm font-medium text-gray-900">{employee.nationalInsuranceNumber || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">NI Category</span>
                      <span className="text-sm font-medium text-gray-900">
                        {employee.nicategoryLetter || "Not set"}
                      </span>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Payslips Section */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">My Payslips</h3>
                {employeePayslips.length === 0 ? (
                  <p className="text-sm text-gray-500">No payslips available yet.</p>
                ) : (
                  <div className="space-y-4">
                    {employeePayslips.map((payslip) => (
                      <div key={payslip.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">
                              Pay Period: {new Date(payslip.payDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">Reference: {payslip.paySlipReference}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">£{payslip.takeHomePayTotal}</p>
                            <div className="space-x-2">
                              <button
                                onClick={() => navigate(`/payslip/${payslip.id}`)}
                                className="text-sm text-indigo-600 hover:text-indigo-500"
                              >
                                View
                              </button>
                              <button
                                onClick={() => {
                                  const element = document.createElement("a");
                                  const file = new Blob([JSON.stringify(payslip, null, 2)], { type: "text/plain" });
                                  element.href = URL.createObjectURL(file);
                                  element.download = `payslip-${payslip.paySlipReference}.txt`;
                                  document.body.appendChild(element);
                                  element.click();
                                  document.body.removeChild(element);
                                }}
                                className="text-sm text-green-600 hover:text-green-500"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Gross: </span>
                            <span className="font-medium">£{payslip.grossPayTotal}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Tax: </span>
                            <span className="font-medium">£{payslip.incomeTaxTotal}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">NI: </span>
                            <span className="font-medium">£{payslip.nationalInsurance}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
