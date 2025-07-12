//AddEmployee.jsx
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios";
import Select from 'react-select';

const AddEmployee = ({ onAddEmployee }) => {
  const [formData, setFormData] = useState({
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

    taxCode: "",
    nationalInsuranceNumber: "",
    niLetter: "",
    taxYear: "",
    totalPersonalAllowance: 12570,
    previouslyUsedPersonalAllowance: 0,
    region: "",
    hasEmergencyCode: false,
    postGraduateLoanDto: {
      hasPostgraduateLoan: false,
      postgraduateLoanPlanType: "NONE",
    },
    hasPensionEligible: false,
    // isDirector:false,
    // pensionScheme: "WORKPLACE_PENSION",
    // employeeContribution: 5,
    // employerContribution: 3,
    studentLoanDto: {
      hasStudentLoan: false,
      studentLoanPlanType: "NONE",
    },
    otherEmployeeDetails: null,
  });


  const [activeTab, setActiveTab] = useState("personal")
  const navigate = useNavigate()
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState({});
  const [p45File, setP45File] = useState(null);
  const [starterChecklistFile, setStarterChecklistFile] = useState(null);



  const tabs = [
    { id: "personal", name: "Personal Details", icon: "user" },
    { id: "employment", name: "Employment", icon: "briefcase" },
    { id: "pay", name: "Pay", icon: "currency" },
    { id: "taxNI", name: "Tax & NI", icon: "document" },
    // { id: "autoEnrolment", name: "Auto Enrolment", icon: "shield" },
  ]

  const NICategoryLetters = [
    { value: 'A', label: 'A' },
    { value: 'M', label: 'M' },
    { value: 'C', label: 'C' },
    { value: 'X', label: 'X' },
    { value: 'B', label: 'B' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
    { value: 'H', label: 'H' },
    { value: 'I', label: 'I' },
    { value: 'J', label: 'J' },
    { value: 'K', label: 'K' },
    { value: 'L', label: 'L' },
    { value: 'N', label: 'N' },
    { value: 'S', label: 'S' },
    { value: 'V', label: 'V' },
    { value: 'Z', label: 'Z' }
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

  const validateCurrentTab = (tabId) => {
    const newErrors = {};
    const newWarnings = [];

    if (tabId === "pay") {
      if (!formData.annualIncomeOfEmployee) {
        newErrors.annualIncomeOfEmployee = "Annual income is required.";
      }
      if (!formData.payPeriod) {
        newErrors.payPeriod = "Pay period is required.";
      }

      if (!formData.bankDetailsDTO?.accountName) {
        newErrors.accountName = "Account name is required.";
      }
      if (!formData.bankDetailsDTO?.accountNumber) {
        newErrors.accountNumber = "Account number is required.";
      }
      if (!formData.bankDetailsDTO?.sortCode || formData.bankDetailsDTO?.sortCode.length !== 6) {
        newErrors.sortCode = "Sort code must be 6 digits.";
      }
      if (!formData.bankDetailsDTO?.bankName) {
        newErrors.bankName = "Bank Name is required.";
      }
    }
    setErrors(newErrors);
    setWarnings(newWarnings);

    return Object.keys(newErrors).length === 0;
  };

  const validateTaxAndLoanDetails = () => {
    const newErrors = {};
    const newWarnings = [];

    //  Format taxCode and NI Number
    const emergencyTaxCodes = ["1257L X", "1257L W1", "1257L M1"];
    const rawTaxCode = formData.taxCode?.trim().toUpperCase() || "";
    const formattedTaxCode = rawTaxCode.replace(/(1257L)([XMW1]+)/, "$1 $2");
    const formattedNINumber = formData.nationalInsuranceNumber?.trim().toUpperCase() || "";

    // Apply formatted values if needed
    if (formData.taxCode !== formattedTaxCode) {
      setFormData((prev) => ({ ...prev, taxCode: formattedTaxCode }));
    }
    if (formData.nationalInsuranceNumber !== formattedNINumber) {
      setFormData((prev) => ({ ...prev, nationalInsuranceNumber: formattedNINumber }));
    }

    //  Basic required field validations
    if (!formattedTaxCode) {
      newErrors.taxCode = "Tax code is required.";
    }
    if (!formattedNINumber) {
      newErrors.nationalInsuranceNumber = "National Insurance Number is required.";
    }
    if (!formData.niLetter) {
      newErrors.niLetter = "NI Category Letter is required.";
    }
    if (!formData.region) {
      newErrors.region = "Region is required.";
    }
    if (!formData.taxYear) {
      newErrors.taxYear = "Tax Year is required.";
    }

    // Student Loan
    const hasStudentLoan = formData.studentLoanDto.hasStudentLoan;
    const studentLoanPlan = formData.studentLoanDto.studentLoanPlanType;

    if (hasStudentLoan && studentLoanPlan === "NONE") {
      newErrors.studentLoanPlanType = "Please select a student loan plan type.";
    }
    if (!hasStudentLoan && studentLoanPlan !== "NONE") {
      newErrors.studentLoanCheckbox = "Please check the student loan checkbox if a plan type is selected.";
    }

    //  Postgraduate Loan (Optional)
    const hasPostgradLoan = formData.postGraduateLoanDto.hasPostgraduateLoan;
    const postgradLoanPlan = formData.postGraduateLoanDto.postgraduateLoanPlanType;

    if (hasPostgradLoan && postgradLoanPlan === "NONE") {
      newErrors.postgraduateLoanPlanType = "Please select a postgraduate loan plan type.";
    }
    if (!hasPostgradLoan && postgradLoanPlan !== "NONE") {
      newErrors.postgraduateLoanCheckbox = "Please check the postgraduate loan checkbox if a plan type is selected.";
    }

    //  Emergency tax code warning
    if (emergencyTaxCodes.includes(formattedTaxCode) && !formData.hasEmergencyCode) {
      newWarnings.push("You selected an emergency tax code but didn't check the Emergency Tax Code box.");
    }

    //  Region mismatches
    if (formattedTaxCode.startsWith("S") && formData.region !== "SCOTLAND") {
      newWarnings.push("Tax code starts with 'S' Please select region Scotland.");
    }
    if (formattedTaxCode.startsWith("C") && formData.region !== "WALES") {
      newWarnings.push("Tax code starts with 'C' Please select region Wales.");
    }

    // Set and return
    setErrors(newErrors);
    setWarnings(newWarnings);

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    const keys = field.split(".");
    if (keys.length === 2) {
      const [parentKey, childKey] = keys;
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleNext = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);

    let isFormValid = true;

    if (activeTab === "taxNI") {
      isValid = validateForm() && validateTaxAndLoanDetails();
    } else if (activeTab === "autoEnrolment") {
      isValid = validateForm();
    } else {
      isValid = true; 
    }

    if (!isValid) return; 

    // Move to next tab
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const validateForm = () => {
    return validateCurrentTab("pay") && validateTaxAndLoanDetails();
  };

  const handleP45Change = (e) => {
    setP45File(e.target.files[0]);
  };

  const handleStarterChecklistChange = (e) => {
    setStarterChecklistFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    let updatedData = { ...formData};

    const isFormValid = validateForm();
    const isTaxValid = validateTaxAndLoanDetails();
    if (!isFormValid || !isTaxValid) return;


    try {
      console.log("Sending data:", formData);
      if (p45File || starterChecklistFile) {
        const formDataUpload = new FormData();
        if (p45File) formDataUpload.append("p45Document", p45File);
        if (starterChecklistFile) formDataUpload.append("starterChecklist", starterChecklistFile);

        const fileData = await axios.post(`http://localhost:8080/api/employee-details/upload-documents`, formDataUpload, {
          headers: { "Content-Type": "multipart/form-data" },
        });


        console.log(fileData.data);
         updatedData = {
          ...updatedData,
          hasP45DocumentSubmitted: !!fileData.data["P45"],
          hasStarterChecklistDocumentSubmitted: !!fileData.data["checklist"],
          p45Document: fileData.data["P45"] || updatedData.p45Document,
          starterChecklistDocument: fileData.data["Checklist"] || updatedData.starterChecklistDocument,
        };
      }

         
      console.log("form data", formData);

      const response = await axios.post(
        "http://localhost:8080/api/employee-details/create",
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      if (response.status === 201) {
        alert("Employee added successfully");

        localStorage.setItem("employeeId", formData.employeeId);

        if (typeof onAddEmployee === "function") {
          onAddEmployee(formData);
        }

        navigate("/employer-dashboard"); 
      } else {

        alert("Failed to add employee. Please try again.");
      }
    } catch (error) {
      if (error.status === 500) {
        alert(error.response.data);
      }
      else {
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
          <label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-600">*</span></label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-600">*</span></label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-600">*</span></label>
          <input
            type="email"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth <span className="text-red-600">*</span></label>
          <input
            type="date"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employee ID <span className="text-red-600">*</span></label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employeeId}
            onChange={(e) => handleInputChange("employeeId", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Post Code <span className="text-red-600">*</span></label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.postCode}
            onChange={(e) => handleInputChange("postCode", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Address <span className="text-red-600">*</span></label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender <span className="text-red-600">*</span></label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700">Employee Department <span className="text-red-600">*</span></label>
          <Select
            options={departmentOptions}
            value={departmentOptions.find((option) => option.value === formData.employeeDepartment)}
            onChange={(selectedOption) => handleInputChange('employeeDepartment', selectedOption?.value || '')}
            className="mt-1 text-sm"
            styles={{
              menuList: (base) => ({
                ...base,
                maxHeight: '120px', // Show around 4 items, then scroll
              }),
            }}
            placeholder="Select department..."
            isSearchable
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700">Employer ID <span className="text-red-600">*</span></label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employerId}
            onChange={(e) => handleInputChange("employerId", e.target.value)}
          />
        </div>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium text-gray-700"> Employment Start Date <span className="text-red-600">*</span></label>
          <input
            type="date"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employmentStartedDate}
            onChange={(e) => handleInputChange("employmentStartedDate", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Employment Type</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employmentType}
            onChange={(e) => handleInputChange("employmentType", e.target.value)}
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
            onChange={(e) => handleInputChange("employmentEndDate", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Working Company Name <span className="text-red-600">*</span></label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.workingCompanyName}
            onChange={(e) => handleInputChange("workingCompanyName", e.target.value)}
          />
        </div>
      </div>
    </div>
  )

  const renderPay = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Annual Income (£) <span className="text-red-600">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700">Pay Period <span className="text-red-600">*</span></label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.payPeriod}
            onChange={(e) => handleInputChange("payPeriod", e.target.value)}
          >
            <option value="">Select</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Account Name <span className="text-red-600">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700">Account Number <span className="text-red-600">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700">Sort Code <span className="text-red-600">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700">Bank Name <span className="text-red-600">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700">Tax Code <span className="text-red-600">*</span></label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.taxCode}
            onChange={(e) => handleInputChange("taxCode", e.target.value.toUpperCase())}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">National Insurance Number <span className="text-red-600">*</span></label>
          <input
            type="text"
            placeholder="AB123456C"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.nationalInsuranceNumber}
            onChange={(e) => handleInputChange("nationalInsuranceNumber", e.target.value.toUpperCase())}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">NI Category Letter <span className="text-red-600">*</span></label>
          <Select
            options={NICategoryLetters}
            value={NICategoryLetters.find((option) => option.value === formData.niLetter)}
            onChange={(selectedOption) => handleInputChange('niLetter', selectedOption?.value || '')}
            className="mt-1 text-sm"
            styles={{
              menuList: (base) => ({
                ...base,
                maxHeight: '120px', // Show around 4 items, then scroll
              }),
            }}
            placeholder="Select NI Category Letter..."
            isSearchable
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Region <span className="text-red-600">*</span></label>
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

        <div className="flex flex-row gap-20">
          <label className="flex items-center mt-6">
            <input
              type="checkbox"
              checked={formData.hasEmergencyCode}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  hasEmergencyCode: e.target.checked,
                }))
              }
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Emergency Tax Code
            </span>
          </label>

          <label className="flex items-center mt-6">
            <input
              type="checkbox"
              checked={formData.studentLoanDto.hasStudentLoan}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  studentLoanDto: {
                    ...prev.studentLoanDto,
                    hasStudentLoan: e.target.checked,
                  },
                }))
              }
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Student Loan
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Student Loan</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.studentLoanDto.studentLoanPlanType}
            onChange={(e) => handleInputChange("studentLoanDto.studentLoanPlanType", e.target.value)}
          >
            <option value="NONE">None</option>
            <option value="STUDENT_LOAN_PLAN_1">Plan 1</option>
            <option value="STUDENT_LOAN_PLAN_2">Plan 2</option>
            <option value="STUDENT_LOAN_PLAN_3">Plan 4</option>
          </select>
        </div>




        <div>
          <label className="block text-sm font-medium text-gray-700">Tax Year <span className="text-red-600">*</span></label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.taxYear}
            onChange={(e) => handleInputChange("taxYear", e.target.value)}
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
            checked={formData.postGraduateLoanDto.hasPostgraduateLoan}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                postGraduateLoanDto: {
                  ...prev.postGraduateLoanDto,
                  hasPostgraduateLoan: e.target.checked,
                },
              }))
            }
          />

          <span className="ml-2 text-sm font-medium text-gray-700">
            Postgraduate Loan
          </span>
        </label>


        <div>
          <label className="block text-sm font-medium text-gray-700">Postgraduate Loan</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.postGraduateLoanDto.postgraduateLoanPlanType}
            onChange={(e) => handleInputChange("postGraduateLoanDto.postgraduateLoanPlanType", e.target.value)}
          >
            <option value="NONE">None</option>
            <option value="POSTGRADUATE_LOAN_PLAN_3">Postgraduate Loan Plan 3</option>
          </select>
        </div>

        <label className="flex items-center">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            checked={formData.hasPensionEligible}
            onChange={(e) =>
              handleInputChange("hasPensionEligible", e.target.checked)
            }
          />
          <span className="ml-2 text-sm text-gray-700 font-medium">
            Eligible for Auto Enrolment
          </span>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload P45 Document</label>
          <input type="file" onChange={handleP45Change} className="mt-1 block w-50 bg-blue-100 text-sm border-1 border-blue-500 rounded-lg p-1" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Starter Checklist</label>
          <input type="file" onChange={handleStarterChecklistChange} className="mt-1 block w-50 bg-blue-100 text-sm border-1 border-blue-500 rounded-lg p-1" />
        </div>

      </div>
    </div>
  )


  //   const renderAutoEnrolment = () => (
  //   <div className="space-y-6">
  //     <div>
  //       <label className="flex items-center">
  //         <input
  //           type="checkbox"
  //           className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
  //           checked={formData.autoEnrolmentEligible}
  //           onChange={(e) =>
  //             handleInputChange("autoEnrolmentEligible", e.target.checked)
  //           }
  //         />
  //         <span className="ml-2 text-sm text-gray-700">
  //           Eligible for Auto Enrolment
  //         </span>
  //       </label>
  //     </div>

  //     {formData.autoEnrolmentEligible && (
  //       <>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700">
  //             Pension Scheme
  //           </label>
  //           <select
  //             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
  //             value={formData.pensionScheme}
  //             onChange={(e) =>
  //               handleInputChange("pensionScheme", e.target.value)
  //             }
  //           >
  //             <option value="">-- Select --</option>
  //             <option value="WORKPLACE_PENSION">Workplace Pension</option>
  //             <option value="NEST">NEST</option>
  //             <option value="STAKEHOLDER">Stakeholder Pension</option>
  //           </select>

  //           <div className="mt-4">
  //   <label className="flex items-center">
  //     <input
  //       type="checkbox"
  //       className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
  //       checked={formData.isDirector}
  //       onChange={(e) =>
  //         handleInputChange("isDirector", e.target.checked)
  //       }
  //     />
  //     <span className="ml-2 text-sm text-gray-700">Is Director</span>
  //   </label>
  // </div>

  //         </div>

  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700">
  //               Employee Contribution (%)
  //             </label>
  //             <input
  //               type="number"
  //               min="0"
  //               max="100"
  //               step="0.1"
  //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
  //               value={formData.employeeContribution}
  //               onChange={(e) =>
  //                 handleInputChange(
  //                   "employeeContribution",
  //                   parseFloat(e.target.value) || 0
  //                 )
  //               }
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium text-gray-700">
  //               Employer Contribution (%)
  //             </label>
  //             <input
  //               type="number"
  //               min="0"
  //               max="100"
  //               step="0.1"
  //               className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
  //               value={formData.employerContribution}
  //               onChange={(e) =>
  //                 handleInputChange(
  //                   "employerContribution",
  //                   parseFloat(e.target.value) || 0
  //                 )
  //               }
  //             />
  //           </div>
  //         </div>
  //       </>
  //     )}
  //   </div>
  // );
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
                  className={`${activeTab === tab.id
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                    } group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full text-left`}
                >
                  <span
                    className={`${activeTab === tab.id ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"
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
                     Fields marked with (*) are mandatory. Please fill them out.
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
                      {activeTab !== "taxNI" &&
                        <button
                          type="button"
                          onClick={() => {
                            const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
                            const currentTabId = tabs[currentIndex].id;

                            const isValid =
                              currentTabId === "taxNI"
                                ? validateTaxAndLoanDetails()
                                : validateCurrentTab(currentTabId);

                            if (!isValid) return; 


                            console.log(activeTab)
                            console.log(currentIndex)

                            setActiveTab(tabs[currentIndex + 1].id)

                          }}
                          className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Next
                        </button>}

                      {activeTab === "taxNI" && <button
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
        {warnings.length > 0 && (
          <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4">
            {warnings.map((msg, i) => (
              <div key={i}>⚠️ {msg}</div>
            ))}
          </div>
        )}
        {Object.values(errors).length > 0 && (
          <div className="bg-red-100 text-red-800 p-2 rounded mb-4">
            {Object.entries(errors).map(([key, msg], i) => (
              <div key={i}>❌ {msg}</div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
export default AddEmployee;
