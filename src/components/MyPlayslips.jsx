
import { useNavigate } from "react-router-dom"

const MyPayslips = ({ payslips, currentUser }) => {
  const navigate = useNavigate()

  // For employer, show all payslips. For employee, filter by their ID
  const userPayslips =
    currentUser?.type === "employer" ? payslips : payslips.filter((slip) => slip.employeeId === currentUser?.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Payslips</h1>
              <p className="text-sm text-gray-600">
                {currentUser?.type === "employer" ? "All company payslips" : "Your personal payslips"}
              </p>
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
          {userPayslips.length === 0 ? (
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payslips</h3>
              <p className="mt-1 text-sm text-gray-500">No payslips have been generated yet.</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {userPayslips.map((payslip) => (
                  <li key={payslip.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-indigo-600 truncate">
                                {payslip.firstName} {payslip.lastName}
                              </p>
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Paid
                              </span>
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
                                    d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 1m7-1l1 1m-1-1v6a2 2 0 01-2 2H10a2 2 0 01-2-2V8m6 0V7"
                                  />
                                </svg>
                                Pay Date: {new Date(payslip.payDate).toLocaleDateString()}
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
                                Ref: {payslip.paySlipReference}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-lg font-medium text-gray-900">£{payslip.takeHomePayTotal}</p>
                            <p className="text-sm text-gray-500">Take Home</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/payslip/${payslip.id}`)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                // Download functionality
                                const element = document.createElement("a")
                                const file = new Blob([JSON.stringify(payslip, null, 2)], { type: "text/plain" })
                                element.href = URL.createObjectURL(file)
                                element.download = `payslip-${payslip.paySlipReference}.txt`
                                document.body.appendChild(element)
                                element.click()
                                document.body.removeChild(element)
                              }}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Gross Pay</p>
                          <p className="text-sm font-medium text-gray-900">£{payslip.grossPayTotal}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Income Tax</p>
                          <p className="text-sm font-medium text-gray-900">£{payslip.incomeTaxTotal}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">National Insurance</p>
                          <p className="text-sm font-medium text-gray-900">£{payslip.nationalInsurance}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Total Deductions</p>
                          <p className="text-sm font-medium text-gray-900">£{payslip.deductionsTotal}</p>
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
    </div>
  )
}

export default MyPayslips
