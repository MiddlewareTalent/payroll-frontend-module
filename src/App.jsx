import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import EmployeeDashboard from "./components/EmployeeDashboard";
import EmployerDashboard from "./components/EmployerDashboard";
import CompanyRegistration from "./components/CompanyRegistration";
import AddEmployee from "./components/AddEmployee";
import EmployeeDetails from "./components/EmployeeDetails";
import PayrollRun from "./components/PayrollRun";
import Reports from "./components/Reports";
import PayslipView from "./components/PayslipView";
import Paye from "./components/Paye";
import AddCompanyDetails from "./components/AddCompanyDetails";
import CompanyDetails from "./components/CompanyDetails";

function App() {
  // Load from localStorage on initial render
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [company, setCompany] = useState(() => {
    const storedCompany = localStorage.getItem("company");
    return storedCompany ? JSON.parse(storedCompany) : null;
  });

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
        resolve(payslipData);
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

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setCompany(null);
    setEmployees([]);
    setPayslips([]);
    localStorage.removeItem("user");
    localStorage.removeItem("company");
  };

  const handleCompanyRegister = (companyData) => {
    setCompany(companyData);
    localStorage.setItem("company", JSON.stringify(companyData));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Root route */}
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

          <Route
            path="/login"
            element={
              !user ? (
                <Login onLogin={handleLogin} employees={employees} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

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

           <Route
            path="/paye"
            element={
              <Paye/>
            }
          />

         <Route path="/add-company" element={<AddCompanyDetails />} />
                <Route path="/company-details"element={<CompanyDetails/>}/>

          <Route
            path="/employee-details"
            element={
              user?.type === "employer" && company ? (
                <EmployeeDetails
                  company={company}
                  employees={employees}
                  payslips={payslips}
                  onLogout={handleLogout}
                  onUpdateEmployee={handleUpdateEmployee}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

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

          <Route
            path="/reports"
            element={
              user?.type === "employer" && company ? (
                <Reports
                  company={company}
                  employees={employees}
                  payslips={payslips}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/payslip/:paySlipRef"
            element={
              user ? (
                <PayslipView payslips={employerPayslips} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
