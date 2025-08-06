import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompanyDetails = () => {
  const [isIntialUpdate, setIsIntialUpdate] = useState(false);

  const initialFormData = {

    companyDetailsDTO: {
      companyName:"",
      companyAddress:"",
      companyPostCode:"",
      companyLogo:"",
      currentTaxYear:"",
      currentPayPeriod:"MONTHLY",
      region:"ENGLAND",
      payDate:"",
    },

    taxOfficeDTO: {
      payeReference: "",
      accountsOfficeReference: "",
      paymentMethod: "ONLINE",
      uniqueTaxRef: "",
      corporationTaxRef: "",
      payrollGivingRef: "",
      datePAYESchemeStarted: "",
      datePAYESchemeCeased: "",
      claimEmploymentAllowance: false,
    },
    bankDetailsDTO: {
      accountName: "",
      accountNumber: "",
      sortCode: "",
      bankName: "",
      bankAddress: "",
      bankPostCode: "",
    },

    termsDTO: {
      hoursWorkedPerWeek: "",
      weeksNoticeRequired: "",
      daysSicknessOnFullPay: "",
      maleRetirementAge: "",
      femaleRetirementAge: "",
      daysHolidayPerYear: "",
      maxDaysToCarryOver: "",
    },
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [submitError, setSubmitError] = useState("");
  const [validateError, setValidateError] = useState({});

  const tabs = [
    { id: "basic", name: "Company Details" },
    { id: "company", name: "Tax Office Details" },
    { id: "financial", name: "Bank Details" },
    { id: "terms", name: "Terms & Conditions" },
  ];

  useEffect(() => {
  console.log("companyDetailsDTO updated:", formData.companyDetailsDTO);
}, [formData.companyDetailsDTO]);


  useEffect(() => {
    const fetchEmployerData = async () => {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/employer/allEmployers`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setSubmitError("");
        if (response.status === 200 && response.data) {
          if (response.data.length > 0) {
            setFormData(response.data[0]);
            setSuccess("Employer data loaded from backend.");
            console.log("Anitha: ",response.data);
          } else {
            setIsIntialUpdate(true);
          }
        } else {
          setFormData(initialFormData);
          setError("No data found, showing default empty form.");
        }
      } catch (error) {
         if (error.response?.status === 409) {
            setSubmitError(error.response.data.message);
          } else if (error.response?.status === 400){
            setSubmitError(error.response.data.message);
          } else if (error.response?. status === 404){
            setSubmitError(error.response.data.message);
          } else if (error.response?.status === 422){
            setSubmitError(error.response.data.message);
          } else if (error.response?.status === 500){
            setSubmitError(error.response.data.message);
          }
           else {
            setSubmitError("Something went wrong while adding new Employee.");
          }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerData();
  }, []);

  const validateCompanyDetailsTab=()=>{
    const newErrors={};
    if(!formData.companyDetailsDTO?.companyName){
      newErrors.companyName = "Company name is required";
    }
    if(!formData.companyDetailsDTO?.currentTaxYear){
      newErrors.currentTaxYear = "Tax year is required"
    }
    if(!formData.companyDetailsDTO?.companyAddress){
      newErrors.companyAddress = "Company address is required";
    }
    if(!formData.companyDetailsDTO?.companyPostCode){
      newErrors.companyPostCode = "Company post code is required";
    }
    if(!formData.companyDetailsDTO?.currentPayPeriod){
      newErrors.currentPayPeriod = "Pay period is required";
    }
    if(!formData.companyDetailsDTO?.region){
      newErrors.region = "Region is required";
    }
    if(!formData.companyDetailsDTO?.payDate){
      newErrors.payDate = "Paye date is required";
    }
    setValidateError(newErrors);
    return Object.keys(newErrors).length === 0;
  }

const validateTaxOfficeDetailsTab=()=>{
  const newErrors = {};
  if(!formData.taxOfficeDTO?.datePAYESchemeStarted){
    newErrors.datePAYESchemeStarted = "Date PAYE Scheme Started is required";
  }
  if(!formData.taxOfficeDTO?.payeReference){
    newErrors.payeReference = "Paye reference is required";
  }
  if(!formData.taxOfficeDTO?.accountsOfficeReference){
    newErrors.accountsOfficeReference = "Accounts Office Reference is required";
  }
  if(!formData.taxOfficeDTO?.payrollGivingRef){
    newErrors.payrollGivingRef = "payroll Giving Reference Id is required"
  }
  setValidateError(newErrors);
  return Object.keys(newErrors).length === 0;
}

const validateBankDetailsTab=()=>{
  const newErrors={};
  if(!formData.bankDetailsDTO?.accountName){
    newErrors.accountName="Account name is required";
  }
  if(!formData.bankDetailsDTO?.accountNumber){
    newErrors.accountNumber="Account Number is required";
  } else if(formData.bankDetailsDTO?.accountNumber.length !== 8){
    newErrors.accountNumber= "Account Number must be 8 digits";
  }
  if(!formData.bankDetailsDTO?.sortCode){
    newErrors.sortCode="Sort code is required";
  } else if(!/^\d{2}-\d{2}-\d{2}$/.test(formData.bankDetailsDTO.sortCode)){
    newErrors.sortCode="Sort code must be in the format 00-00-00";
  } 
  if(!formData.bankDetailsDTO?.bankName){
    newErrors.bankName = "Bank name is required";
  }

  setValidateError(newErrors);
  return Object.keys(newErrors).length === 0;
}

const validateTermsAndConditionsTab=()=>{
  const newErrors={};
  if(!formData.termsDTO?.femaleRetirementAge){
    newErrors.femaleRetirementAge= "female Retirement Age is required";
  }
  if(!formData.termsDTO?.maleRetirementAge){
    newErrors.maleRetirementAge= "male Retirement Age is required";
  }
  setValidateError(newErrors);
  return Object.keys(newErrors).length === 0;
}

  const validateForm = () =>{
    return validateCompanyDetailsTab() && validateTaxOfficeDetailsTab() && validateBankDetailsTab() && validateTermsAndConditionsTab();
  }

  const handleInputChange = (field, value) => {
    if (field.startsWith("bankDetailsDTO.")) {
      const bankField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        bankDetailsDTO: { ...prev.bankDetailsDTO, [bankField]: value },
      }));
    } else if (field.startsWith("taxOfficeDTO.")) {
      const taxField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        taxOfficeDTO: { ...prev.taxOfficeDTO, [taxField]: value },
      }));
    } else if (field.startsWith("termsDTO.")) {
      const termsField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        termsDTO: { ...prev.termsDTO, [termsField]: value },
      }));
       } else if (field.startsWith("companyDetailsDTO.")) {
    const companyField = field.split(".")[1];
    setFormData((prev) => ({
      ...prev,
      companyDetailsDTO: {
        ...prev.companyDetailsDTO,
        [companyField]: value,
      },
    }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    setValidateError((prevsErrors)=>{
      const newErrors={...prevsErrors};

      switch(field){
        case "companyDetailsDTO.companyName":
          if(value.trim() !== "") delete newErrors.companyName;
          break;  
      }
       return newErrors;
    }) 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const isFormValid = validateForm();
    const isCompanyDetailsValid = validateCompanyDetailsTab();
    const isTaxOfficeDetailsValid = validateTaxOfficeDetailsTab();
    const isBankDetailsValid = validateBankDetailsTab();
    const isTermsAndConditionsValid= validateTermsAndConditionsTab();
    if(!isFormValid || !isCompanyDetailsValid || !isTaxOfficeDetailsValid || !isBankDetailsValid || !isTermsAndConditionsValid || Object.keys(validateError).length > 0){
      console.log("form blocked due to errors.");
    }

    if (isIntialUpdate) {
      try {
        const response = await axios.post(
          `http://localhost:8081/api/v1/employer/register/employers`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
 setSubmitError("")
        if (response.status === 200) {
          setSuccess("Employer details updated successfully!");
          alert("Employer details updated successfully!");
          localStorage.setItem("companyDetailsDTO.companyName", formData.companyDetailsDTO.companyName);
        } else {
          setError("Failed to update employer details.");
          alert("Failed to update employer details.");
        }
         navigate("/employer-dashboard"); 
      } catch (error) {
        console.error("Error updating employer details", error);
         if (error.response?.status === 409) {
            setSubmitError(error.response.data.message);
          } else if (error.response?.status === 400){
            setSubmitError(error.response.data.message);
          } else if (error.response?. status === 404){
            setSubmitError(error.response.data.message);
          } else if (error.response?.status === 422){
            setSubmitError(error.response.data.message);
          } else if (error.response?.status === 500){
            setSubmitError(error.response.data.message);
          }
           else {
            setSubmitError("Something went wrong while adding new Employee.");
          }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await axios.put(
          `http://localhost:8081/api/v1/employer/update/employers/${formData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
 setSubmitError("")
        if (response.status === 200) {
          setSuccess("Employer details updated successfully!");
          alert("Employer details updated successfully!");
          localStorage.setItem("companyName", formData.companyDetailsDTO.companyName);
          localStorage.setItem("currentTaxYear", formData.companyDetailsDTO.currentTaxYear);
          localStorage.setItem("region", formData.companyDetailsDTO.region);
          localStorage.setItem("currentPayPeriod",formData.companyDetailsDTO.currentPayPeriod);
        } else {
          setError("Failed to update employer details.");
          alert("Failed to update employer details.");
        }
         navigate("/employer-dashboard"); 
      } catch (error) {
        console.error("Error updating employer details", error);
         if (error.response?.status === 409) {
            setSubmitError(error.response.data.message);
          } else if (error.response?.status === 400){
            setSubmitError(error.response.data.message);
          } else if (error.response?. status === 404){
            setSubmitError(error.response.data.message);
          } else if (error.response?.status === 422){
            setSubmitError(error.response.data.message);
          } else if (error.response?.status === 500){
            setSubmitError(error.response.data.message);
          }
           else {
            setSubmitError("Something went wrong while adding new Employee.");
          }
      } finally {
        setLoading(false);
      }
    }
  };

 const renderCompanyDetail = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Company Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.companyDetailsDTO.companyName}
            onChange={(e) => handleInputChange("companyDetailsDTO.companyName", e.target.value)}
            placeholder="Enter company name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax Year <span className="text-red-600">*</span></label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.companyDetailsDTO.currentTaxYear}
            onChange={(e) => handleInputChange("companyDetailsDTO.currentTaxYear", e.target.value)}
          >
            <option value="">Select</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2023-2024">2023-2024</option>
          </select>
        </div>
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.companyDetailsDTO.companyAddress}
            onChange={(e) =>
              handleInputChange("companyDetailsDTO.companyAddress", e.target.value)
            }
            placeholder="Enter address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Post Code <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.companyDetailsDTO.companyPostCode}
            onChange={(e) =>
              handleInputChange("companyDetailsDTO.companyPostCode", e.target.value)
            }
            placeholder="Enter post code"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pay Period <span className="text-red-600">*</span>
          </label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.companyDetailsDTO.currentPayPeriod}
            onChange={(e) => handleInputChange("companyDetailsDTO.currentPayPeriod", e.target.value)}
          >
            <option value="" >Select</option>
             <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Region <span className="text-red-600">*</span>
          </label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.companyDetailsDTO.region}
            onChange={(e) => handleInputChange("companyDetailsDTO.region", e.target.value)}
          >
            <option value="">Select</option>
            <option value="ENGLAND">England</option>
            <option value="NORTHERN_IRELAND">Northern Ireland</option>
            <option value="SCOTLAND">Scotland</option>
            <option value="WALES">Wales</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div>
          <label className="block text-sm font-medium text-gray-700">
            Pay Date <span className="text-red-600">*</span>
          </label>
         <input
  type="date"
  required
  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
 value={formData.companyDetailsDTO.payDate}
  onChange={(e) => {
    handleInputChange("companyDetailsDTO.payDate", e.target.value);
  }}
  placeholder="Select pay date"
/>

        </div>
      </div>  
    </div>
  );
  const renderCompanyDetails = () => (
      <div className="space-y-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date PAYE Scheme Started <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.taxOfficeDTO.datePAYESchemeStarted}
            onChange={(e) =>
              handleInputChange("taxOfficeDTO.datePAYESchemeStarted", e.target.value)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date PAYE Scheme Ceased
          </label>
          <input
            type="date"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.taxOfficeDTO.datePAYESchemeCeased}
            onChange={(e) =>
              handleInputChange("taxOfficeDTO.datePAYESchemeCeased", e.target.value)
            }
          />
        </div>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              PAYE Reference <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.taxOfficeDTO.payeReference}
              onChange={(e) =>
                handleInputChange("taxOfficeDTO.payeReference", e.target.value)
              }
              placeholder="123/A56789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Accounts Office Reference <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.taxOfficeDTO.accountsOfficeReference}
              onChange={(e) =>
                handleInputChange(
                  "taxOfficeDTO.accountsOfficeReference",
                  e.target.value
                )
              }
              placeholder="123PA12345678"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unique Tax Ref
            </label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.taxOfficeDTO.uniqueTaxRef}
              onChange={(e) =>
                handleInputChange("taxOfficeDTO.uniqueTaxRef", e.target.value)
              }
              placeholder="Enter Unique Tax Ref"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Corporation Tax Ref
            </label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.taxOfficeDTO.corporationTaxRef}
              onChange={(e) =>
                handleInputChange(
                  "taxOfficeDTO.corporationTaxRef",
                  e.target.value
                )
              }
              placeholder="Enter Corporation Tax Ref"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payroll Giving Reference Id <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.taxOfficeDTO.payrollGivingRef}
              onChange={(e) =>
                handleInputChange(
                  "taxOfficeDTO.payrollGivingRef",
                  e.target.value
                )
              }
              placeholder="Enter Payroll Giving Ref"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.taxOfficeDTO.paymentMethod}
              onChange={(e) =>
                handleInputChange("taxOfficeDTO.paymentMethod", e.target.value)
              }
            >
              <option value="ONLINE">Online</option>
              <option value="DIRECT_DEBIT">Direct Debit</option>
              <option value="CHEQUE">Cheque</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.taxOfficeDTO.claimEmploymentAllowance}
              onChange={(e) =>
                handleInputChange(
                  "taxOfficeDTO.claimEmploymentAllowance",
                  e.target.checked
                )
              }
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Claim Employment Allowance
            </span>
          </label>
        </div>
      </div>
  );
  const renderFinancialDetails = () => (
    <div className="space-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bankDetailsDTO.accountName}
                onChange={(e) =>
                  handleInputChange(
                    "bankDetailsDTO.accountName",
                    e.target.value
                  )
                }
                placeholder="Enter account name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bankDetailsDTO.accountNumber}
                onChange={(e) =>
                  handleInputChange(
                    "bankDetailsDTO.accountNumber",
                    e.target.value
                  )
                }
                placeholder="Enter account number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
  <label className="block text-sm font-medium text-gray-700">
    Sort Code <span className="text-red-600">*</span>
  </label>
  <input
    type="text"
    placeholder="00-00-00"
    maxLength={8} // 6 digits + 2 hyphens
    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
    value={formData.bankDetailsDTO.sortCode}
    onChange={(e) => {
      let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
      if (value.length > 6) value = value.slice(0, 6);

      // Add hyphens after every 2 digits
      const formatted =
        value.slice(0, 2) +
        (value.length > 2 ? "-" + value.slice(2, 4) : "") +
        (value.length > 4 ? "-" + value.slice(4, 6) : "");

      setFormData((prev) => ({
        ...prev,
        bankDetailsDTO: {
          ...prev.bankDetailsDTO,
          sortCode: formatted,
        },
      }));
    }}
  />
</div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bankDetailsDTO.bankName}
                onChange={(e) =>
                  handleInputChange("bankDetailsDTO.bankName", e.target.value)
                }
                placeholder="Enter bank name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Address
              </label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bankDetailsDTO.bankAddress}
                onChange={(e) =>
                  handleInputChange(
                    "bankDetailsDTO.bankAddress",
                    e.target.value
                  )
                }
                placeholder="Enter bank address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Post Code
              </label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bankDetailsDTO.bankPostCode}
                onChange={(e) =>
                  handleInputChange(
                    "bankDetailsDTO.bankPostCode",
                    e.target.value
                  )
                }
                placeholder="Enter bank post code"
              />
            </div>
          </div>
        </div>
      </div>
    
  );

  const renderTermsConditions = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Hours Worked Per Week
          </label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.termsDTO.hoursWorkedPerWeek}
            onChange={(e) =>
              handleInputChange(
                "termsDTO.hoursWorkedPerWeek",
                Number.parseInt(e.target.value) || 0
              )
            }
            // placeholder="40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Weeks Notice Required
          </label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.termsDTO.weeksNoticeRequired}
            onChange={(e) =>
              handleInputChange(
                "termsDTO.weeksNoticeRequired",
                Number.parseInt(e.target.value) || 0
              )
            }
            // placeholder="4"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Days Sickness on Full Pay
          </label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.termsDTO.daysSicknessOnFullPay}
            onChange={(e) =>
              handleInputChange(
                "termsDTO.daysSicknessOnFullPay",
                Number.parseInt(e.target.value) || 0
              )
            }
            // placeholder="30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Days Holiday Per Year
          </label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.termsDTO.daysHolidayPerYear}
            onChange={(e) =>
              handleInputChange(
                "termsDTO.daysHolidayPerYear",
                Number.parseInt(e.target.value) || 0
              )
            }
            // placeholder="28"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Male Retirement Age <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.termsDTO?.maleRetirementAge}
            onChange={(e) =>
              handleInputChange(
                "termsDTO.maleRetirementAge",
                Number.parseInt(e.target.value) || 0
              )
            }
            // placeholder="65"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Female Retirement Age <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.termsDTO?.femaleRetirementAge}
            onChange={(e) =>
              handleInputChange(
                "termsDTO.femaleRetirementAge",
                Number.parseInt(e.target.value) || 0
              )
            }
            // placeholder="65"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Days to Carry Over
          </label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.termsDTO.maxDaysToCarryOver}
            onChange={(e) =>
              handleInputChange(
                "termsDTO.maxDaysToCarryOver",
                Number.parseInt(e.target.value) || 0
              )
            }
            // placeholder="28"
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return renderCompanyDetail();
      case "company":
        return renderCompanyDetails();
      case "financial":
        return renderFinancialDetails();
      case "terms":
        return renderTermsConditions();
      default:
        return renderCompanyDetail();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Company Details
              </h1>
              <p className="text-sm text-gray-600">
                Manage your company information and settings
              </p>
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

      {/* Alerts */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        </div>
      )} */}

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
                      activeTab === tab.id
                        ? "text-indigo-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    } flex-shrink-0 -ml-1 mr-3`}
                  >
                    {/* {getIcon(tab.icon)} */}
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
                {/* {Object.values(validateError).length > 0 && (
                  <div className="bg-red-100 text-red-800 rounded mb-4 p-2">
                    {Object.entries(validateError).map(([key,value],i)=>(
                      <div key={i}>❌ {value}</div>
                    ))}
                  </div>
                )} */}

                {validateError && Object.values(validateError).length > 0 && (
                  <div className="bg-red-100 text-red-800 p-2 rounded mb-4">
                    {Object.entries(validateError).map(([key, msg], i) => (
                      <div key={i}>❌ {msg}
                      </div>
                    ))}
                  </div>
                )}


{submitError && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mt-4 ml-5 mr-5">
    {submitError}
  </div>
)}

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        const currentIndex = tabs.findIndex(
                          (tab) => tab.id === activeTab
                        );
                        if (currentIndex > 0) {
                          setActiveTab(tabs[currentIndex - 1].id);
                        }
                      }}
                      disabled={activeTab === "basic"}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <div className="space-x-3">
                      {activeTab !== "terms" && (
                        <button
                          type="button"
                          onClick={() => {
                            const currentIndex = tabs.findIndex(
                              (tab) => tab.id === activeTab
                            );
                            const currentTabId = tabs[currentIndex].id;
                            let isValid=true;

                            if(currentTabId === "basic"){
                              isValid=validateCompanyDetailsTab();
                            } else if(currentTabId === "company"){
                              isValid=validateTaxOfficeDetailsTab();
                            } else if(currentTabId === "financial"){
                              isValid=validateBankDetailsTab();
                            } else if(currentTabId === "terms"){
                              isValid=validateTermsAndConditionsTab();
                            }
                            if(!isValid) return;
                            setActiveTab(tabs[currentIndex + 1].id);
                          }}
                          className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Next
                        </button>
                      )}

                      {activeTab === "terms" && (
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          {loading ? "Saving..." : "Save Details"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompanyDetails;
