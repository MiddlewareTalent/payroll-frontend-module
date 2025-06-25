import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Paye() {
  const navigate = useNavigate();
  const [payeData, setPayeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/v1/employer/allEmployers')
      .then(response => {
        if (response.data && response.data.length > 0) {
          const otherDetails = response.data[0].otherEmployerDetailsDto;
          setPayeData({
            totalPAYEYTD: otherDetails.totalPAYEYTD,
            totalEmployeesNIYTD: otherDetails.totalEmployeesNIYTD,
            totalEmployersNIYTD: otherDetails.totalEmployersNIYTD
          });
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching PAYE data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg font-semibold">Loading PAYE data...</div>;
  }

  if (!payeData) {
    return <div className="text-center mt-10 text-red-500 font-semibold">No PAYE data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PAYE Summary</h1>

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
      <div className= "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <table className="w-full table-auto border-collapse text-center">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-3 px-4 border">Total INCOME TAX YTD</th>
            <th className="py-3 px-4 border">Total Employees NI YTD</th>
            <th className="py-3 px-4 border">Total Employers NI YTD</th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          <tr>
            <td className="py-3 px-4 border">£{payeData.totalPAYEYTD.toFixed(2)}</td>
            <td className="py-3 px-4 border">£{payeData.totalEmployeesNIYTD.toFixed(2)}</td>
            <td className="py-3 px-4 border">£{payeData.totalEmployersNIYTD.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );
}
