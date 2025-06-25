const P60Form = ({ employee, employer, totals }) => (
  <div className="bg-white p-6 rounded shadow text-sm">
    <h2 className="text-xl font-bold mb-2 text-center">P60 Form</h2>
    <p className="text-center text-gray-500 mb-4">
      Tax Year: {employer?.taxYear || "2023–24"}
    </p>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <p><strong>Employee Name:</strong> {employee.firstName} {employee.lastName}</p>
        <p><strong>Employee ID:</strong> {employee.employeeId}</p>
        <p><strong>NINO:</strong> {employee.nino || "AA123456A"}</p>
      </div>
      <div>
        <p><strong>Employer:</strong> {employer?.employerName || "Company Name"}</p>
        <p><strong>Reference:</strong> {employer?.employerReference || "123/ABC123"}</p>
        <p><strong>Tax Year:</strong> {employer?.taxYear || "2023–24"}</p>
      </div>
    </div>

    <hr className="my-4" />

    <div className="grid grid-cols-2 gap-4">
      <div>
        <p><strong>Total Gross Pay:</strong> £{totals.gross.toFixed(2)}</p>
        <p><strong>Total Income Tax:</strong> £{totals.tax.toFixed(2)}</p>
      </div>
      <div>
        <p><strong>Total NI:</strong> £{totals.ni.toFixed(2)}</p>
        <p><strong>Net Pay:</strong> £{totals.net.toFixed(2)}</p>
      </div>
    </div>

    <p className="mt-6 text-xs text-gray-500 text-center">
      This is a system-generated P60 summary.
    </p>
  </div>
);
