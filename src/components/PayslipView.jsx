import { useParams, useNavigate } from "react-router-dom"
import html2pdf from "html2pdf.js";

const PayslipView = ({ payslips }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const payslip = payslips.find((p) => p.paySlipReference === id);

  if (!payslip) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Payslip not found</h2>
          <button
            onClick={() => navigate("/employer")}
            style={{ marginTop: '1rem', backgroundColor: '#4F46E5', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const handleDownload = async () => {
    const element = document.getElementById("payslip-content");
    if (!element) {
      console.error("Element with id 'payslip-content' not found");
      alert("Payslip content missing, can't download PDF.");
      return;
    }

    try {
      await html2pdf().from(element).save();
      console.log("PDF saved successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. See console.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Payslip</h1>
              <p style={{ fontSize: '0.875rem', color: '#4B5563' }}>Reference: {payslip.paySlipReference}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleDownload}
                style={{ backgroundColor: '#16A34A', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', border: 'none', cursor: 'pointer' }}
              >
                Download PDF
              </button>
              <button
                onClick={() => navigate("/employer")}
                style={{ backgroundColor: '#4B5563', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '500', border: 'none', cursor: 'pointer' }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payslip Content */}
      <div
        id="payslip-content"
        style={{
          maxWidth: '64rem',
          margin: '1.5rem auto',
          padding: '2rem',
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          color: '#000000',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: '1rem',
          lineHeight: '1.5',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>PAYSLIP</h2>
          <p style={{ color: '#4B5563' }}>Pay Period: {payslip.payPeriod}</p>
          <p style={{ color: '#4B5563' }}>Tax Year: {payslip.taxYear}</p>
        </div>

        {/* Employee Details and Pay Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem',
        }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Employee Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p><strong>Name:</strong> {payslip.firstName} {payslip.lastName}</p>
              <p><strong>Employee ID:</strong> {payslip.employeeId}</p>
              <p><strong>NI Number:</strong> {payslip.NI_Number}</p>
              <p><strong>Tax Code:</strong> {payslip.taxCode}</p>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Pay Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p><strong>Pay Date:</strong> {new Date(payslip.payDate).toLocaleDateString()}</p>
              <p><strong>Period End:</strong> {new Date(payslip.periodEnd).toLocaleDateString()}</p>
              <p><strong>Pay Reference:</strong> {payslip.paySlipReference}</p>
              <p><strong>Region:</strong> {payslip.region}</p>
            </div>
          </div>
        </div>

        {/* Pay Breakdown */}
        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>Total Pay Details</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Earnings */}
            <div style={{ backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '0.5rem' }}>
              <h4 style={{ fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>Earnings</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Gross Pay</span>
                <span style={{ fontWeight: '500' }}>£{payslip.grossPayTotal}</span>
              </div>
            </div>

            {/* Deductions */}
            <div style={{ backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '0.5rem' }}>
              <h4 style={{ fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>Deductions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Personal Allowance</span>
                  <span style={{ fontWeight: '500' }}>£{payslip.personalAllowance}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Taxable Income</span>
                  <span style={{ fontWeight: '500' }}>£{payslip.taxableIncome}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Income Tax</span>
                  <span style={{ fontWeight: '500' }}>£{payslip.incomeTaxTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>National Insurance</span>
                  <span style={{ fontWeight: '500' }}>£{payslip.nationalInsurance}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #D1D5DB', paddingTop: '0.5rem' }}>
                  <span style={{ fontWeight: '700' }}>Total Deductions</span>
                  <span style={{ fontWeight: '700' }}>£{payslip.deductionsTotal}</span>
                </div>
              </div>
            </div>

            {/* Net Pay */}
            <div style={{
              backgroundColor: '#ECFDF5',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '2px solid #A7F3D0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#065F46' }}>Net Pay (Take Home)</span>
              <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#065F46' }}>£{payslip.takeHomePayTotal}</span>
            </div>
          </div>
        </div>
        </div>
    </div>
  )
}

export default PayslipView
