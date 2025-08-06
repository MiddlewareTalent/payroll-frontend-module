//PayrollRun.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PayrollRun = ({ onGeneratePayslip }) => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/employee-details/fetch/active-employees");
        console.log("allEmployees Data fetched:", response.data);
        setEmployees(response.data.reverse());
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleEmployeeSelection = (employeeId) => {
    setSelectedEmployeeId((prev) => (prev === employeeId ? null : employeeId));
  };

  const handleGeneratePayslips = async () => {
    if (!selectedEmployeeId) return;

    try {
      const response = await axios.post(`http://localhost:8081/payslip/auto/${selectedEmployeeId}`);
       setErrorMessage("");
      console.log("Payslip created:", response.data);
      navigate(`/payslip/${response.data.paySlipReference}`);
    } catch (error) {
      console.error("Error generating payslip:", selectedEmployeeId, error);
       if (error.response?.status === 409) {
      // Specific handling for payslip conflict
      setErrorMessage(error.response.data.message);
    } else if (error.response?.status === 400){
      setErrorMessage(error.response.data.message);
    } else if (error.response?. status === 404){
      setErrorMessage(error.response.data.message);
    } else if (error.response?.status === 422){
      setErrorMessage(error.response.data.message);
    } else if (error.response?.status === 500){
      setErrorMessage(error.response.data.message);
    }
     else {
      // General error handling
      setErrorMessage("Something went wrong while generating the payslip.");
    }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
            <h1 className="text-2xl font-bold text-gray-900">Payroll Run</h1>
            <p className="text-sm text-gray-600">Select an employee and generate their payslip for the current payroll period</p>
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

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {employees.length === 0 ? (
            <p className="text-center text-gray-500">No employees available.</p>
          ) : (
            <div className="space-y-6">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Select Employees</h3>

                  <div className="space-y-3">
                    {employees.map((employee) => {
                      const isSelected = selectedEmployeeId === employee.employeeId;

                      return (
                        <div
                          key={employee.employeeId}
                          onClick={() => handleEmployeeSelection(employee.employeeId)}
                          className={`flex items-center p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 ${
                            isSelected ? "bg-indigo-50 border-indigo-300" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="selectedEmployee"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            checked={isSelected}
                            onChange={() => {}}
                          />
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {employee.firstName} {employee.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Employee ID: {employee.employeeId} | Salary: £{employee.annualIncomeOfEmployee} | Taxcode: {employee.taxCode} | Region: {employee.region} | payPeriod: {employee.payPeriod}
                            </p>
                            
                          </div>
                        </div>
                      );
                    })}
                  </div>
{errorMessage && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-4">
    {errorMessage}
  </div>
)}
                  {selectedEmployeeId && (
                    <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                      <button
                        onClick={handleGeneratePayslips}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium"
                      >
                        Generate Payslip
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollRun;
