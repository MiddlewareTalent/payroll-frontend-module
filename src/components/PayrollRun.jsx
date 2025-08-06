//PayrollRun.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PayrollRun = ({ onGeneratePayslip }) => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [generatedPayslips, setGeneratedPayslips] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/employee-details/allEmployees");
        console.log("allEmployees Data fetched:", response.data);
        setEmployees(response.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleEmployeeSelection = (employeeId) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employeeId)
        ? prevSelected.filter((id) => id !== employeeId)
        : [...prevSelected, employeeId]
    );
  };
  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map((emp) => emp.employeeId));
    }
    console.log(selectedEmployees);
  };

  const handleGeneratePayslips = async () => {
    if (selectedEmployees.length === 0) return;

    const payslips = [];

    try {
      // const response = await axios.post(`http://localhost:8080/payslip/auto/paySlips`,selectedEmployees);
      const response = await axios.post(`http://localhost:8080/payslip/auto/paySlips`, selectedEmployees);
      console.log("Payslip created:", response.data);
      // navigate(`/payslip/${response.data[0].paySlipReference}`);
      alert("Payslips generated successfully");
      navigate("/employer-dashboard");
    } catch (error) {
      console.error("Error generating payslip:", selectedEmployeeId, error);
    }
    setGeneratedPayslips(payslips);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Payroll Run
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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {employees.length === 0 ? (
            <div className="text-center">
              <div className="mt-4">
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Employee Selection */}
              <div className="bg-white   shadow sm:rounded-lg">
                <div className=" px-6 py-0 sm:p-4">
                  <div className=" flex justify-between  items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Select Employees to generate payslips</h3>
                    <button onClick={handleSelectAll} className="text-sm text-indigo-600 hover:text-indigo-500">
                      {selectedEmployees.length === employees.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  <div className="  space-y-3  ">
                    {employees.map((employee) => {
                      const isSelected = selectedEmployees.includes(employee.employeeId);
                      return (
                        <div
                          key={employee.employeeId}
                          onClick={() => handleEmployeeSelection(employee.employeeId)}
                          className={`flex items-center p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-100 ${isSelected ? "bg-indigo-50 border-indigo-300" : ""
                            }`}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={isSelected}
                            onChange={(e) => e.stopPropagation()}
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {employee.firstName} {employee.lastName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ID: {employee.employeeId} | Salary: £{employee.annualIncomeOfEmployee}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {selectedEmployees.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">{selectedEmployees.length} employee(s) selected</p>
                        </div>
                        <button
                          onClick={handleGeneratePayslips}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium">
                          Generate Payslips
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Generated Payslips */}
              {generatedPayslips.length > 0 && (
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Generated Payslips</h3>
                    <div className="space-y-3">
                      {generatedPayslips.map((payslip) => (
                        <div
                          key={payslip.paySlipReference}
                          className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">
                              {payslip.firstName} {payslip.lastName}
                            </p>
                            <p className="text-sm text-gray-500">Reference: {payslip.paySlipReference}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">£{payslip.takeHomePayTotal}</p>
                            <button
                              onClick={() => navigate(`/payslip/${payslip.paySlipReference}`)}
                              className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                              View Payslip
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default PayrollRun;
