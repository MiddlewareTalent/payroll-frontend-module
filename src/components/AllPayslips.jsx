import axios from "axios"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom";

export const AllPayslips = () => {

    const [employees, setEmployees] = useState([]);
    const [employeeId, setEmployeeId] = useState([]);
    const [year, setYear] = useState([]);
    const [month, setMonth] = useState("");
    const [payslips, setPayslips] = useState([]);

    const listOfYears = [2025, 2024, 2023, 2022, 2021, 2020]
    const listOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    useEffect(() => {
        const fetchAllEmployees = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/employee-details/allEmployees");
                setEmployees(response.data);
                console.log(response.data)
            }
            catch (e) {
                console.log("error fetching the employee details");

            }
            console.log("Hello")
        }
        fetchAllEmployees();
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(month)
        console.log(year)
        const periodEnd = month + " " + year;
        console.log(periodEnd)
        try {
            const response = await axios.get(`http://localhost:8080/payslip/fetch/payslip/${employeeId}/${periodEnd}`);
            setPayslips(response.data);
            console.log(response.data);
        }
        catch (e) {
            console.log("error fetching payslips");
        }
    }
    return (
        <div className="flex flex-col justify-start items-center h-screen p-2 bg-gray-100 px-4">

            <div className="w-full max-w-4xl">
                {employees.length > 0 && (
                    <form
                        onSubmit={handleSubmit}
                        className=" p-6  "
                    >
                        <div className="flex flex-wrap md:flex-nowrap gap-4 items-end justify-between">
                            {/* Select Employee */}
                            <div className="flex flex-col flex-1 min-w-[180px]">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Select Employee
                                </label>
                                <select
                                    onChange={(e) => setEmployeeId(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">Select employee</option>
                                    {employees.map((each) => (
                                        <option key={each.employeeId} value={each.employeeId}>
                                            {each.firstName} {each.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Select Year */}
                            <div className="flex flex-col flex-1 min-w-[120px]">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Select Year
                                </label>
                                <select
                                    onChange={(e) => setYear(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">Select Year</option>
                                    {listOfYears.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Select Month */}
                            <div className="flex flex-col flex-1 min-w-[120px]">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Select Month
                                </label>
                                <select
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="">Select month</option>
                                    {listOfMonths.map((month) => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-5 md:pt-0">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
                                >
                                    View Payslip
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full max-w-6xl">
                {payslips.map((each) => (
                    <Link
                        key={each.paySlipReference}
                        to={`/payslip/${each.paySlipReference}`}
                        className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5"
                    >
                        <div className="mb-2 text-lg font-semibold text-gray-800">
                            {each.firstName} {each.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                         
                            <p><span className="font-medium">Reference:</span> {each.paySlipReference}</p>
                        </div>
                    </Link>
                ))}
            </div>


        </div>

    )
}