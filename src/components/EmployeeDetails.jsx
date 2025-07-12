import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Select from "react-select/base"

const EmployeeDetails = () => {
  const navigate = useNavigate()

  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [employees, setEmployees] = useState([])
  const [activeTab, setActiveTab] = useState("personal")
  const [p45Form, setP45Form]= useState(null);
  const [starterChecklist, setStarterChecklist]= useState(null);
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
    payPeriod:"MONTHLY",
    annualIncomeOfEmployee: "",
    p45Document: "",
    hasP45DocumentSubmitted: false,
    starterChecklistDocument: "",
    hasStarterChecklistDocumentSubmitted: false,
    taxCode: "1257L",
    nationalInsuranceNumber: "",
    niLetter: "",
    region: "",
    hasEmergencyCode: false,
    hasPensionEligible: false,


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

    studentLoanDto: {
    hasStudentLoan: false,
    monthlyDeductionAmountInStudentLoan: "",
    weeklyDeductionAmountInStudentLoan: "",
    yearlyDeductionAmountInStudentLoan: "",
    totalDeductionAmountInStudentLoan: "",
    studentLoanPlanType: "NONE",
    },

    postGraduateLoanDto: {
    hasPostgraduateLoan: false,
    monthlyDeductionAmountInPostgraduateLoan: "",
    weeklyDeductionAmountInPostgraduateLoan: "",
    yearlyDeductionAmountInPostgraduateLoan: "",
    totalDeductionAmountInPostgraduateLoan: "",
    postgraduateLoanPlanType: "NONE" 
  },
    // isDirector: false,
    // pensionScheme: "WORKPLACE_PENSION",
    // employeeContribution: 5,
    // employerContribution: 3,
  })

  const tabs = [
    { id: "personal", name: "Personal Details", icon: "user" },
    { id: "employment", name: "Employment", icon: "briefcase" },
    { id: "pay", name: "Pay", icon: "currency" },
    { id: "taxNI", name: "Tax & NI", icon: "document" },
    // { id: "autoEnrolment", name: "Auto Enrolment", icon: "shield" },
  ]

  const departmentOptions = [
  { value: 'HR', label: 'HR' },
  { value: 'IT', label: 'IT' },
  { value: 'SALES', label: 'SALES' },
  { value: 'MARKETING', label: 'MARKETING' },
  { value: 'FINANCE', label: 'FINANCE' },
  { value: 'OPERATIONS', label: 'OPERATIONS' },
  { value: 'LEGAL', label: 'LEGAL' },
  { value: 'ADMINISTRATION', label: 'ADMINISTRATION' },
  { value: 'RESEARCH_AND_DEVELOPMENT', label: 'RESEARCH AND DEVELOPMENT' },
  { value: 'CUSTOMER_SERVICE', label: 'CUSTOMER SERVICE' },
  { value: 'PROCUREMENT', label: 'PROCUREMENT' },
  { value: 'LOGISTICS', label: 'LOGISTICS' },
  { value: 'ENGINEERING', label: 'ENGINEERING' },
  { value: 'MANUFACTURING', label: 'MANUFACTURING' },
  { value: 'QUALITY_ASSURANCE', label: 'QUALITY ASSURANCE' },
  { value: 'BUSINESS_ANALYSIS', label: 'BUSINESS ANALYSIS' },
  { value: 'PROJECT_MANAGEMENT', label: 'PROJECT MANAGEMENT' },
  { value: 'DATA_ANALYSIS', label: 'DATA ANALYSIS' },
  { value: 'DEVELOPMENT', label: 'DEVELOPMENT' },
];

 const NICategoryLetters = [
    {value:'A', label:'A'},
    {value:'M', label:'M'},
    {value:'C', label:'C'},
    {value:'X', label:'X'},
    {value:'B', label:'B'},
    {value:'D', label:'D'},
    {value:'E', label:'E'},
    {value:'F', label:'F'},
    {value:'H', label:'H'},
    {value:'I', label:'I'},
    {value:'J', label:'J'},
    {value:'K', label:'K'},
    {value:'L', label:'L'},
    {value:'N', label:'N'},
    {value:'S', label:'S'},
    {value:'V', label:'V'},
    {value:'Z', label:'Z'}
  ]

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/employee-details/allEmployees")
      console.log("all employees API fetched:", response.data)
      setEmployees(response.data)
    } catch (error) {
      console.error("Failed to fetch employees:", error)
      alert("Failed to fetch employees. Please try again.")
    }
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

  const handleView = async (employeeId) => {
    if (!employeeId) {
      console.warn("No employee ID provided for viewing.")
      return
    }

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
      setEditData(employee)
      setIsViewing(true)
      setIsEditing(false)
      setActiveTab("personal")
    } catch (error) {
      console.error("Failed to fetch employee details:", error)
      alert("Unable to fetch employee data. Please try again later.")
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?")

    if (!id) {
      console.error("No employee ID provided for deletion.")
      return
    }

    if (confirmDelete) {
      try {
        console.log("Deleting employee with ID:", id)

        await axios.delete(`http://localhost:8080/api/employee-details/delete/${id}`)
        alert("Employee deleted successfully!")
        fetchEmployees() 
      } catch (error) {
        console.error("Failed to delete employee:", error)
        alert("Failed to delete employee. Please try again.")
      }
    }
  }

//   const handleInputChange = (field, value) => {
//   const keys = field.split(".");
//   if (keys.length === 2) {
//     const [parentKey, childKey] = keys;
//     setEditData((prev) => ({
//       ...prev,
//       [parentKey]: {
//         ...prev[parentKey],
//         [childKey]: value,
//       },
//     }));
//   } else {
//     setEditData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   }
// };

const handleInputChange = (fieldPath, value) => {
  setEditData((prev) => {
    const keys = fieldPath.split(".");
    if (keys.length === 1) {
      return {
        ...prev,
        [fieldPath]: value,
      };
    } else {
      const [firstKey, ...restKeys] = keys;
      return {
        ...prev,
        [firstKey]: {
          ...prev[firstKey],
          [restKeys.join(".")]: value,
        },
      };
    }
  });
};

const handleUpdate = async (e) => {
  e.preventDefault();

  if (!selectedEmployee || !selectedEmployee.id) {
    console.error("No employee selected for update");
    alert("No employee selected for update");
    return;
  }

  try {
    let updatedData = { ...editData }; // Create a temp copy

    // Step 1: Upload files if they exist
    if (p45Form || starterChecklist) {
      const formDataUpload = new FormData();

      if (p45Form) formDataUpload.append("p45Document", p45Form);
      if (starterChecklist) formDataUpload.append("starterChecklist", starterChecklist);

      try {
        const fileData = await axios.post(
          "http://localhost:8080/api/employee-details/upload-documents",
          formDataUpload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        console.log("Uploaded files:", fileData.data);

        // Update the local temp object
        updatedData = {
          ...updatedData,
          hasP45DocumentSubmitted: !!fileData.data["P45"],
          p45Document: fileData.data["P45"] || updatedData.p45Document,
          hasStarterChecklistDocumentSubmitted: !!fileData.data["Checklist"],
          starterChecklistDocument: fileData.data["Checklist"] || updatedData.starterChecklistDocument,
        };
      } catch (uploadErr) {
        console.error("Error uploading documents:", uploadErr);
        alert("File upload failed. Please try again.");
        return;
      }
    }

    console.log("Final data to update:", updatedData);

    // Step 2: Send PUT request with updatedData
    const response = await axios.put(
      `http://localhost:8080/api/employee-details/update/${selectedEmployee.id}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      alert("Employee details updated successfully!");

      // Reset states and refresh
      setIsEditing(false);
      setSelectedEmployee(null);
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
        payPeriod: "",
        annualIncomeOfEmployee: "",
        p45Document: "",
        hasP45DocumentSubmitted: false,
        starterChecklistDocument: "",
        hasStarterChecklistDocumentSubmitted: false,
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
        studentLoanDto: {
          hasStudentLoan: false,
          studentLoanPlanType: "NONE",
        },
        postGraduateLoanDto: {
          hasPostgraduateLoan: false,
          postgraduateLoanPlanType: "NONE",
        },
        taxCode: "1257L",
        nationalInsuranceNumber: "",
        niLetter: "",
        studentLoan: "NONE",
        region: "",
        hasEmergencyCode: false,
        hasPensionEligible: false,
      });

      fetchEmployees(); // Refresh employee list
    } else {
      alert("Failed to update employee. Please try again.");
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    alert("There was an error updating the employee.");
  }
};

  const handleCancel = () => {
    setIsEditing(false)
    setIsViewing(false)
    setSelectedEmployee(null)
    setActiveTab("personal")
    // Reset edit data
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
      payPeriod: "",
      annualIncomeOfEmployee: "",
      p45Document: "",
    hasP45DocumentSubmitted: false,
    starterChecklistDocument: "",
    hasStarterChecklistDocumentSubmitted: false,

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
      region: "",
      hasEmergencyCode: false,
      hasPensionEligible: false,
      studentLoanDto:{
  hasStudentLoan:false,
  studentLoanPlanType:"NONE",
  },
  postGraduateLoanDto:{
  hasPostgraduateLoan:false,
  postgraduateLoanPlanType:"NONE",
  },
      // isDirector: false,
      // pensionScheme: "WORKPLACE_PENSION",
      // employeeContribution: 5,
      // employerContribution: 3,
    })
  }

  const renderPersonalDetails = () => (
    <div className="space-y-6 space-x-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            disabled={isViewing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            disabled={isViewing}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={isViewing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            disabled={isViewing}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employee ID</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.employeeId}
            onChange={(e) => handleInputChange("employeeId", e.target.value)}
            disabled={isViewing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Post Code</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.postCode}
            onChange={(e) => handleInputChange("postCode", e.target.value)}
            disabled={isViewing}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            disabled={isViewing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            disabled={isViewing}
          >
            <option value="">Select</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
            </select>
        </div>
      </div>
    </div>
  )

  const renderEmployment = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employee Department</label>
          <Select
  options={departmentOptions}
  value={departmentOptions.find((option) => option.value === editData.employeeDepartment)}
  onChange={(selectedOption) => handleInputChange('employeeDepartment', selectedOption?.value || '')}
  
  className="mt-1 text-sm"
  styles={{
    menuList: (base) => ({
      ...base,
      maxHeight: '120px', 
    }),
  }}
  placeholder="Select department..."
  isSearchable
/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Employer ID</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.employerId}
            onChange={(e) => handleInputChange("employerId", e.target.value)}
            disabled={isViewing}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employment Start Date</label>
          <input
            type="date"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.employmentStartedDate}
            onChange={(e) => handleInputChange("employmentStartedDate", e.target.value)}
            disabled={isViewing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Employment Type</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.employmentType}
            onChange={(e) => handleInputChange("employmentType", e.target.value)}
            disabled={isViewing}
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="TEMPORARY">Temporary</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employment End Date</label>
          <input
            type="date"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.employmentEndDate || ""}
            onChange={(e) => handleInputChange("employmentEndDate", e.target.value)}
            disabled={isViewing}
          />
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700">Working Company Name</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.workingCompanyName}
            onChange={(e) => handleInputChange( "workingCompanyName", e.target.value)}
            disabled={isViewing}
          />
        </div>  
      </div>
    </div>
  )

  const renderPay = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Annual Income (£)</label>
          <input
            type="number"
            step="0.01"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.annualIncomeOfEmployee}
            onChange={(e) => handleInputChange("annualIncomeOfEmployee", e.target.value)}
            disabled={isViewing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pay Period</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.payPeriod}
            onChange={(e) => handleInputChange("payPeriod", e.target.value)}
            disabled={isViewing}
          >
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Account Name</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.bankDetailsDTO?.accountName || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                bankDetailsDTO: {
                  ...prev.bankDetailsDTO,
                  accountName: e.target.value,
                },
              }))
            }
            disabled={isViewing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Account Number</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.bankDetailsDTO?.accountNumber || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                bankDetailsDTO: {
                  ...prev.bankDetailsDTO,
                  accountNumber: e.target.value,
                },
              }))
            }
            disabled={isViewing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sort Code</label>
          <input
            type="text"
            maxLength={6}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.bankDetailsDTO?.sortCode || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                bankDetailsDTO: {
                  ...prev.bankDetailsDTO,
                  sortCode: e.target.value,
                },
              }))
            }
            disabled={isViewing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bank Name</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.bankDetailsDTO?.bankName || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                bankDetailsDTO: {
                  ...prev.bankDetailsDTO,
                  bankName: e.target.value,
                },
              }))
            }
            disabled={isViewing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bank Address</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.bankDetailsDTO?.bankAddress || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                bankDetailsDTO: {
                  ...prev.bankDetailsDTO,
                  bankAddress: e.target.value,
                },
              }))
            }
            disabled={isViewing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bank Post Code</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.bankDetailsDTO?.bankPostCode || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                bankDetailsDTO: {
                  ...prev.bankDetailsDTO,
                  bankPostCode: e.target.value,
                },
              }))
            }
            disabled={isViewing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Telephone</label>
          <input
            type="tel"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.bankDetailsDTO?.telephone || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                bankDetailsDTO: {
                  ...prev.bankDetailsDTO,
                  telephone: e.target.value,
                },
              }))
            }
            disabled={isViewing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Reference</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.bankDetailsDTO?.paymentReference || ""}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                bankDetailsDTO: {
                  ...prev.bankDetailsDTO,
                  paymentReference: e.target.value,
                },
              }))
            }
            disabled={isViewing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Lead Days</label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.bankDetailsDTO?.paymentLeadDays || 0}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                bankDetailsDTO: {
                  ...prev.bankDetailsDTO,
                  paymentLeadDays: e.target.value,
                },
              }))
            }
            disabled={isViewing}
          />
        </div>

        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            checked={editData.bankDetailsDTO?.isRTIReturnsIncluded || false}
            onChange={(e) =>
              setEditData((prev) => ({
                ...prev,
                bankDetailsDTO: {
                  ...prev.bankDetailsDTO,
                  isRTIReturnsIncluded: e.target.checked,
                },
              }))
            }
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            disabled={isViewing}
          />
          <label className="ml-2 text-sm font-medium text-gray-700">Include in RTI Returns</label>
        </div>
      </div>
    </div>
  )

  const renderTaxNI = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax Code</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.taxCode}
            onChange={(e) => handleInputChange("taxCode", e.target.value)}
            disabled={isViewing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">National Insurance Number</label>
          <input
            type="text"
            placeholder="AB123456C"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.nationalInsuranceNumber}
            onChange={(e) => handleInputChange("nationalInsuranceNumber", e.target.value)}
            disabled={isViewing}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">NI Category Letter</label>
          <Select
  options={NICategoryLetters}
  value={NICategoryLetters.find((option) => option.value === editData.niLetter)}
  onChange={(selectedOption) => handleInputChange('niLetter', selectedOption?.value || '')}
  disabled={isViewing}
  className="mt-1 text-sm"
  styles={{
    menuList: (base) => ({
      ...base,
      maxHeight: '120px', 
    }),
  }}
  placeholder="Select NI Category Letter..."
  isSearchable
/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Region</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.region}
            onChange={(e) => handleInputChange("region", e.target.value)}
            disabled={isViewing}
          >
            <option value="">Select</option>
            <option value="SCOTLAND">Scotland</option>
            <option value="ENGLAND">England</option>
            <option value="NORTHERN_IRELAND">Northern Ireland</option>
            <option value="WALES">Wales</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-row gap-20">
 <label className="flex items-center">
  <input
    type="checkbox"
    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    checked={editData.hasEmergencyCode}
    // onChange={(e) => handleInputChange("hasEmergencyCode", e.target.checked)}
    onChange={(e) => {
  console.log("hasEmergencyCode changed:", e.target.checked);
  handleInputChange("hasEmergencyCode", e.target.checked);
}}

    disabled={isViewing}
  />
  <span className="ml-2 text-sm text-gray-700 font-medium"> Emergency Tax Code</span>
</label>


<label className="flex items-center mt-6">
  <input
    type="checkbox"
    checked={editData.studentLoanDto.hasStudentLoan}
       onChange={(e) =>
        setEditData(prev => ({
          ...prev,
          studentLoanDto: {
            ...prev.studentLoanDto,
            hasStudentLoan: e.target.checked,
          },
        }))
    }
    disabled={isViewing}
    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
  />
  <span className="ml-2 text-sm font-medium text-gray-700">
    Student Loan
  </span>
</label>
</div>
         <div>
          <label className="block text-sm font-medium text-gray-700">Student Loan Plan</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.studentLoanDto.studentLoanPlanType}
            onChange={(e) => handleInputChange("studentLoanDto.studentLoanPlanType", e.target.value)}
            disabled={isViewing}
          >
            <option value="NONE">None</option>
            <option value="STUDENT_LOAN_PLAN_1">Plan 1</option>
            <option value="STUDENT_LOAN_PLAN_2">Plan 2</option>
             <option value="STUDENT_LOAN_PLAN_4">Plan 4</option>
           </select>
        </div>
      </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     <div>
  <label className="block text-sm font-medium text-gray-700">Tax Year</label>
  <select
    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
    value={editData.taxYear}
    onChange={(e) => handleInputChange("taxYear", e.target.value)}
    disabled={isViewing}
  >
    <option value="">Select</option>
    <option value="2025-2026">2025-2026</option>
    <option value="2024-2025">2024-2025</option>
    <option value="2023-2024">2023-2024</option>
  </select>
  </div>

  <label className="flex items-center mt-6">
  <input
    type="checkbox"
    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
    checked={editData.postGraduateLoanDto.hasPostgraduateLoan}
    onChange={(e) =>
      setEditData(prev => ({
          ...prev,
          postGraduateLoanDto: {
            ...prev.postGraduateLoanDto,
            hasPostgraduateLoan: e.target.checked,
          },
        }))
    }
    disabled={isViewing}
  />
  
  <span className="ml-2 text-sm font-medium text-gray-700">
    Postgraduate Loan
  </span>  
  </label>
</div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
        <label className="block text-sm font-medium text-gray-700">Postgraduate Loan Plan</label>
        <select
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
          value={editData.postGraduateLoanDto.postgraduateLoanPlanType}
          onChange={(e) => handleInputChange("postGraduateLoanDto.postgraduateLoanPlanType", e.target.value)}
          disabled={isViewing}
        >
          <option value="">Select</option>
          <option value="NONE">None</option>
          <option value="POSTGRADUATE_LOAN_PLAN_3">Postgraduate Loan plan 3</option>
        </select>  
      </div>
       <label className="flex items-center">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          checked={editData.hasPensionEligible}
          onChange={(e) =>
            handleInputChange("hasPensionEligible", e.target.checked)
          }
          disabled={isViewing}
        />
        <span className="ml-2 text-sm text-gray-700 font-medium">
          Eligible for Auto Enrolment
        </span>
</label>

      <div className="w-50 text-sm">
  <label className="text-gray-700 font-medium">Upload P45 Document</label>
  <input
    type="file"
    disabled={isViewing}
    onChange={(e) => setP45Form(e.target.files[0])}
  />
  {editData.p45Document && (
    <p className="text-gray-500 text-xs mt-1">
       Previously uploaded: <strong>{editData.p45Document.split("/").pop()}</strong>
    </p>
  )}
</div>

<div className="w-50 text-sm">
  <label className="text-gray-700 font-medium">Upload Starter Checklist</label>
  <input
    type="file"
    disabled={isViewing}
    onChange={(e) => setStarterChecklist(e.target.files[0])}
  />
  {editData.starterChecklistDocument && (
    <p className="text-gray-500 text-xs mt-1">
       Previously uploaded: <strong>{editData.starterChecklistDocument.split("/").pop()}</strong>
    </p>
  )}
</div>

      
</div>
    </div>
  )

  // const renderAutoEnrolment = () => (
  //   <div className="space-y-6">
  //     <div>
  //       <label className="flex items-center">
  //         <input
  //           type="checkbox"
  //           className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
  //           checked={editData.autoEnrolmentEligible}
  //           onChange={(e) => handleInputChange("autoEnrolmentEligible", e.target.checked)}
  //           disabled={false}
  //         />
  //         <span className="ml-2 text-sm text-gray-700">Eligible for Auto Enrolment</span>
  //       </label>
  //     </div>

  //     {editData.autoEnrolmentEligible && (
  //       <>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700">Pension Scheme</label>
  //           <select
  //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
  //             value={editData.pensionScheme}
  //             onChange={(e) => handleInputChange("pensionScheme", e.target.value)}
  //             disabled={isViewing}
  //           >
  //             <option value="">-- Select --</option>
  //             <option value="WORKPLACE_PENSION">Workplace Pension</option>
  //             <option value="NEST">NEST</option>
  //             <option value="STAKEHOLDER">Stakeholder Pension</option>
  //           </select>

  //           <div className="mt-4">
  //             <label className="flex items-center">
  //               <input
  //                 type="checkbox"
  //                 className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
  //                 checked={editData.isDirector}
  //                 onChange={(e) => handleInputChange("isDirector", e.target.checked)}
  //                 disabled={isViewing}
  //               />
  //               <span className="ml-2 text-sm text-gray-700">Is Director</span>
  //             </label>
  //           </div>
  //         </div>

  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700">Employee Contribution (%)</label>
  //             <input
  //               type="number"
  //               min="0"
  //               max="100"
  //               step="0.1"
  //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
  //               value={editData.employeeContribution}
  //               onChange={(e) => handleInputChange("employeeContribution", Number.parseFloat(e.target.value) || 0)}
  //               disabled={isViewing}
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700">Employer Contribution (%)</label>
  //             <input
  //               type="number"
  //               min="0"
  //               max="100"
  //               step="0.1"
  //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
  //               value={editData.employerContribution}
  //               onChange={(e) => handleInputChange("employerContribution", Number.parseFloat(e.target.value) || 0)}
  //               disabled={isViewing}
  //             />
  //           </div>
  //         </div>
  //       </>
  //     )}
  //   </div>
  // )

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return renderPersonalDetails()
      case "employment":
        return renderEmployment()
      case "pay":
        return renderPay()
      case "taxNI":
        return renderTaxNI()
      // case "autoEnrolment":
      //   return renderAutoEnrolment()
      default:
        return renderPersonalDetails()
    }
  }

  if ((isViewing || isEditing) && selectedEmployee) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{isViewing ? "View Employee" : "Edit Employee"}</h1>
                <p className="text-sm text-gray-600">
                  {isViewing ? "Employee information" : "Update employee information"}
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {isViewing ? "Back to List" : "Cancel"}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            {/* Sidebar */}
            <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                        : "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                    } group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full text-left`}
                  >
                    {/* <span
                      className={`${
                        activeTab === tab.id ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"
                      } flex-shrink-0 -ml-1 mr-3`}
                    >
                      {getIcon(tab.icon)}
                    </span> */}
                    <span className="truncate">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
              <form onSubmit={handleUpdate}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {tabs.find((tab) => tab.id === activeTab)?.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {isViewing
                          ? "Employee information for this section."
                          : "Please update the required information for this section."}
                      </p>
                    </div>

                    {renderTabContent()}
                  </div>

                  {!isViewing && (
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
                            if (currentIndex > 0) {
                              setActiveTab(tabs[currentIndex - 1].id)
                            }
                          }}
                          disabled={activeTab === "personal"}
                          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        <div className="space-x-3">
                          {activeTab !== "taxNI" && (
                            <button
                              type="button"
                              onClick={() => {
                                const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
                                console.log(activeTab)
                                console.log(currentIndex)
                                setActiveTab(tabs[currentIndex + 1].id)
                              }}
                              className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Next
                            </button>
                          )}

                          {activeTab === "taxNI" && (
                            <button
                              type="submit"
                              className="bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Update Employee
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Details</h1>
              <p className="text-sm text-gray-600">Manage all employee information</p>
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

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {employees.length === 0 ? (
            <div className="text-center">
              {/* <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg> */}
              <h3 className="mt-2 text-sm font-medium text-gray-900">No employees</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new employee.</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md overflow-x-auto">
              <ul className="divide-y divide-gray-200 ">
                {employees.map((employee) => (
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
                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                {employee.email}
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
                                ID: {employee.employeeId}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-end space-x-2">
                          <button
                            onClick={() => handleView(employee.employeeId)}
                            className="inline-flex items-center px-3 py-2 ml-10 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleEdit(employee.employeeId)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Edit
                          </button>
                          
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
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
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeeDetails
