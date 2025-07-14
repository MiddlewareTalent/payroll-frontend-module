import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";


const Reports = ({ payslips = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedReport, setSelectedReport] = useState("summary")
  const [employee, setEmployee] = useState(null);
  // const [latestPaySlip, setLatestPaySlip]=useState(null);
  // const [paySlip,setPayslip] = useState([]);
  const [payeData, setPayeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employers,  setAllEmployers] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);


  const reports = [
    { id: "summary", name: "Payroll Summary", icon: "chart" },
    { id: "p60", name: "P60 Forms", icon: "document" },
    { id: "p45", name: "P45 Forms", icon: "document" },
    { id: "rtiFps", name: "RTI FPS", icon: "upload" },
    // { id: "rtiEps", name: "RTI EPS", icon: "upload" },
    { id: "yearEnd", name: "Year End Report", icon: "calendar" },
    // {id:"hmrclogin", name:"HMRC Login", icon: "upload" }
  ]

  const handleGenerateP60 = (employeeId) => {
    navigate(`/P60Form/${employeeId}`); // this opens DummyP60Form.jsx via routing
  };

  useEffect(() => {
    if (location.state?.from === "p60") {
      setSelectedReport("p60");
    }
  }, [location.state]);


  //  useEffect(() => {
  //   if(employee!==null){
  //     const fetchPayslip = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:8080/payslip/all/payslips/${employee.employeeId}`);
  //       setPayslip(()=>response.data);
  //       setLatestPaySlip(()=>response.data[response.data.length-1])
  //       console.log("latest",latestPaySlip);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error("Error fetching payslip:", error);
  //       setPayslip(null);
  //     } 
  //   };
  //   fetchPayslip();
  //   } 
  // }, [employee]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/employer/allEmployers')
      .then(response => {
        if (response.data && response.data.length > 0) {
          const otherDetails = response.data[0].otherEmployerDetailsDto;
          setPayeData({
            PayPeriodPAYE: otherDetails.totalPAYEYTD,
            EmployeesNIPP: otherDetails.totalEmployeesNIYTD,
            EmployersNIPP: otherDetails.totalEmployersNIYTD
          });
        }
        console.log("allEmployers api",response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching PAYE data:', error);
        setLoading(false);
      });
  }, []);

   useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/employer/allEmployers");
        console.log("employers Data fetched:", response.data); 
        setAllEmployers(response.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

   useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/custom-dto/all/employees-summary");
        console.log("employees payslips count:", response.data); 
        setAllEmployees(response.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  if (token) {
    Cookies.set("hmrc_token", token, { expires: 1 }); // Set for 1 day
    // Clean up URL
    window.history.replaceState({}, document.title, "/reports");
  }
}, [location]);


  const getIcon = (iconName) => {
    const icons = {
      chart: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      document: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      upload: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      calendar: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-1 1m7-1l1 1m-1-1v6a2 2 0 01-2 2H10a2 2 0 01-2-2V8m6 0V7" />
        </svg>
      ),
    }
    return icons[iconName] || icons.document
  }

  const calculateTotals = () => {
    const totals = payslips.reduce(
      (acc, slip) => {
        acc.grossPay += Number.parseFloat(slip.grossPayTotal || 0)
        acc.incomeTax += Number.parseFloat(slip.incomeTaxTotal || 0)
        acc.nationalInsurance += Number.parseFloat(slip.nationalInsurance || 0)
        acc.employersNI += Number.parseFloat(slip.employersNationalInsurance || 0)
        acc.netPay += Number.parseFloat(slip.takeHomePayTotal || 0)
        return acc
      },
      {
        grossPay: 0,
        incomeTax: 0,
        nationalInsurance: 0,
        employersNI: 0,
        netPay: 0,
      },
    )

    return totals
  }


    const renderSummaryReport = () => {
    const totals = calculateTotals()

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Gross Pay</dt>
                 
                    {employers!==null && <dd className="text-lg font-medium text-gray-900"> £ {employers[0]?.otherEmployerDetailsDto?.totalPaidGrossAmountYTD.toFixed(2)}</dd>}
                    
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
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
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Income Tax</dt>
                  {payeData!==null && <dd className="text-lg font-medium text-gray-900">£{payeData.PayPeriodPAYE.toFixed(2)}</dd>}
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
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
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Employee NI</dt>
                  {payeData!==null && <dd className="text-lg font-medium text-gray-900">£{payeData.EmployeesNIPP.toFixed(2)}</dd>}
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Employer NI</dt>
                  {payeData!==null && <dd className="text-lg font-medium text-gray-900">£{payeData.EmployersNIPP.toFixed(2)}</dd>}
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Breakdown */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Employee Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payslips
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gross Pay
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tax
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NI
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Pay
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
  {allEmployees.map((employee) => (
    <tr key={employee.employeeId}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {employee.fullName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {employee.countOfPaySlips}
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
    </tr>
  ))}
</tbody>

              </table>
            </div>
          </div>
        </div>
       </div>
    )
  }

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
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm">
                Generate FPS
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
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">
                Generate EPS
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
            <p className="text-gray-600">Year end processing and reports will be available here.</p>
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
            <button
              onClick={() => navigate("/employer-dashboard")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Dashboard
            </button>
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
                  // onClick={() => setSelectedReport(report.id)}
                  onClick={() => {
  if (report.id === "hmrclogin") {
    const scope = "hello";
    window.location.href = `http://localhost:8080/oauth/login/${scope}`; // Redirect to backend OAuth
  } else {
    setSelectedReport(report.id);
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
