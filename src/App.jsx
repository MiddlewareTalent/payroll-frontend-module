import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import EmployeeDashboard from "./components/EmployeeDashboard";
import EmployerDashboard from "./components/EmployerDashboard";
import AddEmployee from "./components/AddEmployee";
import EmployeeDetails from "./components/EmployeeDetails";
import PayrollRun from "./components/PayrollRun";
import Reports from "./components/Reports";
// import AddCompanyDetails from "./components/AddCompanyDetails";
import CompanyDetails from "./components/CompanyDetails";
import PayslipView from "./components/PayslipView";
import Paye from "./components/Paye";
import DummyP60form from './components/DummyP60form'
import P60formBlue from "./components/P60formBlue";
import AccessToken from "./components/AccessToken";
import YearEndReport from "./components/YearEndReport";
import HMRCIntegration from "./components/HMRCIntegration";
import EmployerDetails from "./components/EmployerDetails";
import { AllPayslips } from "./components/AllPayslips";
import ModalWrapper from "./ModalWrapper/ModalWrapper";

function App() {
 const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
});
const [employees, setEmployees] = useState([]);

const handleLogin = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
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
          <Route path="/access-token/:code" element={<AccessToken/>}/>
          <Route path="/reports" element={<Reports />} />
          
          <Route path="/payroll-run" element={<PayrollRun/>}/>
          <Route path="/add-employee" element={<AddEmployee/>}/>
          <Route path="/employee-details" element={<EmployeeDetails/>}/>
          <Route path="/employee-dashboard" element={<EmployeeDashboard/>}/>
          <Route path="/employee-dashboard/payslips" element={<EmployeeDashboard />} />
          <Route path="/employee-dashboard/p60" element={<EmployeeDashboard />} />
          <Route path="/company-details"element={<CompanyDetails/>}/>
          {/* <Route path="/add-company/" element={<CompanyDetails />} /> */}
          <Route  path="/payslip/:paySlipRef" element={<PayslipView />} />
          <Route path="/paye" element={<Paye/>}/>
          <Route path='/P60Form/:employeeId' element={<DummyP60form/>}/>
          <Route path='/P60FormBlue' element={<P60formBlue/>}/>
          <Route path="/year-end-report" element={<YearEndReport/>}/>
          <Route path="/hmrc-integration" element={<HMRCIntegration/>} />
          <Route path="/employer-details" element={<EmployerDetails/>} />
          <Route path="/all-payslips" element={<AllPayslips/>}/>
          <Route path="/modalwrapper" element={<ModalWrapper/>}/>

         </Routes>
      </div>
    </Router>

    
  );
}

export default App;

