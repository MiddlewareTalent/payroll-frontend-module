import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PayrollRun = ({ company, onGeneratePayslip }) => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]); // <-- Local state
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState({
    payDate: new Date().toISOString().split("T")[0],
    periodEnd: new Date().toISOString().split("T")[0],
  });
  const [generatedPayslips, setGeneratedPayslips] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/employee-details/allEmployees");
        console.log("Data fetched:", response.data);
        setEmployees(response.data);  // ✅ now valid
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const calculatePayslip = (employee) => {
    const annualSalary = Number.parseFloat(employee.pay?.salary || 0);
    let grossPay = 0;

    switch (company.payPeriod) {
      case "WEEKLY":
        grossPay = annualSalary / 52;
        break;
      case "FORTNIGHTLY":
        grossPay = annualSalary / 26;
        break;
      case "MONTHLY":
        grossPay = annualSalary / 12;
        break;
      case "QUARTERLY":
        grossPay = annualSalary / 4;
        break;
      default:
        grossPay = annualSalary / 12;
    }

    const personalAllowance = 12570;
    const periods =
      company.payPeriod === "WEEKLY" ? 52 :
      company.payPeriod === "FORTNIGHTLY" ? 26 :
      company.payPeriod === "MONTHLY" ? 12 : 4;

    const personalAllowancePeriod = personalAllowance / periods;
    const taxableIncome = Math.max(0, grossPay - personalAllowancePeriod);
    const incomeTax = taxableIncome * 0.2;

    const niThreshold =
      company.payPeriod === "WEEKLY" ? 242 :
      company.payPeriod === "FORTNIGHTLY" ? 484 :
      company.payPeriod === "MONTHLY" ? 1048 : 3144;

    const nationalInsurance = Math.max(0, (grossPay - niThreshold) * 0.12);
    const employersNI = Math.max(0, (grossPay - niThreshold) * 0.138);
    const deductionsTotal = incomeTax + nationalInsurance;
    const takeHomePay = grossPay - deductionsTotal;

    return {
      firstName: employee.firstName,
      lastName: employee.lastName,
      address: employee.address,
      postCode: employee.postCode,
      employeeId: employee.employeeId,
      region: company.region,
      taxYear: company.taxYear,
      taxCode: employee.taxNI?.taxCode || "1257L",
      NI_Number: employee.taxNI?.niNumber || "",
      payPeriod: company.payPeriod,
      payDate: payrollData.payDate,
      periodEnd: payrollData.periodEnd,
      grossPayTotal: grossPay.toFixed(2),
      taxableIncome: taxableIncome.toFixed(2),
      personalAllowance: personalAllowancePeriod.toFixed(2),
      incomeTaxTotal: incomeTax.toFixed(2),
      nationalInsurance: nationalInsurance.toFixed(2),
      employersNationalInsurance: employersNI.toFixed(2),
      deductionsTotal: deductionsTotal.toFixed(2),
      takeHomePayTotal: takeHomePay.toFixed(2),
      paySlipReference: `PAY-${employee.employeeId}-${Date.now()}`,
    };
  };

  const handleEmployeeSelection = (employeeId) => {
  setSelectedEmployees([employeeId]);
};


  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map((emp) => emp.id));
    }
  };

  const handleGeneratePayslips = async () => {
    if (selectedEmployees.length === 0) return;

    const payslips = [];

    for (const employeeId of selectedEmployees) {
      const employee = employees.find((emp) => emp.id === employeeId);
      const payslipData = calculatePayslip(employee);
      const storedPayslip = await onGeneratePayslip(payslipData);
      payslips.push(storedPayslip);
    }

    setGeneratedPayslips(payslips);

    if (payslips.length > 0) {
      navigate(`/payslip/${payslips[0].paySlipReference}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payroll Run</h1>
              
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
          {employees.length === 0 ? (
            <div className="text-center">
              
              
              <div className="mt-6">
                
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Payroll Settings */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Payroll Settings</h3>
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pay Date</label>
                      <input
                        type="date"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                        value={payrollData.payDate}
                        onChange={(e) =>
                          setPayrollData((prev) => ({ ...prev, payDate: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Period End Date</label>
                      <input
                        type="date"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                        value={payrollData.periodEnd}
                        onChange={(e) =>
                          setPayrollData((prev) => ({ ...prev, periodEnd: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Selection */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Select Employees</h3>
                    <button onClick={handleSelectAll} className="text-sm text-indigo-600 hover:text-indigo-500">
                      {selectedEmployees.length === employees.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {employees.map((employee) => (
                      <div key={employee.id} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => handleEmployeeSelection(employee.id)}
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {employee.firstName} {employee.lastName}
                              </p>
                              <p className="text-sm text-gray-500">
                                ID: {employee.employeeId} | Salary: £{employee.pay?.salary || 0}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                £{calculatePayslip(employee).grossPayTotal}
                              </p>
                              <p className="text-sm text-gray-500">Gross Pay</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedEmployees.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">{selectedEmployees.length} employee(s) selected</p>
                          <p className="text-lg font-medium text-gray-900">
                            Total: £
                            {selectedEmployees
                              .reduce((total, empId) => {
                                const employee = employees.find((emp) => emp.id === empId);
                                return total + Number.parseFloat(calculatePayslip(employee).grossPayTotal);
                              }, 0)
                              .toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={handleGeneratePayslips}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium"
                        >
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
                          className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                        >
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
