import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    userType: "", // employer or employee
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const checkEmailExists = async (email, userType) => {

    try {
      let url = "";

      if (userType === "employee") {
       
        url = `http://localhost:8081/api/employee-details/test/email/${email}`;
      } 
      else if (userType === "employer") {
        
        url = `http://localhost:8081/api/v1/employer/test/email/${email}`;
      }
       else {
        
        return false;
      }
     
      const response = await axios.get(url);
      return response.data === true;
    } catch (err) {
      console.error(`Error checking ${userType} email:`, err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = formData.email.trim().toLowerCase();

    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!formData.userType) {
      setError("Please select user type");
      return;
    }

    const emailExists = await checkEmailExists(email, formData.userType);

    if (!emailExists) {
      setError(
        `No ${formData.userType} found with this email. Please check and try again.`
      );
      return;
    }

    const userData = {
      email,
      type: formData.userType,
      loginTime: new Date().toISOString(),
    };

    onLogin(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    if (formData.userType === "employee") {
      navigate("/employee-dashboard");
    } else {
      navigate("/employer-dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded shadow">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Payroll System</h2>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">I am a:</p>
            <label className="inline-flex items-center mr-6 cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="employer"
                checked={formData.userType === "employer"}
                onChange={handleChange}
                className="form-radio h-5 w-5 text-indigo-600"
              />
              <span className="ml-2">Employer</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="employee"
                checked={formData.userType === "employee"}
                onChange={handleChange}
                className="form-radio h-5 w-5 text-indigo-600"
              />
              <span className="ml-2">Employee</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
