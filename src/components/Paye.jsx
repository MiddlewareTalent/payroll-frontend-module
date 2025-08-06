import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Paye() {
  const navigate = useNavigate();
  const [allEmployers, setAllEmployers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/v1/employer/allEmployers");
        console.log("employers Data fetched:", response.data); 
        setAllEmployers(response.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployers();
  }, []);


 
  if (!allEmployers) {
    return <div className="text-center mt-10 text-red-500 font-semibold">No PAYE data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PAYE Summary</h1>
                <p className="mt-1 text-sm text-gray-600">
     Summary of payroll deductions: Tax, Employee NI, and Employer NI
  </p>
            </div>
            <button
              onClick={() => navigate("/employer-dashboard")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
      <div className= "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total INCOME TAX YTD</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Employees NI YTD</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Employers NI YTD</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">£ {allEmployers[0]?.otherEmployerDetailsDTO?.totalPaidGrossAmountYTD.toFixed(2)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">£ {allEmployers[0]?.otherEmployerDetailsDTO?.totalEmployeesNIYTD}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">£ {allEmployers[0]?.otherEmployerDetailsDTO?.totalEmployersNIYTD.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );
}
