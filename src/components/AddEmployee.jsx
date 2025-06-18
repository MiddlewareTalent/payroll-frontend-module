//AddEmployee.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios";

const AddEmployee = ({ onAddEmployee, company }) => {
  const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  dateOfBirth: "",
  employeeId: "",
  address:"",
  gender:"",
  postCode:"",
  employeeDepartment: "",
  employmentStartedDate: "",
  employmentEndDate:null,
  employmentType: "FULL_TIME",
  employerId: "",
  payPeriod: company?.payPeriod || "MONTHLY",
  annualIncomeOfEmployee:"",

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
  niLetter: "A",
  region:"",
  isEmergencyCode:false,
  postGraduateLoanDto:{
    hasPostgraduateLoan:false,
  postgraduateLoanPlanType:"NONE",
  },
  autoEnrolmentEligible: true,
  isDirector:false,
  pensionScheme: "WORKPLACE_PENSION",
  employeeContribution: 5,
  employerContribution: 3,
  studentLoanDto:{
    hasStudentLoan:false,
  studentLoanPlanType:"NONE",
  },
  otherEmployeeDetails:null,
});


  const [activeTab, setActiveTab] = useState("personal")
   const navigate = useNavigate()
    
   
  const tabs = [
    { id: "personal", name: "Personal Details", icon: "user" },
    { id: "employment", name: "Employment", icon: "briefcase" },
    { id: "pay", name: "Pay", icon: "currency" },
    { id: "taxNI", name: "Tax & NI", icon: "document" },
    { id: "autoEnrolment", name: "Auto Enrolment", icon: "shield" },
  ]

  const handleInputChange = (field, value) => {
  if (field.startsWith("bankDetailsDTO.")) {
    const bankField = field.split(".")[1];  
    setFormData((prev) => ({
      ...prev,
      bankDetailsDTO: {
        ...prev.bankDetailsDTO,
        [bankField]: value,
      },
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }
};


 const handleSubmit = async (e) => {
  console.log(formData);
  e.preventDefault();

  // Step 1: If not on final tab, move to next tab
  if (activeTab !== "autoEnrolment") {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
    return;
  }
  console.log("Submitting employee data:", formData);

  // Step 2: On final tab — submit the form with API call
  try {
    // Make API call to backend to add employee with JSON headers
    console.log("Sending data:", formData);
    const response = await axios.post(
      "http://localhost:8080/api/employee-details/create",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
      alert("Employee added successfully");

        localStorage.setItem("employeeId", formData.employeeId);

      // Call onAddEmployee callback if provided (optional)
      if (typeof onAddEmployee === "function") {
        onAddEmployee(formData);
      }

      navigate("/employer-dashboard"); // Navigate after success
    } else {
      
      alert("Failed to add employee. Please try again.");
    }
  } catch (error) {
    if(error.status===500){
        alert(error.response.data);
      }
      else{
          alert("There was an error adding the employee.");
      }
    console.error("Error adding employee:", error);
    
  }
};

  const getIcon = (iconName) => {
    const icons = {
      user: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      briefcase: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8"
          />
        </svg>
      ),
      currency: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
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
      shield: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    }
    return icons[iconName] || icons.user
  }

  const renderPersonalDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.firstName}
            onChange={(e) => handleInputChange( "firstName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.lastName}
            onChange={(e) => handleInputChange( "lastName", e.target.value)}
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
            value={formData.email}
            onChange={(e) => handleInputChange( "email", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange( "dateOfBirth", e.target.value)}
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
            value={formData.employeeId}
            onChange={(e) => handleInputChange( "employeeId", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Post Code</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.postCode}
            onChange={(e) => handleInputChange( "postCode", e.target.value)}
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
            value={formData.address}
            onChange={(e) => handleInputChange( "address", e.target.value)}
          />
        </div>

        <div>
  <label className="block text-sm font-medium text-gray-700">Gender</label>
  <select
    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
    value={formData.gender}
    onChange={(e) => handleInputChange("gender", e.target.value)}
  >
    <option value="">Select</option>
    <option value="MALE">MALE</option>
    <option value="FEMALE">FEMALE</option>
   <option value="OTHER">Other</option>
    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
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
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employeeDepartment}
            onChange={(e) => handleInputChange( "employeeDepartment", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Employer ID</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employerId}
            onChange={(e) => handleInputChange( "employerId", e.target.value)}
          />
        </div>
      </div>

      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div>
          <label className="block text-sm font-medium text-gray-700"> Employment Start Date</label>
          <input
            type="date"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employmentStartedDate}
            onChange={(e) => handleInputChange( "employmentStartedDate", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Employment Type</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employmentType}
            onChange={(e) => handleInputChange( "employmentType", e.target.value)}
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="TEMPORARY">Temporary</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700"> Employment End Date</label>
          <input
            type="date"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employmentEndDate}
            onChange={(e) => handleInputChange( "employmentEndDate", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Working Company Name</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.workingCompanyName}
            onChange={(e) => handleInputChange( "workingCompanyName", e.target.value)}
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
          type="text"
          step="0.01"
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
          value={formData.annualIncomeOfEmployee}
          onChange={(e) => handleInputChange("annualIncomeOfEmployee", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Pay Period</label>
        <select
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
          value={formData.payPeriod} 
          onChange={(e) => handleInputChange("payPeriod", e.target.value)}  
        >
          <option value="WEEKLY">Weekly</option>
          <option value="FORTNIGHTLY">Fortnightly</option>
          <option value="MONTHLY">Monthly</option>
          <option value="QUARTERLY">Quarterly</option>
        </select>
      </div>
      </div>
    

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  <div>
    <label className="block text-sm font-medium text-gray-700">Account Name</label>
    <input
      type="text"
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
      value={formData.bankDetailsDTO.accountName}
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          bankDetailsDTO: {
            ...prev.bankDetailsDTO,
            accountName: e.target.value,
          },
        }))
      }
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Account Number</label>
    <input
      type="text"
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
      value={formData.bankDetailsDTO.accountNumber}
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          bankDetailsDTO: {
            ...prev.bankDetailsDTO,
            accountNumber: e.target.value,
          },
        }))
      }
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Sort Code</label>
    <input
      type="text"
      maxLength={6}
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
      value={formData.bankDetailsDTO.sortCode}
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          bankDetailsDTO: {
            ...prev.bankDetailsDTO,
            sortCode: e.target.value,
          },
        }))
      }
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
    <input
      type="text"
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
      value={formData.bankDetailsDTO.bankName}
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          bankDetailsDTO: {
            ...prev.bankDetailsDTO,
            bankName: e.target.value,
          },
        }))
      }
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Bank Address</label>
    <input
      type="text"
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
      value={formData.bankDetailsDTO.bankAddress}
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          bankDetailsDTO: {
            ...prev.bankDetailsDTO,
            bankAddress: e.target.value,
          },
        }))
      }
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Bank Post Code</label>
    <input
      type="text"
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
      value={formData.bankDetailsDTO.bankPostCode}
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          bankDetailsDTO: {
            ...prev.bankDetailsDTO,
            bankPostCode: e.target.value,
          },
        }))
      }
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Telephone</label>
    <input
      type="tel"
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
      value={formData.bankDetailsDTO.telephone}
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          bankDetailsDTO: {
            ...prev.bankDetailsDTO,
            telephone: e.target.value,
          },
        }))
      }
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Payment Reference</label>
    <input
      type="text"
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
      value={formData.bankDetailsDTO.paymentReference}
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          bankDetailsDTO: {
            ...prev.bankDetailsDTO,
            paymentReference: e.target.value,
          },
        }))
      }
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700">Payment Lead Days</label>
    <input
      type="number"
      min="0"
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
      value={formData.bankDetailsDTO.paymentLeadDays}
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          bankDetailsDTO: {
            ...prev.bankDetailsDTO,
            paymentLeadDays: e.target.value,
          },
        }))
      }
    />
  </div>

  <div className="flex items-center mt-6">
    <input
      type="checkbox"
      checked={formData.bankDetailsDTO.isRTIReturnsIncluded}
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          bankDetailsDTO: {
            ...prev.bankDetailsDTO,
            isRTIReturnsIncluded: e.target.checked,
          },
        }))
      }
      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
    />
    <label className="ml-2 text-sm font-medium text-gray-700">
      Include in RTI Returns
    </label>
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
          value={formData.taxCode}
          onChange={(e) => handleInputChange("taxCode", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">National Insurance Number</label>
        <input
          type="text"
          placeholder="AB123456C"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
          value={formData.nationalInsuranceNumber}
          onChange={(e) => handleInputChange("nationalInsuranceNumber", e.target.value)}
        />
      </div>
    </div>  

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">NI Category Letter</label>
        <select
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
          value={formData.niLetter}
          onChange={(e) => handleInputChange("niLetter", e.target.value)}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="H">H</option>
          <option value="M">M</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Student Loan</label>
        <select
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
          value={formData.studentLoan}
          onChange={(e) => handleInputChange("studentLoan", e.target.value)}
        >
          <option value="NONE">None</option>
          <option value="STUDENT_LOAN_PLAN_1">Plan 1</option>
          <option value="STUDENT_LOAN_PLAN_2">Plan 2</option>
          <option value="STUDENT_LOAN_PLAN_3">Plan 3</option>
          <option value="POSTGRADUATE">Postgraduate</option>
        </select>  
      </div>
      
<div>
  <label className="block text-sm font-medium text-gray-700">Region</label>
  <select
    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
    value={formData.region}
    onChange={(e) => handleInputChange("region", e.target.value)}
  >
    <option value="">Select</option>
    <option value="SCOTLAND">Scotland</option>
    <option value="ENGLAND">England</option>
    <option value="NORTHERN_IRELAND">Northern Ireland</option>
    <option value="WALES">Wales</option>
  </select>
</div>


<div className="flex items-center mt-6">
  <input
    type="checkbox"
    checked={formData.isEmergencyCode}
    onChange={(e) =>
      setFormData(prev => ({
        ...prev,
        isEmergencyCode: e.target.checked,
      }))
    }
    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
  />
  <label className="ml-2 text-sm font-medium text-gray-700">
    Emergency Tax Code
  </label>
</div>



<div className="flex items-center mt-6">
  <input
    type="checkbox"
    checked={formData.isPostgraduateLoan}
    onChange={(e) =>
      setFormData(prev => ({
        ...prev,
        isPostgraduateLoan: e.target.checked,
      }))
    }
    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
  />
  <label className="ml-2 text-sm font-medium text-gray-700">
    Postgraduate Loan
  </label>
</div>
    </div>
  </div>
)


  const renderAutoEnrolment = () => (
  <div className="space-y-6">
    <div>
      <label className="flex items-center">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          checked={formData.autoEnrolmentEligible}
          onChange={(e) =>
            handleInputChange("autoEnrolmentEligible", e.target.checked)
          }
        />
        <span className="ml-2 text-sm text-gray-700">
          Eligible for Auto Enrolment
        </span>
      </label>
    </div>

    {formData.autoEnrolmentEligible && (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pension Scheme
          </label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.pensionScheme}
            onChange={(e) =>
              handleInputChange("pensionScheme", e.target.value)
            }
          >
            <option value="">-- Select --</option>
            <option value="WORKPLACE_PENSION">Workplace Pension</option>
            <option value="NEST">NEST</option>
            <option value="STAKEHOLDER">Stakeholder Pension</option>
          </select>

          <div className="mt-4">
  <label className="flex items-center">
    <input
      type="checkbox"
      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      checked={formData.isDirector}
      onChange={(e) =>
        handleInputChange("isDirector", e.target.checked)
      }
    />
    <span className="ml-2 text-sm text-gray-700">Is Director</span>
  </label>
</div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee Contribution (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.employeeContribution}
              onChange={(e) =>
                handleInputChange(
                  "employeeContribution",
                  parseFloat(e.target.value) || 0
                )
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employer Contribution (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.employerContribution}
              onChange={(e) =>
                handleInputChange(
                  "employerContribution",
                  parseFloat(e.target.value) || 0
                )
              }
            />
          </div>
        </div>
      </>
    )}
  </div>
);
 const renderTabContent = () => {
  switch (activeTab) {
    case "personal":
      return renderPersonalDetails();
    case "employment":
      return renderEmployment();
    case "pay":
      return renderPay();
    case "taxNI":
      return renderTaxNI();
    case "autoEnrolment":
      return renderAutoEnrolment();
    default:
      return renderPersonalDetails();
  }
}
  console.log(activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
              <p className="text-sm text-gray-600">Complete all sections to register a new employee</p>
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
                  <span
                    className={`${
                      activeTab === tab.id ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"
                    } flex-shrink-0 -ml-1 mr-3`}
                  >
                    {getIcon(tab.icon)}
                  </span>
                  <span className="truncate">{tab.name}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {tabs.find((tab) => tab.id === activeTab)?.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Please fill in all required information for this section.
                    </p>
                  </div>

                  {renderTabContent()}
                </div>

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
                      {activeTab !== "autoEnrolment" && 
                        <button
                          type="button"
                          onClick={() => {
                            const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
                            console.log(activeTab)
                            console.log(currentIndex)
                            
                              setActiveTab(tabs[currentIndex+1].id)
                            
                          }}
                          className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Next
                        </button>}
                       
                        {activeTab === "autoEnrolment" && <button
                          type="submit"
                          className="bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Submit 
                        </button>}
                      
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AddEmployee;
