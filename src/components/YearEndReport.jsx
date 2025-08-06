import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const YearEndReport = () => {
  const navigate = useNavigate()
  const [employers, setEmployers] = useState([])
  const [allEmployees, setAllEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTaxYear, setSelectedTaxYear] = useState("2024-25")
  const [yearEndData, setYearEndData] = useState(null)
  const [processingStatus, setProcessingStatus] = useState("pending")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employersResponse, employeesResponse] = await Promise.all([
          axios.get("http://localhost:8081/api/v1/employer/allEmployers"),
          axios.get("http://localhost:8081/api/custom-dto/all/employees-summary"),
        ])

        setEmployers(employersResponse.data)
        setAllEmployees(employeesResponse.data)
        generateYearEndData(employersResponse.data, employeesResponse.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const generateYearEndData = (employersData, employeesData) => {
    if (employersData.length === 0 || employeesData.length === 0) return

    const employer = employersData[0]
    const totalGrossPay = employeesData.reduce((sum, emp) => sum + emp.totalGrossPay, 0)
    const totalTax = employeesData.reduce((sum, emp) => sum + emp.totalIncomeTax, 0)
    const totalEmployeeNI = employeesData.reduce((sum, emp) => sum + emp.totalEmployeeNIC, 0)
    const totalEmployerNI = employer.otherEmployerDetailsDto?.currentPayPeriodEmployersNI || 0

    setYearEndData({
      taxYear: selectedTaxYear,
      totalEmployees: employeesData.length,
      totalGrossPay,
      totalTax,
      totalEmployeeNI,
      totalEmployerNI,
      p60sGenerated: 0,
      p60sPending: employeesData.length,
      employees: employeesData.map((emp) => ({
        ...emp,
        p60Status: "pending",
        yearEndChecked: false,
      })),
    })
  }

  const handleProcessYearEnd = async () => {
    setProcessingStatus("processing")

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setYearEndData((prev) => ({
        ...prev,
        p60sGenerated: prev.totalEmployees,
        p60sPending: 0,
        employees: prev.employees.map((emp) => ({
          ...emp,
          p60Status: "generated",
          yearEndChecked: true,
        })),
      }))

      setProcessingStatus("completed")
    } catch (error) {
      console.error("Error processing year end:", error)
      setProcessingStatus("error")
    }
  }

  const handleGenerateP60 = (employeeId) => {
    navigate(`/P60Form/${employeeId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading year-end data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Year End Report</h1>
              <p className="text-sm text-gray-600">Annual payroll summary and P60 generation</p>
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

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Tax Year Selection */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Year Selection</h3>
            <div className="max-w-xs">
              <label htmlFor="taxYear" className="block text-sm font-medium text-gray-700">
                Tax Year
              </label>
              <select
                id="taxYear"
                value={selectedTaxYear}
                onChange={(e) => setSelectedTaxYear(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              >
                <option value="2024-25">2025-26</option>
                <option value="2023-24">2024-25</option>
                <option value="2022-23">2023-24</option>
              </select>
            </div>
          </div>

          {/* Year End Summary */}
          {yearEndData && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Year End Summary - {yearEndData.taxYear}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-blue-600">Total Employees</dt>
                  <dd className="text-2xl font-bold text-blue-900">{yearEndData.totalEmployees}</dd>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-green-600">Total Gross Pay</dt>
                  <dd className="text-2xl font-bold text-green-900">£{yearEndData.totalGrossPay.toFixed(2)}</dd>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-red-600">Total Tax</dt>
                  <dd className="text-2xl font-bold text-red-900">£{yearEndData.totalTax.toFixed(2)}</dd>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-yellow-600">Total NI</dt>
                  <dd className="text-2xl font-bold text-yellow-900">
                    £{(yearEndData.totalEmployeeNI + yearEndData.totalEmployerNI).toFixed(2)}
                  </dd>
                </div>
              </div>
            </div>
          )}

          {/* P60 Status */}
          {yearEndData && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">P60 Generation Status</h3>
                <div className="flex space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Generated: {yearEndData.p60sGenerated}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending: {yearEndData.p60sPending}
                  </span>
                </div>
              </div>

              {processingStatus === "pending" && (
                <div className="mb-4">
                  <button
                    onClick={handleProcessYearEnd}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium"
                  >
                    Process Year End
                  </button>
                </div>
              )}

              {processingStatus === "processing" && (
                <div className="mb-4 flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-purple-600 font-medium">Processing year end...</span>
                </div>
              )}

              {processingStatus === "completed" && (
                <div className="mb-4 flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-green-600 font-medium">Year end processing completed!</span>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Annual Gross
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Annual Tax
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Annual NI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        P60 Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {yearEndData.employees.map((employee) => (
                      <tr key={employee.employeeId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          £{employee.totalGrossPay.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          £{employee.totalIncomeTax.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          £{employee.totalEmployeeNIC.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              employee.p60Status === "generated"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {employee.p60Status === "generated" ? "Generated" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleGenerateP60(employee.employeeId)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {employee.p60Status === "generated" ? "View P60" : "Generate P60"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default YearEndReport
