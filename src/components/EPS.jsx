import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const EPS = () => {
  const navigate = useNavigate()
  const [employers, setEmployers] = useState([])
  const [payeData, setPayeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submissionData, setSubmissionData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [hmrcStatus, setHmrcStatus] = useState("disconnected")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/employer/allEmployers")
        if (response.data && response.data.length > 0) {
          const otherDetails = response.data[0].otherEmployerDetailsDto
          setPayeData({
            PayPeriodPAYE: otherDetails.currentPayPeriodPAYE,
            EmployeesNIPP: otherDetails.currentPayPeriodEmployeesNI,
            EmployersNIPP: otherDetails.currentPayPeriodEmployersNI,
            GrossPay: otherDetails.currentPayPeriodPaidGrossPay,
          })
          setEmployers(response.data)
        }
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

  const generateEPSData = () => {
    if (!payeData || employers.length === 0) return null

    const employer = employers[0]
    const totalLiability = payeData.PayPeriodPAYE + payeData.EmployeesNIPP + payeData.EmployersNIPP

    return {
      employerReference: employer.payeReference || "Not Available",
      month: selectedMonth,
      totalPAYE: payeData.PayPeriodPAYE,
      totalEmployeeNI: payeData.EmployeesNIPP,
      totalEmployerNI: payeData.EmployersNIPP,
      totalLiability,
      grossPay: payeData.GrossPay,
      noPaymentReason: null,
      adjustments: 0,
    }
  }

  const handleSubmitEPS = async () => {
    if (hmrcStatus !== "connected") {
      alert("Please connect to HMRC first")
      return
    }

    setIsSubmitting(true)
    const epsData = generateEPSData()

    try {
      const response = await axios.post("http://localhost:8080/hmrc/submit-eps", epsData)
      setSubmissionData({
        ...epsData,
        submissionId: response.data.submissionId || `EPS-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: response.data.status || "Submitted",
        hmrcResponse: response.data,
      })
    } catch (error) {
      console.error("Error submitting EPS:", error)
      alert("Failed to submit EPS to HMRC")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading EPS data...</p>
        </div>
      </div>
    )
  }

  const epsData = generateEPSData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employer Payment Summary (EPS)</h1>
              <p className="text-sm text-gray-600">Monthly summary of payments and deductions</p>
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
                <h3 className="text-lg font-medium text-gray-900">EPS Submitted Successfully</h3>
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
                  <dt className="text-sm font-medium text-gray-500">Month</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(submissionData.month).toLocaleDateString("en-GB", { year: "numeric", month: "long" })}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Liability</dt>
                  <dd className="text-sm text-gray-900">£{submissionData.totalLiability.toFixed(2)}</dd>
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
          // EPS Form
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
                      You need to connect to HMRC before submitting EPS. Please go to Reports → HMRC Login to
                      authenticate.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Month Selection */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Select Month</h3>
              <div className="max-w-xs">
                <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                  Tax Month
                </label>
                <input
                  type="month"
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">EPS Summary</h3>
              {epsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-blue-600">Employer Reference</dt>
                    <dd className="text-lg font-semibold text-blue-900">{epsData.employerReference}</dd>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-red-600">Total PAYE</dt>
                    <dd className="text-lg font-semibold text-red-900">£{epsData.totalPAYE.toFixed(2)}</dd>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-yellow-600">Total NI</dt>
                    <dd className="text-lg font-semibold text-yellow-900">
                      £{(epsData.totalEmployeeNI + epsData.totalEmployerNI).toFixed(2)}
                    </dd>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <dt className="text-sm font-medium text-green-600">Total Liability</dt>
                    <dd className="text-lg font-semibold text-green-900">£{epsData.totalLiability.toFixed(2)}</dd>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Breakdown</h3>
                {epsData && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Due Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            PAYE Income Tax
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            £{epsData.totalPAYE.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">19th of following month</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Employee National Insurance
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            £{epsData.totalEmployeeNI.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">19th of following month</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Employer National Insurance
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            £{epsData.totalEmployerNI.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">19th of following month</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            Total Liability
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            £{epsData.totalLiability.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">19th of following month</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Submit EPS to HMRC</h3>
                  <p className="text-sm text-gray-600">
                    This will submit the Employer Payment Summary to HMRC for the selected month.
                  </p>
                </div>
                <button
                  onClick={handleSubmitEPS}
                  disabled={isSubmitting || !epsData || hmrcStatus !== "connected"}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-md font-medium flex items-center"
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
                    "Submit EPS to HMRC"
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

export default EPS
