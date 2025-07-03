import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const EmployeeDashboard = ({ payslips }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [latestPaySlip, setLatestPaySlip]=useState(null);
  const [view, setView] = useState("dashboard");
  const [employee, setEmployee] = useState(null);
  const [payslip, setPayslip] = useState([]);
  const [employees, setEmployees] = useState([]);
  const paySlipRefs=useParams("paySlipRef");
  // console.log(paySlipRefs.paySlipRef)

useEffect(() => {
  if (location.pathname === "/employee-dashboard/payslips") {
    setView("payslips");
  } else if (location.pathname === "/employee-dashboard/p60") {
    setView("p60");
  } else {
    setView("dashboard");
  }
}, [location.pathname]);


   const handleLogout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login"; 
};

const navItems = [
    {name:"Payslips", path:"/employee-dashboard/payslips", icon:"document"},
    { name: "P60 Form", path: "/employee-dashboard/p60", icon: "document" },
    // { name: "Employee Details", path: "/employee-details", icon: "users" },
  ]

  const getIcon = (iconName) => {
    const icons = {
      home: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      plus: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      users: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      calculator: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
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
    }
    return icons[iconName] || icons.home
  }
 


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

 

   useEffect(() => {
    if(employee!==null){
      const fetchPayslip = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/payslip/all/payslips/${employee.employeeId}`);
        setPayslip(()=>response.data);
        setLatestPaySlip(()=>response.data[response.data.length-1])
        // console.log("latest",latestPaySlip);
        console.log("letest payslip data", response.data);
      } catch (error) {
        console.error("Error fetching payslip:", error);
        setPayslip([]);
      } 
    };
    fetchPayslip();
    } 
  }, [employee]);


  useEffect(() => {
  if(employee!==null){
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/employee-details/employee/${employee.employeeId}`);
        console.log("Data fetched:", response.data);
        setEmployees(response.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }
  }, [employee]);

  // // // Filter payslips for this employee once employee is loaded
  // const employeePayslips = employee
  //   ? payslips.filter((slip) => slip.employeeId === employee.employeeId)
  //   : [];


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
            onClick={() => navigate("/employee-dashboard")}
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
      <div className="bg-white shadow border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between py-6">
      
      {/* Left - Dashboard Title */}
      <div className="flex-shrink-0">
  <button
    onClick={() => navigate("/employee-dashboard")}
    className="text-2xl font-bold text-gray-900 hover:text-indigo-600 transition-colors duration-200"
  >
    Employee Dashboard
  </button>
</div>


      {/* Center - Navigation */}
      <nav className="flex space-x-8 flex-grow justify-center">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`${
              location.pathname === item.path
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
          >
            {getIcon(item.icon)}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Right - Logout */}
      <div className="flex-shrink-0">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Logout
        </button>
      </div>
      
    </div>
  </div>
</div>


      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {view === "dashboard" && (
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
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Gender</label>
                      <p className="mt-1 text-sm text-gray-900">{employee.gender}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Post Code</label>
                      <p className="mt-1 text-sm text-gray-900">{employee.postCode}</p>
                    </div>
                    <div>
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
                      <p className="mt-1 text-sm text-gray-900">{employee.employment?.jobTitle || "Software Engineer"}</p>
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
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-500">Working Hours</label>
                      <p className="mt-1 text-sm text-gray-900">{employee.workingHours || 0} hours/week</p>
                    </div> */}
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Annual Salary</label>
                      <p className="mt-1 text-sm text-gray-900">£{employee.annualIncomeOfEmployee || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Payslips</span>
                      {/* <span className="text-sm font-medium text-gray-900">{payslip.length}</span> */}
                      <span className="text-sm font-medium text-gray-900">{Array.isArray(payslip) ? payslip.length : 0}</span>

                    </div>
                     <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Pay Period</span>
                      <span className="text-sm font-medium text-gray-900">
                        {latestPaySlip!==null ? latestPaySlip.payPeriod : 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Earnings This Period</span>
                      <span className="text-sm font-medium text-gray-900">
                        £{latestPaySlip!==null ?latestPaySlip.grossPayTotal : 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Tax Paid</span>
                      <span className="text-sm font-medium text-gray-900">
                        £{latestPaySlip!==null ?latestPaySlip.incomeTaxTotal : 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">NI Paid</span>
                      <span className="text-sm font-medium text-gray-900">
                        £{latestPaySlip!==null ?latestPaySlip.employeeNationalInsurance : 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Information */}
              <div className="bg-white shadow rounded-lg">
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
                        {employee.niLetter || "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">YTD Tax Paid</span>
                      <span className="text-sm font-medium text-gray-900">
                        £{employees?.otherEmployeeDetailsDTO?.totalIncomeTaxPaidInCompany|| 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">YTD NI Paid</span>
                      <span className="text-sm font-medium text-gray-900">
                        £{employees?.otherEmployeeDetailsDTO?.totalEmployeeNIContributionInCompany || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
           )} 
         

          {/* Payslips Section */}
          {view==="payslips" &&(
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">My Payslips</h3>
                 {payslip.length === 0 && (
        <p className="text-center text-gray-500 py-4">Payslip not found</p>
      )}
       {payslip.length > 0 && (
                <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Month</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
              {payslip.length>0 && payslip.map((each)=>{
                return(
                <tr key={each.paySlipReference} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{each.firstName} {each.lastName}</td>
                <td className="px-4 py-2 border text-center">{each.periodEnd}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={()=>navigate(`/paySlip/${each.paySlipReference}`)}
                    className="bg-violet-500 text-white px-4 py-1 rounded hover:bg-blue-500 transition"
                  >
                    View Payslip
                  </button>
                </td>
              </tr>
              )
              })}
          </tbody>
        </table>
      </div>
       )}
              </div>
            </div>
          )}

           {/* P60 Section */}
          {view==="p60" &&(
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">P60 Forms</h3>
                <p className="text-center text-gray-500 py-4">P60 Forms not found</p>
                 {/* {payslip.length === 0 && (
        <p className="text-center text-gray-500 py-4">P60 Forms not found</p>
      )}
       {payslip.length > 0 && (
                <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Month</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
              {payslip.length>0 && payslip.map((each)=>{
                return(
                <tr key={each.paySlipReference} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{each.firstName} {each.lastName}</td>
                <td className="px-4 py-2 border text-center">{each.periodEnd}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={()=>navigate(`/paySlip/${each.paySlipReference}`)}
                    className="bg-violet-500 text-white px-4 py-1 rounded hover:bg-blue-500 transition"
                  >
                    View Payslip
                  </button>
                </td>
              </tr>
              )
              })}
          </tbody>
        </table>
      </div>
       )} */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
