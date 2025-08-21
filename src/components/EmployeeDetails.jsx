import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Select from "react-select"
import ModalWrapper from "../ModalWrapper/ModalWrapper"

const EmployeeDetails = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState("active");
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [employees, setEmployees] = useState([])
  const [employers, setEmployers] = useState([])
  const [activeTab, setActiveTab] = useState("personal")
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState({});
  const [p45Form, setP45Form] = useState(null);
  const [starterChecklist, setStarterChecklist] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState("")
  const [loading, setLoading] = useState(false);
  const [isDelete, setIsDelete]=useState(false);
  const [employeeSelectToDelete, setEmployeeSelectToDelete]=useState({});
  const [isUpdatePopup,setIsUpdatePopup]=useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    employmentEndDate: "",
    employmentType: "FULL_TIME",
    payPeriod: "MONTHLY",
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
      bankName: "",
      sortCode: "",
      bankAddress: "",
      bankPostCode: "",
    },

    studentLoanDto: {
      hasStudentLoan: false,
      monthlyDeductionAmountInStudentLoan: "",
      weeklyDeductionAmountInStudentLoan: "",
      yearlyDeductionAmountInStudentLoan: "",
      totalDeductionAmountInStudentLoan: "",
      studentLoanPlanType: "NONE",
    },

    previousEmploymentDataDTO: {
      previousTaxCode: "",
      previousTotalPayToDate: "",
      previousTotalTaxToDate: "",
      previousEmploymentEndDate: ""
    },

    postGraduateLoanDto: {
      hasPostgraduateLoan: false,
      monthlyDeductionAmountInPostgraduateLoan: "",
      weeklyDeductionAmountInPostgraduateLoan: "",
      yearlyDeductionAmountInPostgraduateLoan: "",
      totalDeductionAmountInPostgraduateLoan: "",
      postgraduateLoanPlanType: "NONE"
    },
  })

  const employeeTabs = [
    { id: "active", name: "Active Employees" },
    { id: "leaving", name: "Leaving Employees" },
    { id: "inactive", name: "Inactive Employees" },
    { id: "all", name: "All Employees" }
  ]

  const tabs = [
    { id: "personal", name: "Personal Details", icon: "user" },
    { id: "employment", name: "Employment", icon: "briefcase" },
    { id: "pay", name: "Pay", icon: "currency" },
    { id: "taxNI", name: "Tax & NI", icon: "document" },
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

  const formatSortCode = (input) => {
    let value = input.replace(/\D/g, ""); // Remove non-digits
    if (value.length > 6) value = value.slice(0, 6);

    return (
      value.slice(0, 2) +
      (value.length > 2 ? "-" + value.slice(2, 4) : "") +
      (value.length > 4 ? "-" + value.slice(4, 6) : "")
    );
  };

  const fetchEmployees = async () => {
    try {
      let url = "";
      switch (selectedTab) {
        case "active":
          url = "http://localhost:8080/api/employee-details/fetch/active-employees";
          break;
        case "leaving":
          url = "http://localhost:8080/api/employee-details/fetch/Ready-for-leave-employees";
          break;
        case "inactive":
          url = "http://localhost:8080/api/employee-details/fetch/inactive-employees";
          break;
        case "all":
          url = "http://localhost:8080/api/employee-details/allEmployees";
          break;
        default:
          url = "http://localhost:8080/api/employee-details/fetch/active-employees";
      }

      const response = await axios.get(url);
      setEmployees(response.data.reverse());
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      // If backend sends 404, set empty list so UI can still show "No employees"
      if (error.response && error.response.status === 404) {
        setEmployees([]);
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [selectedTab]);


  const handleDocumentsChange = (e) => {
    if (e.target.value === "") {
      setEditData((prev) => ({
        ...prev,
        hasP45DocumentSubmitted: false,
        hasStarterChecklistDocumentSubmitted: false,
        starterChecklistDocument: "",
        p45Document: "",
        previousEmploymentDataDTO: {
          ...prev.previousEmploymentDataDTO,
          previousTaxCode: "",
          previousTotalTaxToDate: "",
          previousTotalPayToDate: "",
          previousEmploymentEndDate: ""
        }
      }));
      setStarterChecklist("");
      setP45Form("");
    }
    else if (e.target.value === "p45") {
      console.log(1)
      setEditData((prev) => ({
        ...prev,
        hasP45DocumentSubmitted: true,
        hasStarterChecklistDocumentSubmitted: false,
        starterChecklistDocument: "",
      }));
      setStarterChecklist("");
    }
    else if (e.target.value === "starterChecklist") {
      console.log(2)
      setEditData((prev) => ({
        ...prev,
        hasP45DocumentSubmitted: false,
        hasStarterChecklistDocumentSubmitted: true,
        p45Document: "",
        previousEmploymentDataDTO: {
          ...prev.previousEmploymentDataDTO,
          previousTaxCode: "",
          previousTotalTaxToDate: "",
          previousTotalPayToDate: "",
          previousEmploymentEndDate: ""
        }
      }));
      setP45Form("");
    }
    setSelectedDocument(e.target.value);
  };

  useEffect(() => {
    fetchEmployers()
  }, [])

  const fetchEmployers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/employer/allEmployers");
      console.log("all employers API fetched:", response.data)
      setEmployers(response.data)
    } catch (error) {
      console.error("Failed to fetch employers:", error)
      alert("Failed to fetch employers. Please try again.")
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
      if (!employee.bankDetailsDTO) {
        employee.bankDetailsDTO = {
          accountName: "",
          accountNumber: "",
          bankName: "",
          sortCode: "",
          bankAddress: "",
          bankPostCode: "",
        }
      }

      setSelectedEmployee(employee)
      setEditData(employee)
      if (employee.hasP45DocumentSubmitted) {
        setSelectedDocument("p45");
      }
      else if (employee.hasStarterChecklistDocumentSubmitted) {
        setSelectedDocument("starterChecklist")
      }
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
          bankName: "",
          sortCode: "",
          bankAddress: "",
          bankPostCode: "",
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
   
 
    if (!id) {
      console.error("No employee ID provided for deletion.")
      return
    }
 
   
      try {
        console.log("Deleting employee with ID:", id)
 
        await axios.delete(`http://localhost:8080/api/employee-details/delete/${id}`)
       
        fetchEmployees()
      } catch (error) {
        console.error("Failed to delete employee:", error)
       
      }
 
      setIsDelete(false);
   
  }
  const validatePersonalDetailsTab = () => {
    const newErrors = {};
    const newWarnings = [];

    if (!editData.firstName) {
      newErrors.firstName = "First name is required.";
    }

    if (!editData.lastName) {
      newErrors.lastName = "Last name is required. ";
    }

    if (!editData.email) {
      newErrors.email = "Email is required. ";
    }
    // else if(!editData.email.endsWith("@gmail.com")){
    //   newErrors.email = "Only Gmail addresses (@gmail.com) are allowed."
    // }

    if (!editData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required.";
    } else {
      const dobDate = new Date(editData.dateOfBirth);
      const today = new Date();

      // Set time of both to 00:00:00 to only compare date portion
      dobDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (dobDate >= today) {
        newErrors.dateOfBirth = "Date of birth must be in the past.";
      }

    }

    if (!editData.employeeId) {
      newErrors.employeeId = "EmployeeId is required";
    }

    if (!editData.postCode) {
      newErrors.postCode = "PostCode is required";
    }

    if (!editData.address) {
      newErrors.address = "Address is required.";
    }

    if (!editData.gender) {
      newErrors.gender = "Gender is required.";
    }

    setErrors(newErrors);
    setWarnings(newWarnings);

    return {
      isValid: Object.keys(newErrors).length === 0,
      warnings: newWarnings,
      errors: newErrors,
    };
  };

  const validateCurrentTab = (tabId) => {
    const newErrors = {};
    const newWarnings = [];

    if (tabId === "pay") {
      if (!editData.annualIncomeOfEmployee) {
        newErrors.annualIncomeOfEmployee = "Annual income is required.";
      }

      if (!editData.bankDetailsDTO?.accountName) {
        newErrors.accountName = "Account name is required.";
      }
      if (!editData.bankDetailsDTO?.accountNumber) {
        newErrors.accountNumber = "Account number is required.";
      }
      if (!editData.bankDetailsDTO?.sortCode || editData.bankDetailsDTO?.sortCode.length !== 8) {
        newErrors.sortCode = "Sort code must be 8 digits.";
      }
      if (!editData.bankDetailsDTO?.bankName) {
        newErrors.bankName = "Bank Name is required.";
      }
    }
    setErrors(newErrors);
    setWarnings(newWarnings);

    return {
      isValid: Object.keys(newErrors).length === 0,
      warnings: newWarnings,
      errors: newErrors,
    };
  };

  const validateTaxAndLoanDetails = () => {
    const newErrors = {};
    const newWarnings = [];

    const emergencyTaxCodes = ["1257L X", "1257L W1", "1257L M1"];
    const rawTaxCode = editData.taxCode?.trim().toUpperCase() || "";
    const formattedTaxCode = rawTaxCode.replace(/(1257L)([XMW1]+)/, "$1 $2");
    const formattedNINumber = editData.nationalInsuranceNumber?.trim().toUpperCase() || "";

    // Update formatted values
    if (editData.taxCode !== formattedTaxCode) {
      setEditData((prev) => ({ ...prev, taxCode: formattedTaxCode }));
    }
    if (editData.nationalInsuranceNumber !== formattedNINumber) {
      setEditData((prev) => ({ ...prev, nationalInsuranceNumber: formattedNINumber }));
    }

    // Required fields
    if (!formattedTaxCode) newErrors.taxCode = "Tax code is required.";
    if (!formattedNINumber) newErrors.nationalInsuranceNumber = "National Insurance Number is required.";
    if (!editData.niLetter) newErrors.niLetter = "NI Category Letter is required.";
    if (!editData.region) newErrors.region = "Region is required.";
    if (!editData.taxYear) newErrors.taxYear = "Tax Year is required.";

    // Student Loan
    const { hasStudentLoan, studentLoanPlanType } = editData.studentLoanDto;
    if (hasStudentLoan && studentLoanPlanType === "NONE") {
      newErrors.studentLoanPlanType = "Please select a student loan plan type.";
    }
    if (!hasStudentLoan && studentLoanPlanType !== "NONE") {
      newErrors.studentLoanCheckbox = "Tick the checkbox for Student Loan if a plan type is selected.";
    }

    // Postgraduate Loan
    const { hasPostgraduateLoan, postgraduateLoanPlanType } = editData.postGraduateLoanDto;
    if (hasPostgraduateLoan && postgraduateLoanPlanType === "NONE") {
      newErrors.postgraduateLoanPlanType = "Please select a postgraduate loan plan type.";
    }
    if (!hasPostgraduateLoan && postgraduateLoanPlanType !== "NONE") {
      newErrors.postgraduateLoanCheckbox = "Tick the checkbox for Postgraduate Loan if a plan type is selected.";
    }

    if (formattedTaxCode.startsWith("S") && editData.region !== "SCOTLAND") {
      newWarnings.push("Tax code starts with 'S' - Region should be Scotland.");
    }
    if (formattedTaxCode.startsWith("C") && editData.region !== "WALES") {
      newWarnings.push("Tax code starts with 'C' - Region should be Wales.");
    }

    setErrors(newErrors);
    setWarnings(newWarnings);

    return {
      isValid: Object.keys(newErrors).length === 0,
      warnings: newWarnings,
      errors: newErrors,
    };
  };


  const handleInputChange = (field, value) => {
    const keys = field.split(".");
    const upperValue = value.toUpperCase();
    const isEmergency = field === "taxCode" && /\b(W1|M1|X)\b$/.test(upperValue.trim());

    setEditData((prev) => ({
      ...prev,
      [field]: upperValue,
      ...(field === "taxCode" && { hasEmergencyCode: isEmergency })
    }));

    // Update editData
    if (keys.length === 2) {
      const [parentKey, childKey] = keys;
      setEditData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear errors dynamically when field is corrected
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      switch (field) {
        //tax and NI fields
        case "taxCode":
          if (value.trim() !== "") delete newErrors.taxCode;
          break;
        case "nationalInsuranceNumber":
          if (value.trim() !== "") delete newErrors.nationalInsuranceNumber;
          break;
        case "niLetter":
          if (value) delete newErrors.niLetter;
          break;
        case "annualIncomeOfEmployee":
          if (value.trim() !== "") delete newErrors.annualIncomeOfEmployee;
          break;
        //Personal Details fields 
        case "firstName":
          if (value.trim() !== "") delete newErrors.firstName;
          break;
        case "lastName":
          if (value.trim() !== "") delete newErrors.lastName;
          break;
        case "email":
          if (value.trim() !== "") delete newErrors.email;
          break;
        case "dateOfBirth":
          if (value.trim() !== "") delete newErrors.dateOfBirth;
          break;
        case "employeeId":
          if (value.trim() !== "") delete newErrors.employeeId;
          break;
        case "postCode":
          if (value.trim() !== "") delete newErrors.postCode;
          break;
        case "address":
          if (value.trim() !== "") delete newErrors.address;
          break;
        case "gender":
          if (value.trim() !== "") delete newErrors.gender;
          break;

        //  Bank Details Fields
        case "bankDetailsDTO.accountName":
          if (value.trim() !== "") delete newErrors.accountName;
          break;
        case "bankDetailsDTO.accountNumber":
          if (value.trim() !== "") delete newErrors.accountNumber;
          break;
        case "bankDetailsDTO.sortCode":
          if (value.trim().length === 8) delete newErrors.sortCode;
          break;
        case "bankDetailsDTO.bankName":
          if (value.trim() !== "") delete newErrors.bankName;
          break;

        //  Student Loan & Postgraduate Loan
        case "studentLoanDto.hasStudentLoan":
        case "studentLoanDto.studentLoanPlanType":
          delete newErrors.studentLoanCheckbox;
          delete newErrors.studentLoanPlanType;
          break;
        case "postGraduateLoanDto.hasPostgraduateLoan":
        case "postGraduateLoanDto.postgraduateLoanPlanType":
          delete newErrors.postgraduateLoanCheckbox;
          delete newErrors.postgraduateLoanPlanType;
          break;

        default:
          break;
      }

      return newErrors;
    });

    //  Dynamic warning check based on latest values
    setWarnings(() => {
      const updatededitData = { ...editData };

      if (field.includes(".")) {
        const [parentKey, childKey] = field.split(".");
        updatededitData[parentKey] = {
          ...updatededitData[parentKey],
          [childKey]: value,
        };
      } else {
        updatededitData[field] = value;
      }

      const region = updatededitData.region;

      const newWarnings = [];

      if (editData.taxCode.startsWith("S") && region !== "SCOTLAND") {
        newWarnings.push("Tax code starts with 'S'. Please select region Scotland.");
      }

      if (editData.taxCode.startsWith("C") && region !== "WALES") {
        newWarnings.push("Tax code starts with 'C'. Please select region Wales.");
      }

      return newWarnings;
    });
  };

  const handleNext = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const currentTabId = tabs[currentIndex].id;

    let isValid = true;

    if (currentTabId === "personal") {
      isValid = validatePersonalDetailsTab();
    } else if (currentTabId === "taxNI") {
      isValid = validateForm() && validateTaxAndLoanDetails();
    } else {
      isValid = validateCurrentTab(currentTabId); // fallback for other tabs
    }

    if (!isValid) return;

    // Move to next tab
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const validateForm = () => {
    return validateCurrentTab("pay") && validateTaxAndLoanDetails() && validatePersonalDetailsTab();
  };

 const handleUpdate = async (e) => {
    e.preventDefault();
 
    const payValidation = validateCurrentTab("pay");
    const taxValidation = validateTaxAndLoanDetails();
 
    const isValid = payValidation.isValid && taxValidation.isValid;
    const allWarnings = [...payValidation.warnings, ...taxValidation.warnings];
    const allErrors = { ...payValidation.errors, ...taxValidation.errors };
 
    if (!isValid || allWarnings.length > 0) {
      setWarnings(allWarnings);
      setErrors(allErrors);
      console.warn("Form blocked due to validation issues");
      return;
    }
 
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
       
 
        // Reset states and refresh
        setIsUpdatePopup(true);
       
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
            bankName: "",
            sortCode: "",
            bankAddress: "",
            bankPostCode: "",
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
        bankName: "",
        sortCode: "",
        bankAddress: "",
        bankPostCode: "",
      },

      taxCode: "1257L",
      nationalInsuranceNumber: "",
      niLetter: "",
      region: "",
      hasEmergencyCode: false,
      hasPensionEligible: false,
      studentLoanDto: {
        hasStudentLoan: false,
        studentLoanPlanType: "NONE",
      },
      postGraduateLoanDto: {
        hasPostgraduateLoan: false,
        postgraduateLoanPlanType: "NONE",
      },
    })
  }




  const renderPersonalDetails = () => (
    <div className="space-y-6 space-x-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name <span className="text-red-600">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-600">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700">Email <span className="text-red-600">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700">Date of Birth <span className="text-red-600">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700">Employee ID <span className="text-red-600">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700">Post Code <span className="text-red-600">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700">Address <span className="text-red-600">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700">Gender <span className="text-red-600">*</span></label>
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
      <div></div>
    </div>
  )

  const renderEmployment = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employee Department <span className="text-red-600">*</span></label>
          <Select
            options={departmentOptions}
            value={departmentOptions.find((option) => option.value === editData.employeeDepartment)}
            onChange={(selectedOption) => handleInputChange('employeeDepartment', selectedOption?.value || '')}
            isDisabled={isViewing}
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
          <label className="block text-sm font-medium text-gray-700">Employment Type </label>
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
          <label className="block text-sm font-medium text-gray-700">Employment Start Date <span className="text-red-600">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700">Employment End Date</label>
          <input
            type="date"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.employmentEndDate || ""}
            onChange={(e) => handleInputChange("employmentEndDate", e.target.value)}
            disabled={isViewing}
          />
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium text-gray-700">Working Company Name <span className="text-red-600">*</span></label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border cursor-not-allowed"
            value={employers[0]?.companyDetailsDTO?.companyName}
            title="Working company name is set to the current company"
            onChange={(e) => handleInputChange("workingCompanyName", e.target.value)}
            disabled
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
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.annualIncomeOfEmployee}
            onChange={(e) => handleInputChange("annualIncomeOfEmployee", e.target.value)}
            disabled={isViewing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pay Period <span className="text-red-600">*</span></label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border cursor-not-allowed"
            value={employers[0]?.companyDetailsDTO?.currentPayPeriod}
            title="Pay period is set to the current pay period of the company"
            onChange={(e) => handleInputChange("payPeriod", e.target.value)}
            disabled
          >
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
            value={editData.bankDetailsDTO?.accountName || ""}
            onChange={(e) =>
              handleInputChange("bankDetailsDTO.accountName", e.target.value)
            }
            disabled={isViewing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Account Number <span className="text-red-600">*</span></label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.bankDetailsDTO?.accountNumber || ""}
            onChange={(e) =>
              handleInputChange("bankDetailsDTO.accountNumber", e.target.value)
            }
            disabled={isViewing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sort Code <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="00-00-00"
            maxLength={8}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.bankDetailsDTO?.sortCode || ""}
            onChange={(e) => {
              const formatted = formatSortCode(e.target.value);
              handleInputChange("bankDetailsDTO.sortCode", formatted);
            }}
          />

        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bank Name <span className="text-red-600">*</span></label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.bankDetailsDTO?.bankName || ""}
            onChange={(e) =>
              handleInputChange("bankDetailsDTO.bankName", e.target.value)
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
              handleInputChange("bankDetailsDTO.bankAddress", e.target.value)
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
              handleInputChange("bankDetailsDTO.bankPostCode", e.target.value)
            }
            disabled={isViewing}
          />
        </div>

      </div>
    </div>
  )

  const renderTaxNI = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax Year <span className="text-red-600"> *</span></label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border cursor-not-allowed"
            value={employers[0]?.companyDetailsDTO.currentTaxYear}
            onChange={(e) => handleInputChange("taxYear", e.target.value)}
            title="Tax year is auto-selected by company"
            disabled
          >
            <option value="">Select</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2024-2025">2024-2025</option>
            <option value="20 23-2024">2023-2024</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">National Insurance Number <span className="text-red-600"> *</span></label>
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
          <label className="block text-sm font-medium text-gray-700">NI Category Letter <span className="text-red-600"> *</span></label>
          <Select
            options={NICategoryLetters}
            value={NICategoryLetters.find((option) => option.value === editData.niLetter)}
            onChange={(selectedOption) => handleInputChange('niLetter', selectedOption?.value || '')}
            isDisabled={isViewing}
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
          <label className="block text-sm font-medium text-gray-700">Region <span className="text-red-600"> *</span></label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border cursor-not-allowed"
            value={employers[0]?.companyDetailsDTO?.region}
            onChange={(e) => handleInputChange("region", e.target.value)}
            title="Region is auto-selected by company"
            disabled
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax Code <span className="text-red-600"> *</span></label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.taxCode}
            onChange={(e) => handleInputChange("taxCode", e.target.value.toUpperCase())}
            disabled={isViewing}
          />
        </div>

        <div className="flex flex-row flex-nowrap">
          {editData.hasEmergencyCode &&
            <label className="flex items-center mt-6 w-full">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                checked={editData.hasEmergencyCode}
                disabled={isViewing}
                onChange={(e) => {
                  setEditData(prev => ({
                    ...prev,
                    hasEmergencyCode: e.target.checked,
                  }));
                }}
              />
              <span className="ml-2 text-sm text-gray-700 font-medium">
                Emergency Tax Code
              </span>
            </label>
          }

          <label className="flex items-center mt-6 w-full">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              checked={editData.hasPensionEligible}
              disabled={isViewing}
              onChange={(e) =>
                handleInputChange("hasPensionEligible", e.target.checked)
              }
            />
            <span className="ml-2 text-sm text-gray-700 font-medium">
              Eligible for Auto Enrolment
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div>
          <label className="flex items-center mt-6">
            <input
              type="checkbox"
              checked={editData.studentLoanDto.hasStudentLoan}
              disabled={isViewing}
              onChange={(e) =>
                setEditData(prev => ({
                  ...prev,
                  studentLoanDto: {
                    ...prev.studentLoanDto,
                    hasStudentLoan: e.target.checked,
                  },
                }))
              }
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700 w-full">
              Student Loan
            </span>
          </label>
          <div>
            {editData.studentLoanDto.hasStudentLoan && (
              <>

                <select
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                  value={editData.studentLoanDto.studentLoanPlanType}
                  disabled={isViewing}
                  onChange={(e) =>
                    handleInputChange("studentLoanDto.studentLoanPlanType", e.target.value)
                  }
                >
                  <option value="NONE">None</option>
                  <option value="STUDENT_LOAN_PLAN_1">Plan 1</option>
                  <option value="STUDENT_LOAN_PLAN_2">Plan 2</option>
                  <option value="STUDENT_LOAN_PLAN_4">Plan 4</option>
                </select>
              </>
            )}
          </div>
        </div>

        <div>
          <label className="flex items-center mt-6">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
              checked={editData.postGraduateLoanDto.hasPostgraduateLoan}
              disabled={isViewing}
              onChange={(e) =>
                setEditData(prev => ({
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
          {editData.postGraduateLoanDto.hasPostgraduateLoan && (
            <div >
              <select
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={editData.postGraduateLoanDto.postgraduateLoanPlanType}
                disabled={isViewing}
                onChange={(e) =>
                  handleInputChange("postGraduateLoanDto.postgraduateLoanPlanType", e.target.value)
                }
              >
                <option value="NONE">None</option>
                <option value="POSTGRADUATE_LOAN_PLAN_3">Postgraduate Loan Plan 3</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div >
          <select disabled={isViewing} value={selectedDocument} onChange={(e) => handleDocumentsChange(e)}>
            <option value="">Upload Document</option>
            <option value="p45">P45</option>
            <option value="starterChecklist">Starter Checklist</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {editData.hasP45DocumentSubmitted && <div>
            <label className="block text-sm font-medium  text-gray-700">Upload P45 Document</label>
            <input type="file" disabled={isViewing} onChange={(e) => setP45Form(e.target.files[0])} className="mt-1 block  bg-blue-100 text-sm border-1 border-blue-500 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {editData.p45Document && (
              <p className="text-gray-500 text-xs mt-3">
                Previously uploaded: <strong>{editData.p45Document.split("/").pop()}</strong>
              </p>
            )}
          </div>}


          {editData.hasStarterChecklistDocumentSubmitted && <div>
            <label className="block text-sm font-medium text-gray-700">Upload Starter Checklist</label>
            <input type="file" onChange={(e) => setStarterChecklist(e.target.files[0])} className="mt-1 block  bg-blue-100 text-sm border-1 border-blue-500 rounded-md shadow-sm px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {editData.starterChecklistDocument && (
              <p className="text-gray-500 text-xs mt-3">
                Previously uploaded: <strong>{editData.starterChecklistDocument.split("/").pop()}</strong>
              </p>
            )}
          </div>}

        </div>
      </div>
      {editData.hasP45DocumentSubmitted && <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

        <div>
          <label className="block text-sm font-medium text-gray-700">Previous Tax Code <span className="text-red-600"></span></label>
          <input
            type="text"
            disabled={isViewing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.previousEmploymentDataDTO.previousTaxCode}

            onChange={(e) => handleInputChange("previousEmploymentDataDTO.previousTaxCode", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Previous Total Pay To Date <span className="text-red-600"></span></label>
          <input
            type="text"
            disabled={isViewing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.previousEmploymentDataDTO.previousTotalPayToDate}


            onChange={(e) => handleInputChange("previousEmploymentDataDTO.previousTotalPayToDate", e.target.value)}
          />
        </div>


      </div>}
      {editData.hasP45DocumentSubmitted && <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

        <div>
          <label className="block text-sm font-medium text-gray-700">Previous Total Tax To Date <span className="text-red-600"></span></label>
          <input
            type="text"
            disabled={isViewing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.previousEmploymentDataDTO.previousTotalTaxToDate}
            onChange={(e) => handleInputChange("previousEmploymentDataDTO.previousTotalTaxToDate", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Previous Employment EndDate <span className="text-red-600">*</span></label>
          <input
            type="date"
            disabled={isViewing} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editData.previousEmploymentDataDTO.previousEmploymentEndDate}
            onChange={(e) => handleInputChange("previousEmploymentDataDTO.previousEmploymentEndDate", e.target.value)}
          />
        </div>


      </div>}
    </div>

  )
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
                    className={`${activeTab === tab.id
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                      } group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full text-left`}
                  >

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
                                const currentTabId = tabs[currentIndex].id;
                                let isValid = true;

                                if (currentTabId === "personal") {
                                  isValid = validatePersonalDetailsTab();
                                } else if (currentTabId === "taxNI") {
                                  isValid = validateTaxAndLoanDetails();
                                } else {
                                  isValid = validateCurrentTab(currentTabId);
                                }
                                if (!isValid) return;
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
                            </button>)}             </div>
                      </div>          </div>)}              </div>             </form>           </div>         </div>

        </div>     </div>)
  }

  return (
    <>
      {isDelete && <ModalWrapper>
        <div className="flex flex-col justify-center items-center" >
          <p>Are you sure want to delete <span className="font-bold">{employeeSelectToDelete.firstName + " " + employeeSelectToDelete.lastName}</span>?</p>
          <div className="flex flex-row justify-start space-x-5"><button className="bg-red-600 w-12" onClick={() => handleDelete(employeeSelectToDelete.id)}>Yes</button>
            <button className="bg-green-700  w-12" onClick={() => setIsDelete(false)}>No</button>
          </div>
        </div>
      </ModalWrapper>}

      {isUpdatePopup && <ModalWrapper>
        <div className="flex flex-col justify-center items-center" >
          <p>Employee Details updated successfully. </p>
          <div className="flex flex-row justify-start space-x-5">
            <button className="bg-green-700  w-12" onClick={() => {
              setIsUpdatePopup(false);
              setIsEditing(false);
            }}>Okay</button>
          </div>
        </div>
      </ModalWrapper>}

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
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            {/* Sidebar Tabs */}
            <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
              <nav className="space-y-1">
                {employeeTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full text-left ${selectedTab === tab.id
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </aside>


            <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
              {employees.length === 0 ? (
                <div className="text-center">
                  {/* <h3 className="mt-2 text-sm font-medium text-gray-900">No employees</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new employee.</p> */}
                  {!loading && employees.length === 0 && (
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedTab === "active" && "There are no active employees now."}
                      {selectedTab === "leaving" && "There are no leaving employees now."}
                      {selectedTab === "inactive" && "There are no inactive employees now."}
                      {selectedTab === "all" && "There are no employees in the system."}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md overflow-x-auto ">
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
                            <div className="flex space-x-2 justify-end w-full sm:w-auto">
                              <button
                                onClick={() => handleView(employee.employeeId)}
                                className="inline-flex items-center px-3 py-2 ml-10 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                View
                              </button>
                              {["active", "leaving"].includes(selectedTab) && (
                                <button
                                  onClick={() => handleEdit(employee.employeeId)}
                                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Edit
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setIsDelete(true)
                                  setEmployeeSelectToDelete(employee)
                                }}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                        </div>              </li>))}       </ul>      </div>)}   </div> </div> </div>  </div>
    </>
  )
}

export default EmployeeDetails;
