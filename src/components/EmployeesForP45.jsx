import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const EmployeesForP45 = ({ setSelectedReport, setP45SelectedEmployee }) => {
  const navigate = useNavigate()
  const company = { payPeriod: "MONTHLY" }

  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [employees, setEmployees] = useState([])
  const [activeTab, setActiveTab] = useState("personal")
  const [isOpen, setIsOpen] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [p45Employee, setP45Employee] = useState(null);
  const [rowId, setRowId] = useState(null);
  const[search,setSearch]=useState("");
  const[filteredEmployees,setFilteredEmployees]=useState([]);
  const[searchEmployeeId,setSearchEmployeeId]=useState("");
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    employeeId: "",
    address: "",
    gender: "",
    postCode: "",
    employeeDepartment: "",
    employmentStartedDate: "",
    employmentEndDate: null,
    employmentType: "FULL_TIME",
    employerId: "",
    payPeriod: company?.payPeriod || "MONTHLY",
    annualIncomeOfEmployee: "",

    bankDetailsDTO: {
      accountName: "",
      accountNumber: "",
      paymentReference: "",
      bankName: "",
      sortCode: "",
      bankAddress: "",
      bankPostCode: "",
      telephone: "",
      paymentLeadDays: 0,
      isRTIReturnsIncluded: false,
    },

    studentLoanDTO: {
      hasStudentLoan: false,
      monthlyDeductionAmountInStudentLoan: "",
      weeklyDeductionAmountInStudentLoan: "",
      yearlyDeductionAmountInStudentLoan: "",
      totalDeductionAmountInStudentLoan: "",
      studentLoanPlanType: "NONE",
    },

    postGraduateLoanDTO: {
      hasPostgraduateLoan: false,
      monthlyDeductionAmountInPostgraduateLoan: "",
      weeklyDeductionAmountInPostgraduateLoan: "",
      yearlyDeductionAmountInPostgraduateLoan: "",
      totalDeductionAmountInPostgraduateLoan: "",
      postgraduateLoanPlanType: "NONE"
    },

    taxCode: "1257L",
    nationalInsuranceNumber: "",
    niLetter: "",
    region: "",
    isEmergencyCode: false,
    studentLoan: "NONE",
    isPostgraduateLoan: false,
    autoEnrolmentEligible: true,
    isDirector: false,
    pensionScheme: "WORKPLACE_PENSION",
    employeeContribution: 5,
    employerContribution: 3,
  })

  const tabs = [
    { id: "personal", name: "Personal Details", icon: "user" },
    { id: "employment", name: "Employment", icon: "briefcase" },
    { id: "pay", name: "Pay", icon: "currency" },
    { id: "taxNI", name: "Tax & NI", icon: "document" },
    { id: "autoEnrolment", name: "Auto Enrolment", icon: "shield" },
  ]

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/employee-details/allEmployees")
      console.log("Data fetched:", response.data)
      setEmployees(response.data)
      setFilteredEmployees(response.data)
      
    } catch (error) {
      console.error("Failed to fetch employees:", error)
      alert("Failed to fetch employees. Please try again.")
    }
  }

  const searchEmployees=(v)=>
  {
const filteredData=employees.filter((each)=>(each.firstName.toLowerCase()+" "+each.lastName.toLowerCase()).includes(v.toLowerCase()));
      console.log(filteredData);
      setFilteredEmployees(filteredData);
      setSearch(v);
  }
  const searchEmployeesByEmployeeId=(v)=>
  {
const filteredData=employees.filter((each)=>each.employeeId.toLowerCase().includes(v.toLowerCase()));
      console.log(filteredData);
      setFilteredEmployees(filteredData); 
      
      setSearchEmployeeId(v);
  }

  
  const handleEdit = async (employeeId) => {
    if (!employeeId) {
      console.warn("No employee ID provided for editing.")
      return
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/employee-details/employee/${employeeId}`)
      const employee = response.data

      console.log("Fetched employee data:", employee)
      // Ensure bankDetailsDTO exists
      if (!employee.bankDetailsDTO) {
        employee.bankDetailsDTO = {
          accountName: "",
          accountNumber: "",
          paymentReference: "",
          bankName: "",
          sortCode: "",
          bankAddress: "",
          bankPostCode: "",
          telephone: "",
          paymentLeadDays: 0,
          isRTIReturnsIncluded: false,
        }
      }

      setSelectedEmployee(employee)
      setEditData(employee)
      setIsEditing(true)
      setIsViewing(false)
      setActiveTab("personal")
    } catch (error) {
      console.error("Failed to fetch employee details:", error)
      alert("Unable to fetch employee data. Please try again later.")
    }
  }

  const handleView = async (employeeId, id) => {
    setRowId(id);
    if (!employeeId) {
      console.warn("No employee ID provided for viewing.")
      return
    }
    console.log(employeeId)

    try {
      const response = await axios.get(`http://localhost:8080/api/employee-details/employee/${employeeId}`)
      const employee = response.data



      // Ensure bankDetailsDTO exists for viewing
      if (!employee.bankDetailsDTO) {
        employee.bankDetailsDTO = {
          accountName: "",
          accountNumber: "",
          paymentReference: "",
          bankName: "",
          sortCode: "",
          bankAddress: "",
          bankPostCode: "",
          telephone: "",
          paymentLeadDays: 0,
          isRTIReturnsIncluded: false,
        }
      }

      setSelectedEmployee(employee)
      setIsOpen(true);
      setP45Employee(employeeId);

    } catch (error) {
      console.error("Failed to fetch employee details:", error)
      alert("Unable to fetch employee data. Please try again later.")
    }
  }



  const handleInputChange = (field, value) => {
    if (field.startsWith("bankDetailsDTO.")) {
      const bankField = field.split(".")[1]
      setEditData((prev) => ({
        ...prev,
        bankDetailsDTO: {
          ...prev.bankDetailsDTO,
          [bankField]: value,
        },
      }))
    } else {
      setEditData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const endDateChange = (v) => {
    setSelectedEmployee((prev) => ({
      ...prev,
      employmentEndDate: v
    }))
  }

  const p45View = (employeeId) => {

    setSelectedReport("generatedP45");
    setP45SelectedEmployee(employeeId)
    setIsOpen(false);
  }

  const handleUpdate = async (e) => {

    console.log(selectedEmployee);
    console.log("employeeId", p45Employee)

    try {
      console.log("Sending data:", editData)
      const response = await axios.put(
        `http://localhost:8080/api/employee-details/update/${rowId}`,
        selectedEmployee,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (response.status === 200) {
        alert("Employee details updated successfully!")
        setSelectedReport("generatedP45");
        setP45SelectedEmployee(p45Employee)
        setIsOpen(false);

        // Reset states and refresh data
        setIsEditing(false)
        setSelectedEmployee(null)
        setEditData({
          firstName: "",
          lastName: "",
          email: "",
          dateOfBirth: "",
          employeeId: "",
          address: "",
          gender: "",
          postCode: "",
          employeeDepartment: "",
          employmentStartedDate: "",
          employmentEndDate: null,
          employmentType: "FULL_TIME",
          employerId: "",
          payPeriod: company?.payPeriod || "MONTHLY",
          annualIncomeOfEmployee: "",
          bankDetailsDTO: {
            accountName: "",
            accountNumber: "",
            paymentReference: "",
            bankName: "",
            sortCode: "",
            bankAddress: "",
            bankPostCode: "",
            telephone: "",
            paymentLeadDays: 0,
            isRTIReturnsIncluded: false,
          },
          taxCode: "1257L",
          nationalInsuranceNumber: "",
          niLetter: "",
          studentLoan: "NONE",
          region: "",
          isEmergencyCode: false,
          isPostgraduateLoan: false,
          autoEnrolmentEligible: true,
          isDirector: false,
          pensionScheme: "WORKPLACE_PENSION",
          employeeContribution: 5,
          employerContribution: 3,
        })

        fetchEmployees() // Refresh the employee list
      } else {
        alert("Failed to update employee. Please try again.")
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error updating employee:", error)
      alert("There was an error updating the employee.")
      setIsOpen(false);
    }
  }
  return (
    <div>
      <div className=" bg-gray-50 ">
       <div className="flex flex-row gap-2">
         <h1 className="text-xl font-bold text-gray-900">Select below employees to generate P45</h1>
        <input className="border-2 rounded-md" type="text" placeholder="Enter employee name" onChange={(e)=>searchEmployees(e.target.value)} />
        <input className="border-2 rounded-md" type="text" placeholder="Enter employee id" onChange={(e)=>searchEmployeesByEmployeeId(e.target.value)} />
       </div>

        <div className="h-screen  bg-white shadow  sm:rounded-md">

          <ul className="h-screen overflow-scroll divide-y divide-gray-200 mt-2">
            {filteredEmployees.map((employee) => (
              <li key={employee.employeeId}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {employee.firstName[0]}
                            {employee.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {employee.firstName} {employee.lastName}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            {/* <svg
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg> */}
                            {employee.email}
                          </div>
                          <div className="ml-6 flex items-center text-sm text-gray-500">
                            {/* <svg
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
                                </svg> */}
                            {/* ID: {employee.employeeId} */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {
                        employee.employmentEndDate !== null ? <button
                          onClick={() => p45View(employee.employeeId)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"

                        >
                          View P45
                        </button> : <button
                          onClick={() => handleView(employee.employeeId, employee.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Generate P45
                        </button>
                      }


                    </div>
                  </div>

                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      {/* <p className="flex items-center text-sm text-gray-500">
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
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {employee.address}, {employee.postCode}
                          </p> */}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      {/* <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8"
                            />
                          </svg> */}
                      {/* <span>{employee.employeeDepartment || "No department"}</span> */}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>


        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-xs bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-96 h-50 p-6 relative flex flex-col justify-between">


              <p >Enter Leave Date to Generate P45 for <span className="font-bold text-2">{selectedEmployee.firstName} {selectedEmployee.lastName}</span> <span className="font-bold text-md"> ({selectedEmployee.employeeId})</span></p>
              
                
                <input className="border rounded-md border-black-600 w-40" type="date" onChange={(e) => endDateChange(e.target.value)} />
              

              <div className="flex flex-row w-55 justify-between">
                 <button
                onClick={() => setIsOpen(false)}
                className="px-8 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Close
              </button>

                <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Generate
              </button>

             
                </div>
                
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeesForP45;
