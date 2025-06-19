import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeDashboard = ({ payslips }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [latestPaySlip, setLatestPaySlip]=useState(null);

   const handleLogout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login"; 
};

  const [employee, setEmployee] = useState(null);
  const [payslip, setPayslip] = useState([]);
  const [employees, setEmployees] = useState([]);
  const paySlipRefs=useParams("paySlipRef");
  console.log(paySlipRefs.paySlipRef)


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
        console.log("latest",latestPaySlip);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching payslip:", error);
        setPayslip(null);
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
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <p className="text-2xl font-bold">Employee Dashboard</p>
            </div>
            <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
  >
    Logout
  </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
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
                      <span className="text-sm font-medium text-gray-900">{payslip.length}</span>
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

          {/* Payslips Section */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">My Payslips</h3>
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
                return<tr className="hover:bg-gray-50">
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
              })}
          </tbody>
        </table>
      </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
