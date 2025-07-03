import { useState, useEffect } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import Reports from "./Reports"
import axios from "axios"

const DummyP60form = () => {
  const navigate=useNavigate();
  const {employeeId}=useParams("employeeId");
  // State for all form fields
  const [formData, setFormData] = useState({
    taxYear: "",
    surname: "",
    forenames: "",
    nationalInsurance: "",
    payrollNumber: "",
    previousPay: "",
    previousTax: "",
    currentPay: "",
    currentTax: "",
    totalPay: "",
    totalTax: "",
    finalTaxCode: "",
    statutoryMaternityPay: "",
    statutoryPaternityPay: "",
    statutorySharedParentalPay: "",
    statutoryAdoptionPay: "",
    statutoryBereavementPay: "",
    studentLoanDeductions: "",
    postgraduateLoanDeductions: "",
    toEmployee: "",
    employerDetails: "",
    employerPAYE: "",
    // NI Contributions table data
    nicRows: Array(4)
      .fill(null)
      .map(() => ({
        tableLetter: "",
        earningsLEL: "",
        earningsPT: "",
        earningsUEL: "",
        contributions: "",
      })),
  })

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [employee,setEmployee]=useState(null);
  const [employer, setEmployer] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

   useEffect(() => {
  if(employeeId!==null){
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/employee-details/employee/${employeeId}`);
        console.log("Employee Data fetched:", response.data);
        setEmployee(response.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }
  }, [employeeId]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/employer/allEmployers");
        console.log("employers Data fetched:", response.data[0]); 
        setEmployer(response.data[0]);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleNICChange = (rowIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      nicRows: prev.nicRows.map((row, index) => (index === rowIndex ? { ...row, [field]: value } : row)),
    }))
  }

  const handleDownload = async () => {
    setIsGeneratingPDF(true)

    try {
      // Create PDF content element
      const pdfContent = createPDFContent()

      // Append to body temporarily
      document.body.appendChild(pdfContent)

      // Import html2pdf
      const html2pdf = (await import("html2pdf.js")).default

      const options = {
        margin: [0, 0, 0, 0],
        filename: "P60_2025_2026_MTL.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
          compress: true,
        },
      }

      await html2pdf().set(options).from(pdfContent).save()

      // Remove temporary element
      document.body.removeChild(pdfContent)
    } catch (error) {
      console.error("PDF generation failed:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const createPDFContent = () => {
    const container = document.createElement("div")
 container.style.cssText = `
  width: 210mm;
  min-height: 297mm;
  padding: 0;
  margin: 0;
  background: white;
  font-family: Arial, sans-serif;
  font-size: 12px;
  line-height: 1.3;
  color: #000;
  box-sizing: border-box;
  overflow: hidden;
    page-break-inside: avoid;
     break-inside: avoid;
`;


    container.innerHTML = `
    <div id="pdf-container">
    <style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    word-break: break-word;
  }

  html, body {
    width: 210mm;
    height: 297mm;
    overflow: hidden;
    background-color: #fff;
  }

  #pdf-container {
    width: 100%;
    height: auto;
    padding: 10mm;
    // border: 1px solid #000; /* This is the missing right-side border */
    background-color: #fff;
  }

  .pdf-field-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .pdf-field-group {
    flex: 0 0 48%; /* To ensure two columns fit side by side with gap */
    margin-bottom: 8px;
  }
</style>

      <div style="margin-bottom: 20px;">
        <h1 style="font-size: 20px; font-weight: bold; color: #1e3a8a; margin: 0 0 15px 0;">P60 End of Year Certificate</h1>
        
        <div style="display: flex; align-items: center; background: #f97316; color: white; margin: 0 0 15px 0;  padding: 2px; margin-bottom: 10px; margin-right:10px;">
          <span style="margin-right:20px; margin-bottom:10px; padding:10px;">Tax year to 5 April</span>
          <span style="background: white; color: black; padding-bottom:10px; padding-left:10px; padding-right:10px; margin:5px 0; border: 1px solid #ccc;">${employer.taxYear || ""}</span>
        </div>
        
        <p style="color: #1e3a8a; font-weight: bold; margin: 10px 0;">This is a printed copy of an eP60</p>
      </div>

      <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 10px; page-break-inside: avoid;  break-inside: avoid;">
        <h2 style="color: #1e3a8a; font-weight: bold; margin: 0 0 10px 0; font-size: 14px;">To the employee:</h2>
        <p style="margin: 0; line-height: 1.4;">
          Please keep this certificate in a safe place. You also need it to make a claim for tax credits or Universal Credit or to renew your claim. 
          It also helps you check that your employer is using the correct National Insurance number.<br><br>
          <strong>By law you are required to tell HM Revenue and Customs about any income that is not fully taxed, even if you are not sent a tax return.</strong>
          HM Revenue and Customs
        </p>
      </div>

      <div style="background: #1e3a8a; color: white; padding: 10px; margin-bottom: 10px;">
        <span style="padding:10px; padding-bottom:10px;">The figures marked * should be used for your tax return, if you get one</span>
      </div>

      <!-- Employee Details -->
      <div style="border: 1px solid #ccc; padding: 10px; background: #fff7ed; margin-bottom: 10px; page-break-inside: avoid;  break-inside: avoid;">
        <h3 style="color: #c2410c; font-weight: bold; margin: 0 0 15px 0; font-size: 14px;">Employee's details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding: 4px; vertical-align: top;">
              <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 10px;">Surname</div>
                <div style="border: 1px solid #ccc; padding-left: 5px; padding-bottom:10px; background: white; height: 24px;">${employee.firstName || ""}</div>
              </div>
            </td>
            <td style="width: 50%; padding: 4px; vertical-align: top;">
              <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 10px;">Forenames or initials</div>
                <div style="border: 1px solid #ccc; padding-left: 5px; padding-bottom:10px; background: white; height: 24px;">${employee.lastName || ""}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 4px; vertical-align: top;">
              <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 10px;">National Insurance number</div>
                <div style="border: 1px solid #ccc; padding-left: 5px; padding-bottom:10px; background: white; height: 24px;">${employee.nationalInsuranceNumber || ""}</div>
              </div>
            </td>
            <td style="padding: 4px; vertical-align: top;">
              <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 10px;">Works/payroll number</div>
                <div style="border: 1px solid #ccc; padding-left: 5px; padding-bottom:10px; background: white; height: 24px;">${formData.payrollNumber || ""}</div>
              </div>
            </td>
          </tr>
        </table>
      </div>

   <!-- Pay and Income Tax Details -->
<div style="border: 1px solid #ccc; padding: 10px; background: #fffaf0; margin-bottom: 10px; page-break-inside: avoid;  break-inside: avoid;">
  <h3 style="color: #c2410c; font-weight: bold; margin: 0 0 8px 0; font-size: 14px;">Pay and Income Tax details</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="width: 50%; padding: 4px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 10px;">In previous employments (Pay)</div>
        <div style="border: 1px solid #ccc; padding: 4px; background: white; height: 24px; display: flex; align-items: center; padding-bottom:10px;">
          ${formData.previousPay || "&nbsp;"}
        </div>
      </td>
      <td style="width: 50%; padding: 4px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 10px;">Tax deducted</div>
        <div style="border: 1px solid #ccc; padding: 4px; background: white; height: 24px; display: flex; align-items: center; padding-bottom:10px;">
          ${formData.previousTax || "&nbsp;"}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 4px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 10px;">* In this employment (Pay)</div>
        <div style="border: 1px solid #ccc; padding: 4px; background: white; height: 24px; display: flex; align-items: center; padding-bottom:10px;">
          ${employee.annualIncomeOfEmployee || "&nbsp;"}
        </div>
      </td>
      <td style="padding: 4px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 10px;">Tax deducted</div>
        <div style="border: 1px solid #ccc; padding: 4px; background: white; height: 24px; display: flex; align-items: center; padding-bottom:10px;">
          ${employee.otherEmployeeDetailsDTO.totalIncomeTaxPaidInCompany || "&nbsp;"}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 4px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 10px;">Total for year (Pay)</div>
        <div style="border: 1px solid #ccc; padding: 4px; background: white; height: 24px; display: flex; align-items: center; padding-bottom:10px;">
          ${employee.annualIncomeOfEmployee|| "&nbsp;"}
        </div>
      </td>
      <td style="padding: 4px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 10px;">Tax deducted</div>
        <div style="border: 1px solid #ccc; padding: 4px; background: white; height: 24px; display: flex; align-items: center; padding-bottom:10px;">
          ${employee.otherEmployeeDetailsDTO.totalIncomeTaxPaidInCompany || "&nbsp;"}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 4px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 10px;">Final tax code</div>
        <div style="border: 1px solid #ccc; padding: 4px; background: white; height: 24px; display: flex; align-items: center; padding-bottom:10px;">
          ${employee.taxCode || "&nbsp;"}
        </div>
      </td>
      <td style="padding: 4px;"></td>
    </tr>
  </table>
</div>



     <!-- National Insurance Contributions -->
<div style="page-break-inside: avoid; break-inside: avoid;margin-bottom: 50px;">
  <div style="border: 1px solid #ccc; padding: 15px; background: #fff7ed; margin-bottom: 15px;">
    <h3 style="color: #c2410c; font-weight: bold; margin: 0 0 15px 0; font-size: 14px;">
      National Insurance contributions in this employment
    </h3>
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc; font-size: 11px;">
      <thead>
        <tr style="background: #f5f5f5;">
          <th style="border: 1px solid #ccc;  padding: 8px; text-align: center;">NIC table letter</th>
          <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Earnings at LEL</th>
          <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Earnings above LEL up to PT</th>
          <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Earnings above PT up to UEL</th>
          <th style="border: 1px solid #ccc; padding: 8px; text-align: center;">Employee's contributions due above PT</th>
        </tr>
      </thead>
      <tbody>
        ${formData.nicRows
          .map(
            (row, i) => `
            <tr key={i}>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${i === 0 ? employee.niLetter : ""}</td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${row.earningsLEL || ""}</td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${row.earningsPT || ""}</td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${row.earningsUEL || ""}</td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: center;">${i === 0 ? employee.otherEmployeeDetailsDTO.totalEmployeeNIContributionInCompany : ""}</td>
            </tr>
          `
          )
          .join("")}
      </tbody>
    </table>
  </div>
</div>


      <!-- Statutory Payments -->
      <div style="border: 1px solid #ccc; padding: 15px; background: #fffaf0; margin-bottom: 15px; margin-top:100px;  page-break-inside: avoid;  break-inside: avoid;">
        <h3 style="color: #c2410c; font-weight: bold; margin: 0 0 15px 0; font-size: 14px;">Statutory payments included in the pay 'In this employment' figure above</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding: 5px; vertical-align: top;">
              <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 10px;">Statutory Maternity Pay</div>
                <div style="border: 1px solid #ccc; padding-left: 5px; padding-bottom:10px; background: white; min-height: 18px;">${formData.statutoryMaternityPay || ""}</div>
              </div>
            </td>
            <td style="width: 50%; padding: 5px; vertical-align: top;">
              <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 10px;">Statutory Paternity Pay</div>
                <div style="border: 1px solid #ccc; padding-left: 5px; padding-bottom:10px; background: white; min-height: 18px;">${formData.statutoryPaternityPay || ""}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 5px; vertical-align: top;">
              <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 10px;">Statutory Shared Parental Pay</div>
                <div style="border: 1px solid #ccc; padding-left: 5px; padding-bottom:10px; background: white; min-height: 18px;">${formData.statutorySharedParentalPay || ""}</div>
              </div>
            </td>
            <td style="padding: 5px; vertical-align: top;">
              <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 10px;">Statutory Adoption Pay</div>
                <div style="border: 1px solid #ccc; padding-left: 5px; padding-bottom:10px; background: white; min-height: 18px;">${formData.statutoryAdoptionPay || ""}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 5px; vertical-align: top;">
              <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 10px;">Statutory Parental Bereavement Pay</div>
                <div style="border: 1px solid #ccc; padding-left: 5px; padding-bottom:10px; background: white; min-height: 18px;">${formData.statutoryBereavementPay || ""}</div>
              </div>
            </td>
            <td style="padding: 5px;"></td>
          </tr>
        </table>
      </div>

      <!-- Other Details -->
      <div style="border: 1px solid #ccc; padding: 15px; background: #fffaf0; margin-bottom: 15px; page-break-inside: avoid;  break-inside: avoid;">
        <h3 style="color: #c2410c; font-weight: bold; margin: 0 0 15px 0; font-size: 14px;">Other details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding: 5px; vertical-align: top;">
              <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 10px;">Student Loan deductions</div>
                <div style="border: 1px solid #ccc; padding-left: 5px; padding-bottom:10px; background: white; min-height: 18px;">${employee.studentLoanDto.totalDeductionAmountInStudentLoan || ""}</div>
              </div>
            </td>
            <td style="width: 50%; padding: 5px; vertical-align: top;">
              <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 10px;">Postgraduate Loan deductions</div>
                <div style="border: 1px solid #ccc; padding-left: 5px; padding-bottom:10px; background: white; min-height: 18px;">${employee.postGraduateLoanDto.totalDeductionAmountInPostgraduateLoan || ""}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 5px; vertical-align: top;">
              <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; margin-bottom: 10px;">To employee</div>
                <div style="border: 1px solid #ccc; padding-left: 5px; padding-bottom:10px; background: white; min-height: 40px; white-space: pre-wrap;">${`${employee.firstName} ${employee.lastName}\n${employee.address}`}</div>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Employer Details -->
      <div style="border: 1px solid #ccc; padding: 15px; background: #fff7ed; margin-bottom: 15px; page-break-inside: avoid;  break-inside: avoid;">
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; margin-bottom: 10px;">Your employer's full name and address (including postcode)</div>
          <div style="border: 1px solid #ccc; padding: 8px; background: white; min-height: 60px; white-space: pre-wrap;">${`${employer.employerName}\n${employer.employerAddress}\n${employer.employerPostCode}`}</div>
        </div>
        
        <div style="margin-bottom: 15px;">
          <div style="font-weight: bold; margin-bottom: 10px;">Employer PAYE reference</div>
          <div style="border: 1px solid #ccc; padding-left: 5px; padding-bottom:10px; background: white; min-height: 18px;">${employer.taxOfficeDto.payeReference || ""}</div>
        </div>

        <h4 style="color: #1e3a8a; font-weight: bold; margin: 15px 0 10px 0; font-size: 14px;">Certificate by Employer/Paying Office</h4>
        <p style="margin: 0; font-size: 12px; line-height: 1.4;">
          This form shows your total pay for Income Tax purposes in this employment for the year. Any overtime, bonus, commission etc, 
          Statutory Sick Pay, Statutory Maternity Pay, Statutory Paternity Pay, Statutory Shared Parental Pay, 
          Statutory Parental Bereavement Pay or Statutory Adoption Pay is included.
        </p>
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 10px; color: #1e3a8a; margin: 0;">P60 (Substitute)(2025 to 2026)</p>
      </div>
      </div>
    `

    return container
  }

  const inputStyle = {
    width: "100%",
    border: "1px solid #ccc",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    boxSizing: "border-box",
  }

  const labelStyle = {
    display: "block",
    marginBottom: "12px",
    fontSize: "14px",
    fontWeight: "500",
  }

  return (
    <div className="min-h-screen bg-gray-50">
       <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-sm text-gray-600">HMRC and payroll reports</p>
            </div>
           <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleDownload}
                style={{ backgroundColor: '#16A34A', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', border: 'none', cursor: 'pointer' }}
              >
                Download PDF
              </button>
              <button
               onClick={() => navigate("/reports", { state: { from: "p60" } })}
                style={{ backgroundColor: '#4B5563', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', border: 'none', cursor: 'pointer' }}
              >
                Back to P60 Forms Tab
              </button>
            </div>
          </div>
        </div>
      </div>
      {employer!==null && employee!==null && <div style={{ backgroundColor: "#f3f4f6", padding: "2rem", minHeight: "100vh" }}>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          maxWidth: "900px",
          margin: "0 auto",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{ fontSize: "24px", fontWeight: "bold", color: "#1e3a8a", marginBottom: "2rem", textAlign: "left" }}
        >
          P60 End of Year Certificate
        </h1>

        {/* Tax Year */}
        <div style={{ padding: "1rem", backgroundColor: "#f97316" }}>
          <label style={{ color: "white", marginRight:"10px" }}>
            Tax year to 5 April 
            <input
              type="text"
              value={employer.taxYear}
              onChange={(e) => handleInputChange("taxYear", e.target.value)}
              style={{padding:"2px", maxWidth: "100px", marginLeft:"20px", backgroundColor: "white", color: "black",  borderRadius: "4px"}}
              // placeholder="e.g., 2025"
            />
            </label>
        </div>
        <p style={{color: "#1e3a8a", fontWeight: "bold", margin:"5px"}}>This is a printed copy of an eP60</p>

      <div style={{border:"1px solid #ccc", padding:"15px", marginBottom:"10px"}}>
        <h2 style={{color:"#1e3a8a", fontWeight:"bold", margin:"0 0 10px 0", fontSize:"14px"}}>To the employee:</h2>
        <p style={{margin:"0", lineHeight:"1.4"}}>
          Please keep this certificate in a safe place. You also need it to make a claim for tax credits or Universal Credit or to renew your claim. 
          It also helps you check that your employer is using the correct National Insurance number.<br/>
          <span className="font-bold text-sm mt-5 mr-1">By law you are required to tell HM Revenue and Customs about any income that is not fully taxed, even if you are not sent a tax return.</span>
          <br/>
           HM Revenue and Customs
        </p>
      </div>

      <div style={{background: "#1e3a8a", color: "white", padding: "10px", marginBottom: "10px"}}>
          <p className="p-0.5">The figures marked * should be used for your tax return, if you get one</p>
        </div>

        {/* Employee Details */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            backgroundColor: "#fff7ed",
            borderRadius: "8px",
            border: "1px solid #fed7aa",
          }}
        >
          <h3 style={{ color: "#c2410c", fontWeight: "bold", marginBottom: "1.5rem", fontSize: "18px" }}>
            Employee's details
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <label style={labelStyle}>
              Surname
              <input
                type="text"
                value={employee.firstName}
                onChange={(e) => handleInputChange("surname", e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Forenames or initials
              <input
                type="text"
                value={employee.lastName}
                onChange={(e) => handleInputChange("forenames", e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              National Insurance number
              <input
                type="text"
                value={employee.nationalInsuranceNumber}
                onChange={(e) => handleInputChange("nationalInsurance", e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Works/payroll number
              <input
                type="text"
                value={formData.payrollNumber}
                onChange={(e) => handleInputChange("payrollNumber", e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>
        </div>

        {/* Pay and Income Tax details */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            backgroundColor: "#fffaf0",
            borderRadius: "8px",
            border: "1px solid #fed7aa",
          }}
        >
          <h3 style={{ color: "#c2410c", fontWeight: "bold", marginBottom: "1.5rem", fontSize: "18px" }}>
            Pay and Income Tax details
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <label style={labelStyle}>
              In previous employments (Pay)
              <input
                type="text"
                value={formData.previousPay}
                onChange={(e) => handleInputChange("previousPay", e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Tax deducted
              <input
                type="text"
                value={formData.previousTax}
                onChange={(e) => handleInputChange("previousTax", e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              * In this employment (Pay)
              <input
                type="text"
                value={employee.annualIncomeOfEmployee}
                onChange={(e) => handleInputChange("currentPay", e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Tax deducted
              <input
                type="text"
                value={employee.otherEmployeeDetailsDTO.totalIncomeTaxPaidInCompany}
                onChange={(e) => handleInputChange("currentTax", e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Total for year (Pay)
              <input
                type="text"
                value={employee.annualIncomeOfEmployee}
                onChange={(e) => handleInputChange("totalPay", e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Tax deducted
              <input
                type="text"
                value={employee.otherEmployeeDetailsDTO.totalIncomeTaxPaidInCompany}
                onChange={(e) => handleInputChange("totalTax", e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Final tax code
              <input
                type="text"
                value={employee.taxCode}
                onChange={(e) => handleInputChange("finalTaxCode", e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>
        </div>

        {/* NI Contributions */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            backgroundColor: "#fff7ed",
            borderRadius: "8px",
            border: "1px solid #fed7aa",
          }}
        >
          <h3 style={{ color: "#c2410c", fontWeight: "bold", marginBottom: "1.5rem", fontSize: "18px" }}>
            National Insurance contributions in this employment
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
              <thead>
                <tr>
                  <th
                    style={{ border: "1px solid #ccc", padding: "10px", backgroundColor: "#f5f5f5", fontSize: "12px" }}
                  >
                    NIC table letter
                  </th>
                  <th
                    style={{ border: "1px solid #ccc", padding: "10px", backgroundColor: "#f5f5f5", fontSize: "12px" }}
                  >
                    Earnings at LEL
                  </th>
                  <th
                    style={{ border: "1px solid #ccc", padding: "10px", backgroundColor: "#f5f5f5", fontSize: "12px" }}
                  >
                    Earnings above LEL up to PT
                  </th>
                  <th
                    style={{ border: "1px solid #ccc", padding: "10px", backgroundColor: "#f5f5f5", fontSize: "12px" }}
                  >
                    Earnings above PT up to UEL
                  </th>
                  <th
                    style={{ border: "1px solid #ccc", padding: "10px", backgroundColor: "#f5f5f5", fontSize: "12px" }}
                  >
                    Employee's contributions due above PT
                  </th>
                </tr>
              </thead>
              <tbody>
               {formData.nicRows.map((row, i) => (
  <tr key={i}>
    {/* NI Letter - Only in first row */}
    <td style={{ border: "1px solid #ccc", padding: "5px" }}>
      <input
        type="text"
        value={i === 0 ? employee.niLetter : ""}
        onChange={(e) => handleNICChange(i, "niLetter", e.target.value)}
        style={{
          width: "100%",
          border: "none",
          padding: "5px",
          fontSize: "12px",
          textAlign:"center",
        }}
      />
    </td>

    {/* Earnings LEL */}
    <td style={{ border: "1px solid #ccc", padding: "5px" }}>
      <input
        type="text"
        value={row.earningsLEL}
        onChange={(e) => handleNICChange(i, "earningsLEL", e.target.value)}
        style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px" }}
      />
    </td>

    {/* Earnings PT */}
    <td style={{ border: "1px solid #ccc", padding: "5px" }}>
      <input
        type="text"
        value={row.earningsPT}
        onChange={(e) => handleNICChange(i, "earningsPT", e.target.value)}
        style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px" }}
      />
    </td>

    {/* Earnings UEL */}
    <td style={{ border: "1px solid #ccc", padding: "5px" }}>
      <input
        type="text"
        value={row.earningsUEL}
        onChange={(e) => handleNICChange(i, "earningsUEL", e.target.value)}
        style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px" }}
      />
    </td>

    <td style={{ border: "1px solid #ccc", padding: "5px" }}>
  <input
    type="text"
    value={i === 0 ? employee.otherEmployeeDetailsDTO.totalEmployeeNIContributionInCompany : ""}
    onChange={(e) => handleNICChange(i, "contributions", e.target.value)}
    style={{
      width: "100%",
      border: "none",
      padding: "5px",
      fontSize: "12px",
      textAlign:"center",
    }}
  />
</td>

  </tr>
))}

              </tbody>
            </table>
          </div>
        </div>

        {/* Statutory Payments */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            backgroundColor: "#fffaf0",
            borderRadius: "8px",
            border: "1px solid #fed7aa",
          }}
        >
          <h3 style={{ color: "#c2410c", fontWeight: "bold", marginBottom: "1.5rem", fontSize: "18px" }}>
            Statutory payments included in the pay 'In this employment' figure above
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <label style={labelStyle}>
              Statutory Maternity Pay
              <input
                type="text"
                value={formData.statutoryMaternityPay}
                onChange={(e) => handleInputChange("statutoryMaternityPay", e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Statutory Paternity Pay
              <input
                type="text"
                value={formData.statutoryPaternityPay}
                onChange={(e) => handleInputChange("statutoryPaternityPay", e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Statutory Shared Parental Pay
              <input
                type="text"
                value={formData.statutorySharedParentalPay}
                onChange={(e) => handleInputChange("statutorySharedParentalPay", e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Statutory Adoption Pay
              <input
                type="text"
                value={formData.statutoryAdoptionPay}
                onChange={(e) => handleInputChange("statutoryAdoptionPay", e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Statutory Parental Bereavement Pay
              <input
                type="text"
                value={formData.statutoryBereavementPay}
                onChange={(e) => handleInputChange("statutoryBereavementPay", e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>
        </div>

        {/* Other Details */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            backgroundColor: "#fffaf0",
            borderRadius: "8px",
            border: "1px solid #fed7aa",
          }}
        >
          <h3 style={{ color: "#c2410c", fontWeight: "bold", marginBottom: "1.5rem", fontSize: "18px" }}>
            Other details
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <label style={labelStyle}>
              Student Loan deductions in this employment <br/>(whole £s only)
              <input
                type="text"
                value={employee.studentLoanDto.totalDeductionAmountInStudentLoan}
                onChange={(e) => handleInputChange("studentLoanDeductions", e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Postgraduate Loan deductions in this employment <br/> (whole £s only)
              <input
                type="text"
                value={employee.postGraduateLoanDto.totalDeductionAmountInPostgraduateLoan}
                onChange={(e) => handleInputChange("postgraduateLoanDeductions", e.target.value)}
                style={inputStyle}
              />
            </label>
          </div>
          <label style={labelStyle}>
            To employee
            <textarea
             value={`${employee.firstName} ${employee.lastName}\n${employee.address}`}
              onChange={(e) => handleInputChange("toEmployee", e.target.value)}
              style={{ ...inputStyle, height: "80px", resize: "vertical" }}
            />
          </label>
        </div>

        {/* Employer Details */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            backgroundColor: "#fff7ed",
            borderRadius: "8px",
            border: "1px solid #fed7aa",
          }}
        >
          <label style={{ ...labelStyle, marginBottom: "1.5rem" }}>
            Your employer's full name and address (including postcode)
            <textarea
              rows="4"
              value={`${employer.employerName}\n${employer.employerAddress}\n${employer.employerPostCode}`}
              onChange={(e) => handleInputChange("employerDetails", e.target.value)}
              style={{ ...inputStyle, height: "100px", resize: "vertical" }}
            />
          </label>

          <label style={labelStyle}>
            Employer PAYE reference
            <input
              type="text"
              value={employer.taxOfficeDto.payeReference}
              onChange={(e) => handleInputChange("employerPAYE", e.target.value)}
              style={inputStyle}
            />
          </label>
          <h4 style={{color: "#1e3a8a", fontWeight:"bold", margin: "15px 0 10px 0", fontSize: "14px"}}>Certificate by Employer/Paying Office</h4>
        <p style={{margin: "0", fontSize:"13px", lineHeight:"1.4"}}>
          This form shows your total pay for Income Tax purposes in this employment for the year. <br/> Any overtime, bonus, commission etc, 
          Statutory Sick Pay, Statutory Maternity Pay, Statutory Paternity Pay, Statutory Shared Parental Pay, 
          Statutory Parental Bereavement Pay or Statutory Adoption Pay is included.
        </p>
        </div>

        {/* <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <button
            onClick={handleDownload}
            disabled={isGeneratingPDF}
            style={{
              backgroundColor: isGeneratingPDF ? "#9ca3af" : "#16a34a",
              color: "white",
              padding: "1rem 2rem",
              borderRadius: "8px",
              border: "none",
              cursor: isGeneratingPDF ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {isGeneratingPDF ? "Generating PDF..." : "Download P60 PDF"}
          </button>
        </div> */}
        <div style={{textAlign:"center", marginTop: "30px"}}>
        <p style={{fontSize:"10px", color:"#1e3a8a", margin:"0"}}>P60 (Substitute)(2025 to 2026)</p>
      </div>
      </div>
    </div>}
    </div>
  )
}

export default DummyP60form