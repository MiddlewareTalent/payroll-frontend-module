import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import EmployeeDashboard from "./components/EmployeeDashboard";
import EmployerDashboard from "./components/EmployerDashboard";
import CompanyRegistration from "./components/CompanyRegistration";
import AddEmployee from "./components/AddEmployee";
import EmployeeDetails from "./components/EmployeeDetails";
import MyPayslips from "./components/MyPlayslips";
import PayrollRun from "./components/PayrollRun";
import Reports from "./components/Reports";
import PayslipView from "./components/PayslipView";

function App() {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [employerPayslips, setEmployerPayslips] = useState([]);

  const generateUniqueId = () => {
  return `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

  
const handleGeneratePayslip = (payslipData) => {
  return new Promise((resolve) => {
    setEmployerPayslips((prev) => {
      const updated = [...prev, payslipData];
      resolve(payslipData); // resolve with the new payslip after update
      return updated;
    });
  });
};



  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
  };
  // Login handler updates user state
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Logout clears all state
  const handleLogout = () => {
    setUser(null);
    setCompany(null);
    setEmployees([]);
    setPayslips([]);
  };

  // Company registration handler
  const handleCompanyRegister = (companyData) => {
    setCompany(companyData);
  };

  return (
   
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Root route: redirect based on user & company */}
          <Route
            path="/"
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : user.type === "employer" && !company ? (
                <Navigate to="/company-registration" replace />
              ) : user.type === "employer" && company ? (
                <Navigate to="/employer-dashboard" replace />
              ) : user.type === "employee" ? (
                <Navigate to="/employee-dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Login page */}
          <Route
  path="/login"
  element={!user ? <Login onLogin={handleLogin} employees={employees} /> : <Navigate to="/" replace />}
/>


          {/* Company Registration */}
          <Route
            path="/company-registration"
            element={
              user?.type === "employer" && !company ? (
                <CompanyRegistration
                  user={user}
                  onRegister={handleCompanyRegister}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Employer Dashboard */}
          <Route
            path="/employer-dashboard"
            element={
              user?.type === "employer" && company ? (
                <EmployerDashboard
                  company={company}
                  employees={employees}
                  payslips={payslips}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Employee Dashboard */}
          <Route
            path="/employee-dashboard"
            element={
              user?.type === "employee" ? (
                <EmployeeDashboard
                  user={user}
                  employees={employees}
                  payslips={payslips}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Add Employee */}
          <Route
  path="/add-employee"
  element={
    <AddEmployee
      onAddEmployee={(newEmployee) => {
        setEmployees((prev) => [...prev, newEmployee]);
        console.log("New employee added:", newEmployee);
      }}
      company={company || { payPeriod: "MONTHLY" }}
    />
  }
/>

          {/* Employee Details */}
<Route
            path="/employee-details"
            element={
              user?.type === "employer" && company ? (
                <EmployeeDetails
                  company={company}
                  employees={employees}
                  payslips={payslips}
                  onLogout={handleLogout}
                  onUpdateEmployee={handleUpdateEmployee} // Now defined
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          {/* Payroll Run */}
          <Route
  path="/payroll-run"
  element={
    user?.type === "employer" && company ? (
      <PayrollRun
        company={company}
        employees={employees}
        onGeneratePayslip={handleGeneratePayslip}
        payslips={employerPayslips}
      />
    ) : (
      <Navigate to="/" replace />
    )
  }
/>


{/* My Payslips */}
<Route
  path="/my-payslips"
  element={
    user?.type === "employee" ? (
      <MyPayslips
        payslips={payslips.filter(p => p.employeeId === user?.employeeId)}

      />
    ) : (
      <Navigate to="/" replace />
    )
  }
/>

{/* Reports */}
<Route
  path="/reports"
  element={
    user?.type === "employer" && company ? (
      <Reports company={company} employees={employees} payslips={payslips} />
    ) : (
      <Navigate to="/" replace />
    )
  }
/>

<Route
  path="/payslip/:id"
  element={user ? <PayslipView payslips={employerPayslips} /> : <Navigate to="/login" replace />}
/>



          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
