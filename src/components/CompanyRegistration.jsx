
import { useState } from "react";
import EmployerDashboard from "./EmployerDashboard";

const CompanyRegistration = ({ email, onRegister, onBack }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    taxYear: "2024-25",
    payPeriod: "MONTHLY",
    region: "ENGLAND",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.companyName.trim() === "") {
      alert("Please enter your company name");
      return;
    }

    onRegister(formData);
   
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded shadow">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Company Registration
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Company Name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleChange}
              required
              placeholder="Enter company name"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="taxYear"
              className="block text-sm font-medium text-gray-700"
            >
              Tax Year
            </label>
            <select
              id="taxYear"
              name="taxYear"
              value={formData.taxYear}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
              <option value="2022-23">2022-23</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="payPeriod"
              className="block text-sm font-medium text-gray-700"
            >
              Pay Period
            </label>
            <select
              id="payPeriod"
              name="payPeriod"
              value={formData.payPeriod}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="WEEKLY">Weekly</option>
              <option value="FORTNIGHTLY">Fortnightly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-700"
            >
              Tax Region
            </label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="ENGLAND">England</option>
              <option value="SCOTLAND">Scotland</option>
              <option value="WALES">Wales</option>
              <option value="NORTHERN_IRELAND">Northern Ireland</option>
            </select>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Register Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyRegistration;