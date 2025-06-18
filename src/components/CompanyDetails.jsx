"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const CompanyDetails = () => {
  const [employers, setEmployers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedEmployer, setSelectedEmployer] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [activeViewTab, setActiveViewTab] = useState("basic")
  const [activeEditTab, setActiveEditTab] = useState("basic")
  const navigate = useNavigate()

  const [editFormData, setEditFormData] = useState({
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

  const tabs = [
    { id: "basic", name: "Basic Information" },
    { id: "contact", name: "Contact Details" },
    { id: "company", name: "Company Details" },
    { id: "system", name: "System Settings" },
    { id: "financial", name: "Financial Details" },
    { id: "terms", name: "Terms & Conditions" },
  ]

  // Fetch all employers on component mount
  useEffect(() => {
    fetchEmployers()
  }, [])

  const fetchEmployers = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:8080/api/v1/employer/allEmployers")
      setEmployers(response.data)
      setError("")
    } catch (err) {
      console.error("Error fetching employers:", err)
      setError("Failed to fetch employer details")
    } finally {
      setLoading(false)
    }
  }

  // Get employer details by ID for viewing
  const handleView = async (id) => {
    console.log("Fetching employer with ID:", id)
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/employer/employers/${id}`)
      setSelectedEmployer(response.data)
      setShowViewModal(true)
      setActiveViewTab("basic")
      setError("")
    } catch (err) {
      console.error("Error fetching employer details:", err)
      setError("Failed to fetch employer details")
    }
  }

  // Get employer details by ID for editing
  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/employer/employers/${id}`)
      setEditFormData(response.data)
      setSelectedEmployer(response.data)
      setShowEditModal(true)
      setActiveEditTab("basic")
      setError("")
    } catch (err) {
      console.error("Error fetching employer details:", err)
      setError("Failed to fetch employer details")
    }
  }

  // Delete employer by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employer? This action cannot be undone.")) {
      return
    }

    try {
      setDeleteLoading(id)
      await axios.delete(`http://localhost:8080/api/v1/employer/delete/employers/${id}`)
      setSuccess("Employer deleted successfully!")
      setError("")
      fetchEmployers()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Error deleting employer:", err)
      setError("Failed to delete employer")
    } finally {
      setDeleteLoading(null)
    }
  }

  // Handle edit form input changes
  const handleEditInputChange = (field, value) => {
    if (field.startsWith("bankDetailsDTO.")) {
      const bankField = field.split(".")[1]
      setEditFormData((prev) => ({
        ...prev,
        bankDetailsDTO: {
          ...prev.bankDetailsDTO,
          [bankField]: value,
        },
      }))
    } else if (field.startsWith("taxOfficeDto.")) {
      const taxField = field.split(".")[1]
      setEditFormData((prev) => ({
        ...prev,
        taxOfficeDto: {
          ...prev.taxOfficeDto,
          [taxField]: value,
        },
      }))
    } else if (field.startsWith("termsDto.")) {
      const termsField = field.split(".")[1]
      setEditFormData((prev) => ({
        ...prev,
        termsDto: {
          ...prev.termsDto,
          [termsField]: value,
        },
      }))
    } else {
      setEditFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  // Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault()

    // Move to next tab if not last tab
    if (activeEditTab !== "terms") {
      const currentIndex = tabs.findIndex((tab) => tab.id === activeEditTab)
      if (currentIndex < tabs.length - 1) {
        setActiveEditTab(tabs[currentIndex + 1].id)
      }
      return
    }

    try {
      await axios.put(`http://localhost:8080/api/v1/employer/update/employers/${selectedEmployer.id}`, editFormData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      setSuccess("Employer details updated successfully!")
      setError("")
      setShowEditModal(false)
      fetchEmployers()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Error updating employer:", err)
      setError("Failed to update employer details")
    }
  }

  // VIEW MODAL RENDER FUNCTIONS (Same structure as add form but read-only)
  const renderViewBasicInformation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employer Name</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.employerName || ""}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Employer ID</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.employerId || ""}
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.employerAddress || ""}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Post Code</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.employerPostCode || ""}
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Telephone</label>
          <input
            type="tel"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.employerTelephone || ""}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.employerEmail || ""}
            readOnly
          />
        </div>
      </div>
    </div>
  )

  const renderViewContactDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Forename</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.contactForename || ""}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Surname</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.contactSurname || ""}
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">PDF Password</label>
          <input
            type="password"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.pdfPassword || ""}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">User Reference</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.userReference || ""}
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date PAYE Scheme Started</label>
          <input
            type="date"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.datePAYESchemeStarted || ""}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date PAYE Scheme Ceased</label>
          <input
            type="date"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.datePAYESchemeCeased || ""}
            readOnly
          />
        </div>
      </div>
    </div>
  )

  const renderViewCompanyDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.companyName || ""}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax Year</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.taxYear || ""}
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pay Period</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.payPeriod || ""}
            disabled
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
            value={selectedEmployer.region || ""}
            disabled
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
              value={selectedEmployer.taxOfficeDto?.payeReference || ""}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Accounts Office Reference</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={selectedEmployer.taxOfficeDto?.accountsOfficeReference || ""}
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Unique Tax Ref</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={selectedEmployer.taxOfficeDto?.uniqueTaxRef || ""}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Corporation Tax Ref</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={selectedEmployer.taxOfficeDto?.corporationTaxRef || ""}
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Payroll Giving Ref</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={selectedEmployer.taxOfficeDto?.payrollGivingRef || ""}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={selectedEmployer.taxOfficeDto?.paymentMethod || ""}
              disabled
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
              value={selectedEmployer.taxOfficeDto?.childSupportRef || ""}
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedEmployer.taxOfficeDto?.serQualifiedThisYear || false}
              disabled
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Ser Qualified This Year</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedEmployer.taxOfficeDto?.serQualifiedLastYear || false}
              disabled
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Ser Qualified Last Year</label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedEmployer.taxOfficeDto?.noRtiDueWarnings || false}
              disabled
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">No RTI Due Warnings</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedEmployer.taxOfficeDto?.claimNICAllowance || false}
              disabled
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Claim NIC Allowance</label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedEmployer.taxOfficeDto?.claimEmploymentAllowance || false}
              disabled
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Claim Employment Allowance</label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderViewSystemSettings = () => (
    <div className="space-y-6">
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
              checked={selectedEmployer[preference.name] || false}
              disabled
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">{preference.label}</label>
          </div>
        ))}
      </div>
    </div>
  )

  const renderViewFinancialDetails = () => (
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
                value={selectedEmployer.bankDetailsDTO?.accountName || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={selectedEmployer.bankDetailsDTO?.accountNumber || ""}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sort Code</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={selectedEmployer.bankDetailsDTO?.sortCode || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={selectedEmployer.bankDetailsDTO?.bankName || ""}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Address</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={selectedEmployer.bankDetailsDTO?.bankAddress || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Post Code</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={selectedEmployer.bankDetailsDTO?.bankPostCode || ""}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Telephone</label>
              <input
                type="tel"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={selectedEmployer.bankDetailsDTO?.telephone || ""}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Reference</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={selectedEmployer.bankDetailsDTO?.paymentReference || ""}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Lead Days</label>
              <input
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={selectedEmployer.bankDetailsDTO?.paymentLeadDays || ""}
                readOnly
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                checked={selectedEmployer.bankDetailsDTO?.isRTIReturnsIncluded || false}
                disabled
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Include in RTI Returns</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderViewTermsConditions = () => (
    <div className="space-y-6">
      <h4 className="text-md font-medium text-gray-900">Employment Terms</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Hours Worked Per Week</label>
          <input
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.termsDto?.hoursWorkedPerWeek || ""}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Weeks Notice Required</label>
          <input
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.termsDto?.weeksNoticeRequired || ""}
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Days Sickness on Full Pay</label>
          <input
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.termsDto?.daysSicknessOnFullPay || ""}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Days Holiday Per Year</label>
          <input
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.termsDto?.daysHolidayPerYear || ""}
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Male Retirement Age</label>
          <input
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.termsDto?.maleRetirementAge || ""}
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Female Retirement Age</label>
          <input
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.termsDto?.femaleRetirementAge || ""}
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Days to Carry Over</label>
          <input
            type="number"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={selectedEmployer.termsDto?.maxDaysToCarryOver || ""}
            readOnly
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedEmployer.termsDto?.isPaidOvertime || false}
            disabled
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
          />
          <label className="ml-2 text-sm font-medium text-gray-700">Is Paid Overtime</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedEmployer.termsDto?.mayJoinPensionScheme || false}
            disabled
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
          />
          <label className="ml-2 text-sm font-medium text-gray-700">May Join Pension Scheme</label>
        </div>
      </div>
    </div>
  )

  // EDIT MODAL RENDER FUNCTIONS (Exactly like add form)
  const renderEditBasicInformation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employer Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editFormData.employerName}
            onChange={(e) => handleEditInputChange("employerName", e.target.value)}
            placeholder="Enter employer name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Employer ID</label>
          <input
            type="text"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editFormData.employerId}
            onChange={(e) => handleEditInputChange("employerId", e.target.value)}
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
            value={editFormData.employerAddress}
            onChange={(e) => handleEditInputChange("employerAddress", e.target.value)}
            placeholder="Enter address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Post Code</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editFormData.employerPostCode}
            onChange={(e) => handleEditInputChange("employerPostCode", e.target.value)}
            placeholder="Enter post code"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Telephone</label>
          <input
            type="tel"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editFormData.employerTelephone}
            onChange={(e) => handleEditInputChange("employerTelephone", e.target.value)}
            placeholder="Enter telephone number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editFormData.employerEmail}
            onChange={(e) => handleEditInputChange("employerEmail", e.target.value)}
            placeholder="Enter email address"
          />
        </div>
      </div>
    </div>
  )

  const renderEditContactDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Forename</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editFormData.contactForename}
            onChange={(e) => handleEditInputChange("contactForename", e.target.value)}
            placeholder="Enter first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Surname</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editFormData.contactSurname}
            onChange={(e) => handleEditInputChange("contactSurname", e.target.value)}
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
            value={editFormData.pdfPassword}
            onChange={(e) => handleEditInputChange("pdfPassword", e.target.value)}
            placeholder="Enter PDF password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">User Reference</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editFormData.userReference}
            onChange={(e) => handleEditInputChange("userReference", e.target.value)}
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
            value={editFormData.datePAYESchemeStarted}
            onChange={(e) => handleEditInputChange("datePAYESchemeStarted", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date PAYE Scheme Ceased</label>
          <input
            type="date"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editFormData.datePAYESchemeCeased}
            onChange={(e) => handleEditInputChange("datePAYESchemeCeased", e.target.value)}
          />
        </div>
      </div>
    </div>
  )

  const renderEditCompanyDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editFormData.companyName}
            onChange={(e) => handleEditInputChange("companyName", e.target.value)}
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
            value={editFormData.taxYear}
            onChange={(e) => handleEditInputChange("taxYear", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pay Period</label>
          <select
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editFormData.payPeriod}
            onChange={(e) => handleEditInputChange("payPeriod", e.target.value)}
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
            value={editFormData.region}
            onChange={(e) => handleEditInputChange("region", e.target.value)}
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
              value={editFormData.taxOfficeDto.payeReference}
              onChange={(e) => handleEditInputChange("taxOfficeDto.payeReference", e.target.value)}
              placeholder="Enter PAYE Reference"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Accounts Office Reference</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={editFormData.taxOfficeDto.accountsOfficeReference}
              onChange={(e) => handleEditInputChange("taxOfficeDto.accountsOfficeReference", e.target.value)}
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
              value={editFormData.taxOfficeDto.uniqueTaxRef}
              onChange={(e) => handleEditInputChange("taxOfficeDto.uniqueTaxRef", e.target.value)}
              placeholder="Enter Unique Tax Ref"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Corporation Tax Ref</label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={editFormData.taxOfficeDto.corporationTaxRef}
              onChange={(e) => handleEditInputChange("taxOfficeDto.corporationTaxRef", e.target.value)}
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
              value={editFormData.taxOfficeDto.payrollGivingRef}
              onChange={(e) => handleEditInputChange("taxOfficeDto.payrollGivingRef", e.target.value)}
              placeholder="Enter Payroll Giving Ref"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
              value={editFormData.taxOfficeDto.paymentMethod}
              onChange={(e) => handleEditInputChange("taxOfficeDto.paymentMethod", e.target.value)}
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
              value={editFormData.taxOfficeDto.childSupportRef}
              onChange={(e) => handleEditInputChange("taxOfficeDto.childSupportRef", e.target.value)}
              placeholder="Enter Child Support Reference"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={editFormData.taxOfficeDto.serQualifiedThisYear}
              onChange={(e) => handleEditInputChange("taxOfficeDto.serQualifiedThisYear", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Ser Qualified This Year</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={editFormData.taxOfficeDto.serQualifiedLastYear}
              onChange={(e) => handleEditInputChange("taxOfficeDto.serQualifiedLastYear", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Ser Qualified Last Year</label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={editFormData.taxOfficeDto.noRtiDueWarnings}
              onChange={(e) => handleEditInputChange("taxOfficeDto.noRtiDueWarnings", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">No RTI Due Warnings</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={editFormData.taxOfficeDto.claimNICAllowance}
              onChange={(e) => handleEditInputChange("taxOfficeDto.claimNICAllowance", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Claim NIC Allowance</label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={editFormData.taxOfficeDto.claimEmploymentAllowance}
              onChange={(e) => handleEditInputChange("taxOfficeDto.claimEmploymentAllowance", e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Claim Employment Allowance</label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderEditSystemSettings = () => (
    <div className="space-y-6">
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
              checked={editFormData[preference.name]}
              onChange={(e) => handleEditInputChange(preference.name, e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">{preference.label}</label>
          </div>
        ))}
      </div>
    </div>
  )

  const renderEditFinancialDetails = () => (
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
                value={editFormData.bankDetailsDTO.accountName}
                onChange={(e) => handleEditInputChange("bankDetailsDTO.accountName", e.target.value)}
                placeholder="Enter account name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={editFormData.bankDetailsDTO.accountNumber}
                onChange={(e) => handleEditInputChange("bankDetailsDTO.accountNumber", e.target.value)}
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
                value={editFormData.bankDetailsDTO.sortCode}
                onChange={(e) => handleEditInputChange("bankDetailsDTO.sortCode", e.target.value)}
                placeholder="Enter sort code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={editFormData.bankDetailsDTO.bankName}
                onChange={(e) => handleEditInputChange("bankDetailsDTO.bankName", e.target.value)}
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
                value={editFormData.bankDetailsDTO.bankAddress}
                onChange={(e) => handleEditInputChange("bankDetailsDTO.bankAddress", e.target.value)}
                placeholder="Enter bank address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Post Code</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={editFormData.bankDetailsDTO.bankPostCode}
                onChange={(e) => handleEditInputChange("bankDetailsDTO.bankPostCode", e.target.value)}
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
                value={editFormData.bankDetailsDTO.telephone}
                onChange={(e) => handleEditInputChange("bankDetailsDTO.telephone", e.target.value)}
                placeholder="Enter telephone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Reference</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
                value={editFormData.bankDetailsDTO.paymentReference}
                onChange={(e) => handleEditInputChange("bankDetailsDTO.paymentReference", e.target.value)}
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
                value={editFormData.bankDetailsDTO.paymentLeadDays}
                onChange={(e) => handleEditInputChange("bankDetailsDTO.paymentLeadDays", e.target.value)}
                placeholder="Enter payment lead days"
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                checked={editFormData.bankDetailsDTO.isRTIReturnsIncluded}
                onChange={(e) => handleEditInputChange("bankDetailsDTO.isRTIReturnsIncluded", e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Include in RTI Returns</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderEditTermsConditions = () => (
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
            value={editFormData.termsDto.hoursWorkedPerWeek}
            onChange={(e) => handleEditInputChange("termsDto.hoursWorkedPerWeek", Number.parseInt(e.target.value) || 0)}
            placeholder="40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Weeks Notice Required</label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editFormData.termsDto.weeksNoticeRequired}
            onChange={(e) =>
              handleEditInputChange("termsDto.weeksNoticeRequired", Number.parseInt(e.target.value) || 0)
            }
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
            value={editFormData.termsDto.daysSicknessOnFullPay}
            onChange={(e) =>
              handleEditInputChange("termsDto.daysSicknessOnFullPay", Number.parseInt(e.target.value) || 0)
            }
            placeholder="30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Days Holiday Per Year</label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2 border"
            value={editFormData.termsDto.daysHolidayPerYear}
            onChange={(e) => handleEditInputChange("termsDto.daysHolidayPerYear", Number.parseInt(e.target.value) || 0)}
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
            value={editFormData.termsDto.maleRetirementAge}
            onChange={(e) => handleEditInputChange("termsDto.maleRetirementAge", Number.parseInt(e.target.value) || 0)}
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
            value={editFormData.termsDto.femaleRetirementAge}
            onChange={(e) =>
              handleEditInputChange("termsDto.femaleRetirementAge", Number.parseInt(e.target.value) || 0)
            }
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
            value={editFormData.termsDto.maxDaysToCarryOver}
            onChange={(e) => handleEditInputChange("termsDto.maxDaysToCarryOver", Number.parseInt(e.target.value) || 0)}
            placeholder="28"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={editFormData.termsDto.isPaidOvertime}
            onChange={(e) => handleEditInputChange("termsDto.isPaidOvertime", e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
          />
          <label className="ml-2 text-sm font-medium text-gray-700">Is Paid Overtime</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={editFormData.termsDto.mayJoinPensionScheme}
            onChange={(e) => handleEditInputChange("termsDto.mayJoinPensionScheme", e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
          />
          <label className="ml-2 text-sm font-medium text-gray-700">May Join Pension Scheme</label>
        </div>
      </div>
    </div>
  )

  // TAB CONTENT RENDERERS
  const renderViewTabContent = () => {
    switch (activeViewTab) {
      case "basic":
        return renderViewBasicInformation()
      case "contact":
        return renderViewContactDetails()
      case "company":
        return renderViewCompanyDetails()
      case "system":
        return renderViewSystemSettings()
      case "financial":
        return renderViewFinancialDetails()
      case "terms":
        return renderViewTermsConditions()
      default:
        return renderViewBasicInformation()
    }
  }

  const renderEditTabContent = () => {
    switch (activeEditTab) {
      case "basic":
        return renderEditBasicInformation()
      case "contact":
        return renderEditContactDetails()
      case "company":
        return renderEditCompanyDetails()
      case "system":
        return renderEditSystemSettings()
      case "financial":
        return renderEditFinancialDetails()
      case "terms":
        return renderEditTermsConditions()
      default:
        return renderEditBasicInformation()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading employer details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employer Details</h1>
              <p className="text-sm text-gray-600">Manage all employer information and settings</p>
            </div>
            <div className="flex space-x-3">
              
              <button
                onClick={() => navigate("/employer-dashboard")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Back to Dashboard
              </button>
            </div>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Employer List ({employers.length})</h3>
              <p className="mt-1 text-sm text-gray-500">View and manage all registered employers in your system.</p>
            </div>

            {employers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No employers found. Add your first employer to get started.</p>
                <button
                  onClick={() => navigate("/add-company-details")}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Add First Employer
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employer Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Information
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employers.map((employer) => (
                      <tr key={employer.id || employer.employerId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{employer.employerName || "N/A"}</div>
                            <div className="text-sm text-gray-500">ID: {employer.employerId || "N/A"}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">{employer.employerEmail || "N/A"}</div>
                            <div className="text-sm text-gray-500">{employer.employerTelephone || "N/A"}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">{employer.companyName || "N/A"}</div>
                            <div className="text-sm text-gray-500">
                              {employer.region || "N/A"} | {employer.payPeriod || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleView(employer.id || employer.employerId)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(employer.id || employer.employerId)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(employer.id || employer.employerId)}
                            disabled={deleteLoading === (employer.id || employer.employerId)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                          >
                            {deleteLoading === (employer.id || employer.employerId) ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedEmployer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Employer Details</h3>
                  <p className="text-sm text-gray-600">Manage your company information and settings</p>
                </div>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
                {/* Sidebar */}
                <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveViewTab(tab.id)}
                        className={`${
                          activeViewTab === tab.id
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
                  <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {tabs.find((tab) => tab.id === activeViewTab)?.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Please fill in all required information for this section.
                        </p>
                      </div>

                      {renderViewTabContent()}
                    </div>

                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            const currentIndex = tabs.findIndex((tab) => tab.id === activeViewTab)
                            if (currentIndex > 0) {
                              setActiveViewTab(tabs[currentIndex - 1].id)
                            }
                          }}
                          disabled={activeViewTab === "basic"}
                          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>

                        <div className="space-x-3">
                          <button
                            onClick={() => setShowViewModal(false)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                          >
                            Close
                          </button>

                          {activeViewTab !== "terms" && (
                            <button
                              type="button"
                              onClick={() => {
                                const currentIndex = tabs.findIndex((tab) => tab.id === activeViewTab)
                                setActiveViewTab(tabs[currentIndex + 1].id)
                              }}
                              className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Next
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedEmployer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Employer Details</h3>
                  <p className="text-sm text-gray-600">Manage your company information and settings</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
                {/* Sidebar */}
                <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveEditTab(tab.id)}
                        className={`${
                          activeEditTab === tab.id
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
                  <form onSubmit={handleEditSubmit}>
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                      <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {tabs.find((tab) => tab.id === activeEditTab)?.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Please fill in all required information for this section.
                          </p>
                        </div>

                        {renderEditTabContent()}
                      </div>

                      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <div className="flex justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              const currentIndex = tabs.findIndex((tab) => tab.id === activeEditTab)
                              if (currentIndex > 0) {
                                setActiveEditTab(tabs[currentIndex - 1].id)
                              }
                            }}
                            disabled={activeEditTab === "basic"}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>

                          <div className="space-x-3">
                            <button
                              type="button"
                              onClick={() => setShowEditModal(false)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                              Cancel
                            </button>

                            {activeEditTab !== "terms" && (
                              <button
                                type="button"
                                onClick={() => {
                                  const currentIndex = tabs.findIndex((tab) => tab.id === activeEditTab)
                                  setActiveEditTab(tabs[currentIndex + 1].id)
                                }}
                                className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Next
                              </button>
                            )}

                            {activeEditTab === "terms" && (
                              <button
                                type="submit"
                                className="bg-green-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Save Details
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
        </div>
      )}
    </div>
  )
}

export default CompanyDetails
