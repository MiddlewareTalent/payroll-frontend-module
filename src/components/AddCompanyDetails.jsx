import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const AddCompanyDetails = () => {
  const [formData, setFormData] = useState({
    employerName: "",
    employerId: "",
    employerAddress: "",
    employerPostCode: "",
    employerTelephone: "",
    employerEmail: "",
    contactForename: "",
    contactSurname: "",
    pdfPassword: "",
    userReference: "",
    datePAYESchemeStarted: "",
    datePAYESchemeCeased: "",
    rtiBatchProcessing: false,
    previousWorksNumberUnknown: false,
    ensureUniqueWorksNumber: false,
    warnBelowNationalMinimumWage: false,
    showAgeOnHourlyTab: false,
    companyLogo: "",
    companyName: "",
    taxYear: "",
    payPeriod: "MONTHLY",
    region: "ENGLAND",

    taxOfficeDto: {
      payeReference: "",
      accountsOfficeReference: "",
      paymentMethod: "ONLINE",
      uniqueTaxRef: "",
      corporationTaxRef: "",
      payrollGivingRef: "",
      serQualifiedThisYear: true,
      serQualifiedLastYear: false,
      noRtiDueWarnings: true,
      claimNICAllowance: false,
      claimEmploymentAllowance: true,
      childSupportRef: "",
    },
    bankDetailsDTO: {
      accountName: "",
      accountNumber: "",
      sortCode: "",
      bankName: "",
      paymentReference: "",
      bankAddress: "",
      bankPostCode: "",
      telephone: "",
      paymentLeadDays: "",
      isRTIReturnsIncluded: false,
    },

    
    termsDto: {
      hoursWorkedPerWeek: 40,
      isPaidOvertime: false,
      weeksNoticeRequired: 4,
      daysSicknessOnFullPay: 30,
      maleRetirementAge: 65,
      femaleRetirementAge: 65,
      mayJoinPensionScheme: false,
      daysHolidayPerYear: 28,
      maxDaysToCarryOver: 28,
    },
  })
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("basic")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: "basic", name: "Basic Information" },
    { id: "contact", name: "Contact Details" },
    { id: "company", name: "Company Details" },
    { id: "system", name: "System Settings" },
    { id: "financial", name: "Financial Details" },
    { id: "terms", name: "Terms & Conditions" },
  ]

  const handleInputChange = (field, value) => {
    if (field.startsWith("bankDetailsDTO.")) {
      const bankField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        bankDetailsDTO: {
          ...prev.bankDetailsDTO,
          [bankField]: value,
        },
      }))
    } else if (field.startsWith("taxOfficeDto.")) {
      const taxField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        taxOfficeDto: {
          ...prev.taxOfficeDto,
          [taxField]: value,
        },
      }))
    } else if (field.startsWith("termsDto.")) {
      const termsField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        termsDto: {
          ...prev.termsDto,
          [termsField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  // Move to next tab if not last tab
  if (activeTab !== "terms") {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
    return;
  }

  setLoading(true);

  try {
    console.log("Submitting data:", formData);

    const response = await axios.post(
      "http://localhost:8080/api/v1/employer/register/employers",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      setSuccess("Employer details saved successfully!");
      alert("Employer details saved successfully!");
      // Optional: clear form or redirect here
    } else {
      setError("Failed to save employer details.");
      alert("Failed to save employer details.");
    }
  } catch (err) {
    console.error(err);
    setError("Failed to save employer details.");
    alert("Error saving employer details.");
  } finally {
    setLoading(false);
  }
};


  // const getIcon = (iconName) => {
  //   const icons = {
  //     user: (
  //       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           strokeWidth={2}
  //           d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  //         />
  //       </svg>
  //     ),
  //     briefcase: (
  //       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           strokeWidth={2}
  //           d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8"
  //         />
  //       </svg>
  //     ),
  //     currency: (
  //       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           strokeWidth={2}
  //           d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
  //         />
  //       </svg>
  //     ),
  //     document: (
  //       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           strokeWidth={2}
  //           d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
  //         />
  //       </svg>
  //     ),
  //     shield: (
  //       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //         <path
  //           strokeLinecap="round"
  //           strokeLinejoin="round"
  //           strokeWidth={2}
  //           d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
  //         />
  //       </svg>
  //     ),
  //   }
  //   return icons[iconName] || icons.user
  // }

  const renderBasicInformation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employer Name </label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employerName}
            onChange={(e) => handleInputChange("employerName", e.target.value)}
            placeholder="Enter employer name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Employer ID </label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employerId}
            onChange={(e) => handleInputChange("employerId", e.target.value)}
            placeholder="Enter employer ID"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employerAddress}
            onChange={(e) => handleInputChange("employerAddress", e.target.value)}
            placeholder="Enter address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Post Code</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employerPostCode}
            onChange={(e) => handleInputChange("employerPostCode", e.target.value)}
            placeholder="Enter post code"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Telephone </label>
          <input
            type="tel"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employerTelephone}
            onChange={(e) => handleInputChange("employerTelephone", e.target.value)}
            placeholder="Enter telephone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email </label>
          <input
            type="email"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.employerEmail}
            onChange={(e) => handleInputChange("employerEmail", e.target.value)}
            placeholder="Enter email address"
          />
        </div>
      </div>
    </div>
  )

  const renderContactDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Forename</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.contactForename}
            onChange={(e) => handleInputChange("contactForename", e.target.value)}
            placeholder="Enter first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Surname</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.contactSurname}
            onChange={(e) => handleInputChange("contactSurname", e.target.value)}
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">PDF Password</label>
          <input
            type="password"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.pdfPassword}
            onChange={(e) => handleInputChange("pdfPassword", e.target.value)}
            placeholder="Enter PDF password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">User Reference</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.userReference}
            onChange={(e) => handleInputChange("userReference", e.target.value)}
            placeholder="Enter user reference"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date PAYE Scheme Started</label>
          <input
            type="date"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.datePAYESchemeStarted}
            onChange={(e) => handleInputChange("datePAYESchemeStarted", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date PAYE Scheme Ceased</label>
          <input
            type="date"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.datePAYESchemeCeased}
            onChange={(e) => handleInputChange("datePAYESchemeCeased", e.target.value)}
          />
        </div>
      </div>
    </div>
  )

  const renderCompanyDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.companyName}
            onChange={(e) => handleInputChange("companyName", e.target.value)}
            placeholder="Enter company name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax Year</label>
          <input
            type="text"
            pattern="^\d{4}-\d{4}$"
            placeholder="2025-2026"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.taxYear}
            onChange={(e) => handleInputChange("taxYear", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pay Period</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.payPeriod}
            onChange={(e) => handleInputChange("payPeriod", e.target.value)}
          >
            <option value="MONTHLY">Monthly</option>
            <option value="WEEKLY">Weekly</option>
            <option value="FORTNIGHTLY">Fortnightly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Region</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.region}
            onChange={(e) => handleInputChange("region", e.target.value)}
          >
            <option value="ENGLAND">England</option>
            <option value="NORTHERN_IRELAND">Northern Ireland</option>
            <option value="SCOTLAND">Scotland</option>
            <option value="WALES">Wales</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Tax Office Details</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">PAYE Reference</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.taxOfficeDto.payeReference}
              onChange={(e) => handleInputChange("taxOfficeDto.payeReference", e.target.value)}
              placeholder="Enter PAYE Reference"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Accounts Office Reference</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.taxOfficeDto.accountsOfficeReference}
              onChange={(e) => handleInputChange("taxOfficeDto.accountsOfficeReference", e.target.value)}
              placeholder="Enter Accounts Office Reference"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Unique Tax Ref</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.taxOfficeDto.uniqueTaxRef}
              onChange={(e) => handleInputChange("taxOfficeDto.uniqueTaxRef", e.target.value)}
              placeholder="Enter Unique Tax Ref"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Corporation Tax Ref</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.taxOfficeDto.corporationTaxRef}
              onChange={(e) => handleInputChange("taxOfficeDto.corporationTaxRef", e.target.value)}
              placeholder="Enter Corporation Tax Ref"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payroll Giving Ref</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.taxOfficeDto.payrollGivingRef}
              onChange={(e) => handleInputChange("taxOfficeDto.payrollGivingRef", e.target.value)}
              placeholder="Enter Payroll Giving Ref"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.taxOfficeDto.paymentMethod}
              onChange={(e) => handleInputChange("taxOfficeDto.paymentMethod", e.target.value)}
            >
              <option value="ONLINE">Online</option>
              <option value="DIRECT_DEBIT">Direct Debit</option>
              <option value="CHEQUE">Cheque</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Child Support Reference</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={formData.taxOfficeDto.childSupportRef}
              onChange={(e) => handleInputChange("taxOfficeDto.childSupportRef", e.target.value)}
              placeholder="Enter Child Support Reference"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.taxOfficeDto.serQualifiedThisYear}
              onChange={(e) => handleInputChange("taxOfficeDto.serQualifiedThisYear", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Ser Qualified This Year</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.taxOfficeDto.serQualifiedLastYear}
              onChange={(e) => handleInputChange("taxOfficeDto.serQualifiedLastYear", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Ser Qualified Last Year</label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.taxOfficeDto.noRtiDueWarnings}
              onChange={(e) => handleInputChange("taxOfficeDto.noRtiDueWarnings", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">No RTI Due Warnings</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.taxOfficeDto.claimNICAllowance}
              onChange={(e) => handleInputChange("taxOfficeDto.claimNICAllowance", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Claim NIC Allowance</label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.taxOfficeDto.claimEmploymentAllowance}
              onChange={(e) => handleInputChange("taxOfficeDto.claimEmploymentAllowance", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Claim Employment Allowance</label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      {/* <h4 className="text-md font-medium text-gray-900">System Preferences</h4> */}
      <div className="space-y-4">
        {[
          { name: "rtiBatchProcessing", label: "RTI Batch Processing" },
          { name: "previousWorksNumberUnknown", label: "Previous Works Number Unknown" },
          { name: "ensureUniqueWorksNumber", label: "Ensure Unique Works Number" },
          { name: "warnBelowNationalMinimumWage", label: "Warn Below National Minimum Wage" },
          { name: "showAgeOnHourlyTab", label: "Show Age On Hourly Tab" },
        ].map((preference) => (
          <div key={preference.name} className="flex items-center">
            <input
              type="checkbox"
              checked={formData[preference.name]}
              onChange={(e) => handleInputChange(preference.name, e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">{preference.label}</label>
          </div>
        ))}
      </div>
    </div>
  )

  const renderFinancialDetails = () => (
    <div className="space-y-8">
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Bank Details</h4>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Name</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bankDetailsDTO.accountName}
                onChange={(e) => handleInputChange("bankDetailsDTO.accountName", e.target.value)}
                placeholder="Enter account name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bankDetailsDTO.accountNumber}
                onChange={(e) => handleInputChange("bankDetailsDTO.accountNumber", e.target.value)}
                placeholder="Enter account number"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sort Code</label>
              <input
                type="text"
                maxLength={6}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bankDetailsDTO.sortCode}
                onChange={(e) => handleInputChange("bankDetailsDTO.sortCode", e.target.value)}
                placeholder="Enter sort code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bankDetailsDTO.bankName}
                onChange={(e) => handleInputChange("bankDetailsDTO.bankName", e.target.value)}
                placeholder="Enter bank name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Address</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bankDetailsDTO.bankAddress}
                onChange={(e) => handleInputChange("bankDetailsDTO.bankAddress", e.target.value)}
                placeholder="Enter bank address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Post Code</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bankDetailsDTO.bankPostCode}
                onChange={(e) => handleInputChange("bankDetailsDTO.bankPostCode", e.target.value)}
                placeholder="Enter bank post code"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Telephone</label>
              <input
                type="tel"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bankDetailsDTO.telephone}
                onChange={(e) => handleInputChange("bankDetailsDTO.telephone", e.target.value)}
                placeholder="Enter telephone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Reference</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bankDetailsDTO.paymentReference}
                onChange={(e) => handleInputChange("bankDetailsDTO.paymentReference", e.target.value)}
                placeholder="Enter payment reference"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Lead Days</label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={formData.bankDetailsDTO.paymentLeadDays}
                onChange={(e) => handleInputChange("bankDetailsDTO.paymentLeadDays", e.target.value)}
                placeholder="Enter payment lead days"
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                checked={formData.bankDetailsDTO.isRTIReturnsIncluded}
                onChange={(e) => handleInputChange("bankDetailsDTO.isRTIReturnsIncluded", e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Include in RTI Returns</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTermsConditions = () => (
    <div className="space-y-6">
      <h4 className="text-md font-medium text-gray-900">Employment Terms</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Hours Worked Per Week</label>
          <input
            type="number"
            min="0"
            max="168"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.termsDto.hoursWorkedPerWeek}
            onChange={(e) => handleInputChange("termsDto.hoursWorkedPerWeek", Number.parseInt(e.target.value) || 0)}
            placeholder="40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Weeks Notice Required</label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.termsDto.weeksNoticeRequired}
            onChange={(e) => handleInputChange("termsDto.weeksNoticeRequired", Number.parseInt(e.target.value) || 0)}
            placeholder="4"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Days Sickness on Full Pay</label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.termsDto.daysSicknessOnFullPay}
            onChange={(e) => handleInputChange("termsDto.daysSicknessOnFullPay", Number.parseInt(e.target.value) || 0)}
            placeholder="30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Days Holiday Per Year</label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.termsDto.daysHolidayPerYear}
            onChange={(e) => handleInputChange("termsDto.daysHolidayPerYear", Number.parseInt(e.target.value) || 0)}
            placeholder="28"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Male Retirement Age</label>
          <input
            type="number"
            min="0"
            max="100"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.termsDto.maleRetirementAge}
            onChange={(e) => handleInputChange("termsDto.maleRetirementAge", Number.parseInt(e.target.value) || 0)}
            placeholder="65"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Female Retirement Age</label>
          <input
            type="number"
            min="0"
            max="100"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.termsDto.femaleRetirementAge}
            onChange={(e) => handleInputChange("termsDto.femaleRetirementAge", Number.parseInt(e.target.value) || 0)}
            placeholder="65"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Days to Carry Over</label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={formData.termsDto.maxDaysToCarryOver}
            onChange={(e) => handleInputChange("termsDto.maxDaysToCarryOver", Number.parseInt(e.target.value) || 0)}
            placeholder="28"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.termsDto.isPaidOvertime}
            onChange={(e) => handleInputChange("termsDto.isPaidOvertime", e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
          />
          <label className="ml-2 text-sm font-medium text-gray-700">Is Paid Overtime</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.termsDto.mayJoinPensionScheme}
            onChange={(e) => handleInputChange("termsDto.mayJoinPensionScheme", e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
          />
          <label className="ml-2 text-sm font-medium text-gray-700">May Join Pension Scheme</label>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return renderBasicInformation()
      case "contact":
        return renderContactDetails()
      case "company":
        return renderCompanyDetails()
      case "system":
        return renderSystemSettings()
      case "financial":
        return renderFinancialDetails()
      case "terms":
        return renderTermsConditions()
      default:
        return renderBasicInformation()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employer Details</h1>
              <p className="text-sm text-gray-600">Manage your company information and settings</p>
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

      {success && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        </div>
      )}

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
                            const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
                            setActiveTab(tabs[currentIndex + 1].id)
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
  )
}

export default AddCompanyDetails
