import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import EmployeeDashboard from "./components/EmployeeDashboard";
import EmployerDashboard from "./components/EmployerDashboard";
import AddEmployee from "./components/AddEmployee";
import EmployeeDetails from "./components/EmployeeDetails";
import PayrollRun from "./components/PayrollRun";
import Reports from "./components/Reports";
import AddCompanyDetails from "./components/AddCompanyDetails";
import CompanyDetails from "./components/CompanyDetails";
import PayslipView from "./components/PayslipView";
import Paye from "./components/Paye";


function App() {
  const [user, setUser] = useState(null);
 
const [employees, setEmployees] = useState([]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
   
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Login page */}
          <Route path="/" element={<Navigate to="/login" replace/>}/>
          <Route
  path="/login"
  element={!user ? <Login onLogin={handleLogin} employees={employees} /> : user==="employee" ?<EmployeeDashboard/>:<EmployerDashboard/>}
/>
          <Route path="/employer-dashboard" element={<EmployerDashboard/>}/>
          <Route path="/reports" element={<Reports />} />
          <Route path="/add-company" element={<AddCompanyDetails />} />
          <Route path="/payroll-run"element={<PayrollRun/>}/>
          <Route path="/add-employee"element={<AddEmployee/>}/>
          <Route path="/employee-details"element={<EmployeeDetails/>}/>
          <Route path="/employee-dashboard"element={<EmployeeDashboard/>}/>
          <Route path="/company-details"element={<CompanyDetails/>}/>
          <Route  path="/payslip/:paySlipRef" element={<PayslipView />} />
          <Route path="/paye" element={<Paye/>}/>
         </Routes>
      </div>
    </Router>

    
  );
}

export default App;

