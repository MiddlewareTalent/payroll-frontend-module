import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const FPS = () => {
  const navigate = useNavigate()
  const [employers, setEmployers] = useState([])
  const [allEmployees, setAllEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [submissionData, setSubmissionData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hmrcStatus, setHmrcStatus] = useState("disconnected")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employersResponse, employeesResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/employer/allEmployers"),
          axios.get("http://localhost:8080/payslip/all/employee-data"),
        ])

        setEmployers(employersResponse.data)
        setAllEmployees(employeesResponse.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
    checkHmrcConnection()
  }, [])

  const checkHmrcConnection = async () => {
    try {
      const response = await axios.get("http://localhost:8080/hmrc/status")
      setHmrcStatus(response.data.status)
    } catch (error) {
      console.error("Error checking HMRC status:", error)
      setHmrcStatus("disconnected")
    }
  }

  const generateFPSData = () => {
    if (employers.length === 0 || allEmployees.length === 0) return null

    const employer = employers[0]
    const totalGrossPay = allEmployees.reduce((sum, emp) => sum + emp.totalGrossPay, 0)
    const totalTax = allEmployees.reduce((sum, emp) => sum + emp.totalIncomeTax, 0)
    const totalEmployeeNI = allEmployees.reduce((sum, emp) => sum + emp.totalEmployeeNIC, 0)
    const totalEmployerNI = employer.otherEmployerDetailsDto?.currentPayPeriodEmployersNI || 0

    return {
      employerReference: employer.payeReference || "Not Available",
      payPeriod: new Date().toISOString().slice(0, 7),
      totalEmployees: allEmployees.length,
      totalGrossPay,
      totalTax,
      totalEmployeeNI,
      totalEmployerNI,
      employees: allEmployees,
    }
  }

  const handleSubmitFPS = async () => {
    if (hmrcStatus !== "connected") {
      alert("Please connect to HMRC first")
      return
    }

    setIsSubmitting(true)
    const fpsData = generateFPSData()

    try {
      const response = await axios.post("http://localhost:8080/hmrc/submit-fps", fpsData)
      setSubmissionData({
        ...fpsData,
        submissionId: response.data.submissionId || `FPS-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: response.data.status || "Submitted",
        hmrcResponse: response.data,
      })
    } catch (error) {
      console.error("Error submitting FPS:", error)
      alert("Failed to submit FPS to HMRC")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading FPS data...</p>
        </div>
      </div>
    )
  }

  const fpsData = generateFPSData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Full Payment Submission (FPS)</h1>
              <p className="text-sm text-gray-600">Submit payroll information to HMRC</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* HMRC Status Indicator */}
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${hmrcStatus === "connected" ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span className="text-sm text-gray-600">
                  HMRC: {hmrcStatus === "connected" ? "Connected" : "Disconnected"}
                </span>
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
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {submissionData ? (
          // Submission Success
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">FPS Submitted Successfully</h3>
                <p className="text-sm text-gray-500">Submission ID: {submissionData.submissionId}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Submitted At</dt>
                  <dd className="text-sm text-gray-900">{new Date(submissionData.submittedAt).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-green-600 font-medium">{submissionData.status}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Employees</dt>
                  <dd className="text-sm text-gray-900">{submissionData.totalEmployees}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Gross Pay</dt>
                  <dd className="text-sm text-gray-900">£{submissionData.totalGrossPay.toFixed(2)}</dd>
                </div>
              </dl>
            </div>

            {/* HMRC Response Details */}
            {submissionData.hmrcResponse && (
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">HMRC Response</h4>
                <pre className="text-xs text-blue-800 whitespace-pre-wrap">
                  {JSON.stringify(submissionData.hmrcResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          // FPS Form
          <div className="space-y-6">
            {/* HMRC Connection Warning */}
            {hmrcStatus !== "connected" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">HMRC Connection Required</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      You need to connect to HMRC before submitting FPS. Please go to Reports → HMRC Login to
                      authenticate.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">FPS Summary</h3>
              {fpsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-blue-600">Employer Reference</dt>
                    <dd className="text-lg font-semibold text-blue-900">{fpsData.employerReference}</dd>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-green-600">Total Employees</dt>
                    <dd className="text-lg font-semibold text-green-900">{fpsData.totalEmployees}</dd>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-yellow-600">Total Gross Pay</dt>
                    <dd className="text-lg font-semibold text-yellow-900">£{fpsData.totalGrossPay.toFixed(2)}</dd>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-red-600">Total Tax & NI</dt>
                    <dd className="text-lg font-semibold text-red-900">
                      £{(fpsData.totalTax + fpsData.totalEmployeeNI).toFixed(2)}
                    </dd>
                  </div>
                </div>
              )}
            </div>

            {/* Employee Details */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Payment Details</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gross Pay
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Income Tax
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee NI
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Net Pay
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allEmployees.map((employee) => (
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            £{(employee.totalGrossPay - employee.totalIncomeTax - employee.totalEmployeeNIC).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Submit FPS to HMRC</h3>
                  <p className="text-sm text-gray-600">
                    This will submit the Full Payment Submission to HMRC for the current pay period.
                  </p>
                </div>
                <button
                  onClick={handleSubmitFPS}
                  disabled={isSubmitting || !fpsData || hmrcStatus !== "connected"}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-md font-medium flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Submitting to HMRC...
                    </>
                  ) : (
                    "Submit FPS to HMRC"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FPS
