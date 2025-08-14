import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"
import { useLocation } from "react-router-dom"

const Reports = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedReport, setSelectedReport] = useState("summary")
  const [employee, setEmployee] = useState(null)
  const [payeData, setPayeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [employers, setAllEmployers] = useState([])
  const [allEmployees, setAllEmployees] = useState([])
  const [hmrcStatus, setHmrcStatus] = useState("disconnected")

  const reports = [
    { id: "summary", name: "Payroll Summary", icon: "chart" },
    { id: "p60", name: "P60 Forms", icon: "document" },
    { id: "p45", name: "P45 Forms", icon: "document" },
    { id: "rtiFps", name: "RTI FPS", icon: "upload" },
    { id: "yearEnd", name: "Year End Report", icon: "calendar" },
    { id: "hmrcIntegration", name: "HMRC Integration", icon: "upload" },
  ]

  const handleGenerateP60 = (employeeId) => {
    navigate(`/P60Form/${employeeId}`)
  }

  const handleNavigateToFPS = () => {
    navigate("/fps")
  }

  const handleNavigateToEPS = () => {
    navigate("/eps")
  }

  const handleNavigateToYearEnd = () => {
    navigate("/year-end-report")
  }

  const handleNavigateToHMRC = () => {
    navigate("/hmrc-integration")
  }

  useEffect(() => {
    if (location.state?.from === "p60") {
      setSelectedReport("p60")
    }
  }, [location.state])

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/v1/employer/allEmployers");
        console.log("employers Data fetched:", response.data); 
        setAllEmployers(response.data.reverse());
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployers();
  }, []);

    useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/custom-dto/all/employees-summary");
        console.log("employees payslips count:", response.data); 
        setAllEmployees(response.data.reverse());
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const token = queryParams.get("token")
    if (token) {
      Cookies.set("hmrc_token", token, { expires: 1 })
      window.history.replaceState({}, document.title, "/reports")
      setHmrcStatus("connected")
    }
  }, [location])

  const checkHmrcStatus = async () => {
    try {
      const response = await axios.get("http://localhost:8081/hmrc/status")
      setHmrcStatus(response.data.status)
    } catch (error) {
      console.error("Error checking HMRC status:", error)
      setHmrcStatus("disconnected")
    }
  }

  const getIcon = (iconName) => {
    const icons = {
      chart: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      document: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      upload: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      ),
      calendar: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 1m7-1l1 1m-1-1v6a2 2 0 01-2 2H10a2 2 0 01-2-2V8m6 0V7"
          />
        </svg>
      ),
    }
    return icons[iconName] || icons.document
  }
 
const renderSummaryReport = () => {
  const formatter = (value) => `£ ${value?.toFixed(2) || "0.00"}`;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <SummaryCard
          title="Gross Pay"
          value={formatter(employers?.[0]?.otherEmployerDetailsDTO?.currentPayPeriodPaidGrossPay)}
          color="bg-blue-500"
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          }
        />


        <SummaryCard
          title="Total Income Tax"
          value={formatter(employers?.[0]?.otherEmployerDetailsDTO?.currentPayPeriodPAYE)}
          color="bg-red-500"
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        />

        <SummaryCard
          title="Total Employee NI"
          value={formatter(employers?.[0]?.otherEmployerDetailsDTO?.currentPayPeriodEmployeesNI)}
          color="bg-yellow-500"
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        />

        <SummaryCard
          title="Total Employer NI"
          value={formatter(employers?.[0]?.otherEmployerDetailsDTO?.currentPayPeriodEmployersNI)}
          color="bg-green-500"
          icon={
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          }
        />
      </div> */}
      {/* HMRC Status Banner */}
        {/* <div
          className={`rounded-lg p-4 ${
            hmrcStatus === "connected" ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-3 ${hmrcStatus === "connected" ? "bg-green-500" : "bg-yellow-500"}`}
            ></div>
            <div>
              <h3
                className={`text-sm font-medium ${hmrcStatus === "connected" ? "text-green-800" : "text-yellow-800"}`}
              >
                HMRC Status: {hmrcStatus === "connected" ? "Connected" : "Not Connected"}
              </h3>
              <p className={`text-sm ${hmrcStatus === "connected" ? "text-green-700" : "text-yellow-700"}`}>
                {hmrcStatus === "connected"
                  ? "Ready to submit FPS and EPS to HMRC"
                  : "Connect to HMRC to enable automatic submissions"}
              </p>
            </div>
            {hmrcStatus !== "connected" && (
              <button
                onClick={handleNavigateToHMRC}
                className="ml-auto bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
              >
                Connect Now
              </button>
            )}
          </div>
        </div> */}

      {/* Employee Breakdown Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payslips</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NI</th>
    </tr>
  </thead>

  <tbody className="bg-white divide-y divide-gray-200">
    {allEmployees.map((employee) => (
      <tr key={employee.employeeId}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.fullName}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.countOfPaySlips}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£{employee.totalGrossPay.toFixed(2)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£{employee.totalIncomeTax.toFixed(2)}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">£{employee.totalEmployeeNIC.toFixed(2)}</td>
      </tr>
    ))}

    {/* Totals Row */}
    <tr className="bg-gray-100 font-semibold">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Total</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {allEmployees.reduce((sum, emp) => sum + (emp.countOfPaySlips || 0), 0)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        £{allEmployees.reduce((sum, emp) => sum + (emp.totalGrossPay || 0), 0).toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        £{allEmployees.reduce((sum, emp) => sum + (emp.totalIncomeTax || 0), 0).toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        £{allEmployees.reduce((sum, emp) => sum + (emp.totalEmployeeNIC || 0), 0).toFixed(2)}
      </td>
    </tr>
  </tbody>
</table>

            {allEmployees.length === 0 && (
              <div className="text-center text-sm text-gray-500 mt-4">No employee data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

 

  const renderP60Report = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">P60 Forms</h3>
        <p className="text-sm text-gray-600 mb-6">
          P60 forms show the total pay and tax deducted for each employee for the tax year.
        </p>
        {allEmployees.length === 0 ? (
          <p className="text-sm text-gray-500">No employees to generate P60 forms for.</p>
        ) : (
          <div className="space-y-4">
            {allEmployees.map((employee) => (
              <div key={employee.employeeId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{employee.fullName}</h4>
                    <p className="text-sm text-gray-500">Employee ID: {employee.employeeId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Tax Year: {employee?.taxYear}</p>
                    <button
                      onClick={() => handleGenerateP60(employee.employeeId)}
                      className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Generate P60
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Gross: </span>
                    <span className="font-medium">£{employee.totalGrossPay.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Tax: </span>
                    <span className="font-medium">£{employee.totalIncomeTax.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total NI: </span>
                    <span className="font-medium">£{employee.totalEmployeeNIC.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderRTIReport = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">RTI Submissions</h3>
        <p className="text-sm text-gray-600 mb-6">
          Real Time Information (RTI) submissions to HMRC for Full Payment Submissions (FPS) and Employer Payment
          Summaries (EPS).
        </p>

        {/* HMRC Connection Status */}
        <div
          className={`mb-6 p-4 rounded-lg ${
            hmrcStatus === "connected" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${hmrcStatus === "connected" ? "bg-green-500" : "bg-red-500"}`}
            ></div>
            <span className={`text-sm font-medium ${hmrcStatus === "connected" ? "text-green-800" : "text-red-800"}`}>
              HMRC: {hmrcStatus === "connected" ? "Connected" : "Not Connected"}
            </span>
            {hmrcStatus !== "connected" && (
              <button
                onClick={handleNavigateToHMRC}
                className="ml-auto text-sm text-red-600 hover:text-red-800 underline"
              >
                Connect to HMRC
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Full Payment Submission (FPS)</h4>
            <p className="text-sm text-gray-600 mb-4">Submit payroll information to HMRC on or before each pay day.</p>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Last Submission:</span> Not submitted
              </p>
              <p className="text-sm">
                <span className="font-medium">Next Due:</span> Next pay day
              </p>
              <button
                onClick={handleNavigateToFPS}
                disabled={hmrcStatus !== "connected"}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm"
              >
                {hmrcStatus === "connected" ? "Generate FPS" : "Connect HMRC First"}
              </button>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Employer Payment Summary (EPS)</h4>
            <p className="text-sm text-gray-600 mb-4">Submit monthly summary of payments and deductions.</p>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Last Submission:</span> Not submitted
              </p>
              <p className="text-sm">
                <span className="font-medium">Next Due:</span> 19th of next month
              </p>
              <button
                onClick={handleNavigateToEPS}
                disabled={hmrcStatus !== "connected"}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm"
              >
                {hmrcStatus === "connected" ? "Generate EPS" : "Connect HMRC First"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderReportContent = () => {
    switch (selectedReport) {
      case "summary":
        return renderSummaryReport()
      case "p60":
        return renderP60Report()
      case "p45":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">P45 Forms</h3>
            <p className="text-gray-600">P45 forms for employees leaving the company will be available here.</p>
          </div>
        )
      case "rtiFps":
      case "rtiEps":
        return renderRTIReport()
      case "yearEnd":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Year End Report</h3>
            <p className="text-gray-600 mb-4">Year end processing and reports will be available here.</p>
            <button
              onClick={handleNavigateToYearEnd}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Open Year End Report
            </button>
          </div>
        )
      case "hmrcIntegration":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">HMRC Integration</h3>
            <p className="text-gray-600 mb-4">Manage your HMRC connection and view submission history.</p>
            <button
              onClick={handleNavigateToHMRC}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Open HMRC Integration
            </button>
          </div>
        )
      default:
        return renderSummaryReport()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-sm text-gray-600">HMRC and payroll reports</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* HMRC Status Indicator */}
              {/* <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${hmrcStatus === "connected" ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span className="text-sm text-gray-600">
                  HMRC: {hmrcStatus === "connected" ? "Connected" : "Disconnected"}
                </span>
              </div> */}
              <button
                onClick={() => navigate("/employer-dashboard")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-1">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          {/* Sidebar */}
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => {
                    if (report.id === "hmrcIntegration") {
                      handleNavigateToHMRC()
                    } else {
                      setSelectedReport(report.id)
                    }
                  }}
                  className={`${
                    selectedReport === report.id
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                  } group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full text-left`}
                >
                  <span
                    className={`${
                      selectedReport === report.id ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"
                    } flex-shrink-0 -ml-1 mr-3`}
                  >
                    {getIcon(report.icon)}
                  </span>
                  <span className="truncate">{report.name}</span>
                  {/* {report.id === "hmrcIntegration" && (
                    <div
                      className={`ml-2 w-2 h-2 rounded-full ${
                        hmrcStatus === "connected" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                  )} */}
                </button>
              ))}
            </nav>
          </aside>
          {/* Main content */}
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">{renderReportContent()}</div>
        </div>
      </div>
    </div>
  )
}

export default Reports
