import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"

const HMRCIntegration = () => {
  const navigate = useNavigate()
  const [connectionStatus, setConnectionStatus] = useState("disconnected")
  const [loading, setLoading] = useState(true)
  const [submissionHistory, setSubmissionHistory] = useState([])
  const [hmrcCredentials, setHmrcCredentials] = useState({
    clientId: "",
    clientSecret: "",
    serverToken: "",
  })
  const [testConnection, setTestConnection] = useState(false)
  const [connectionDetails, setConnectionDetails] = useState(null)

  useEffect(() => {
    checkHMRCStatus()
    fetchSubmissionHistory()
  }, [])

  const checkHMRCStatus = async () => {
    try {
      const response = await axios.get("http://localhost:8080/hmrc/status")
      setConnectionStatus(response.data.status)
      setConnectionDetails(response.data.details)

      // Check for stored credentials
      const storedCredentials = {
        clientId: Cookies.get("hmrc_client_id") || "",
        clientSecret: Cookies.get("hmrc_client_secret") || "",
        serverToken: Cookies.get("hmrc_token") || "",
      }
      setHmrcCredentials(storedCredentials)

      setLoading(false)
    } catch (error) {
      console.error("Error checking HMRC status:", error)
      setConnectionStatus("disconnected")
      setLoading(false)
    }
  }

  const fetchSubmissionHistory = async () => {
    try {
      const response = await axios.get("http://localhost:8080/hmrc/submission-history")
      setSubmissionHistory(response.data)
    } catch (error) {
      console.error("Error fetching submission history:", error)
      setSubmissionHistory([])
    }
  }

  const handleConnect = async () => {
    setTestConnection(true)
    try {
      const response = await axios.post("http://localhost:8080/hmrc/connect", hmrcCredentials)

      if (response.data.success) {
        setConnectionStatus("connected")
        setConnectionDetails(response.data.details)

        // Store credentials securely
        Cookies.set("hmrc_client_id", hmrcCredentials.clientId, { expires: 30 })
        Cookies.set("hmrc_client_secret", hmrcCredentials.clientSecret, { expires: 30 })

        alert("Successfully connected to HMRC!")
      } else {
        alert("Failed to connect to HMRC: " + response.data.message)
      }
    } catch (error) {
      console.error("Error connecting to HMRC:", error)
      alert("Connection failed. Please check your credentials.")
    } finally {
      setTestConnection(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await axios.post("http://localhost:8080/hmrc/disconnect")
      setConnectionStatus("disconnected")
      setConnectionDetails(null)

      // Clear stored credentials
      Cookies.remove("hmrc_client_id")
      Cookies.remove("hmrc_client_secret")
      Cookies.remove("hmrc_token")

      setHmrcCredentials({
        clientId: "",
        clientSecret: "",
        serverToken: "",
      })

      alert("Disconnected from HMRC")
    } catch (error) {
      console.error("Error disconnecting from HMRC:", error)
      alert("Failed to disconnect")
    }
  }

  const handleOAuthLogin = () => {
    const scope = "read:vat write:vat"
    window.location.href = `http://localhost:8080/oauth/login/${scope}`
  }

  const refreshToken = async () => {
    try {
      const response = await axios.post("http://localhost:8080/hmrc/refresh-token")
      if (response.data.success) {
        Cookies.set("hmrc_token", response.data.token, { expires: 1 })
        setConnectionStatus("connected")
        alert("Token refreshed successfully")
      }
    } catch (error) {
      console.error("Error refreshing token:", error)
      alert("Failed to refresh token")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading HMRC integration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HMRC Integration</h1>
              <p className="text-sm text-gray-600">Manage your HMRC connection and submissions</p>
            </div>
            <button
              onClick={() => navigate("/reports")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Reports
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Connection Status</h3>
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    connectionStatus === "connected" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`text-sm font-medium ${
                    connectionStatus === "connected" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {connectionStatus === "connected" ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>

            {connectionDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Connection Details</h4>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Environment</dt>
                    <dd className="text-sm text-gray-900">{connectionDetails.environment || "Sandbox"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Last Connected</dt>
                    <dd className="text-sm text-gray-900">
                      {connectionDetails.lastConnected
                        ? new Date(connectionDetails.lastConnected).toLocaleString()
                        : "Never"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Token Expires</dt>
                    <dd className="text-sm text-gray-900">
                      {connectionDetails.tokenExpiry ? new Date(connectionDetails.tokenExpiry).toLocaleString() : "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Scopes</dt>
                    <dd className="text-sm text-gray-900">{connectionDetails.scopes || "read:vat write:vat"}</dd>
                  </div>
                </dl>
              </div>
            )}

            <div className="flex space-x-4">
              {connectionStatus === "connected" ? (
                <>
                  <button
                    onClick={handleDisconnect}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Disconnect
                  </button>
                  <button
                    onClick={refreshToken}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Refresh Token
                  </button>
                </>
              ) : (
                <button
                  onClick={handleOAuthLogin}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Connect to HMRC
                </button>
              )}
            </div>
          </div>

          {/* Manual Configuration */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Configuration</h3>
            <p className="text-sm text-gray-600 mb-4">Configure HMRC credentials manually (for advanced users)</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                  Client ID
                </label>
                <input
                  type="text"
                  id="clientId"
                  value={hmrcCredentials.clientId}
                  onChange={(e) => setHmrcCredentials({ ...hmrcCredentials, clientId: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter HMRC Client ID"
                />
              </div>

              <div>
                <label htmlFor="clientSecret" className="block text-sm font-medium text-gray-700">
                  Client Secret
                </label>
                <input
                  type="password"
                  id="clientSecret"
                  value={hmrcCredentials.clientSecret}
                  onChange={(e) => setHmrcCredentials({ ...hmrcCredentials, clientSecret: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter HMRC Client Secret"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="serverToken" className="block text-sm font-medium text-gray-700">
                  Server Token
                </label>
                <input
                  type="password"
                  id="serverToken"
                  value={hmrcCredentials.serverToken}
                  onChange={(e) => setHmrcCredentials({ ...hmrcCredentials, serverToken: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter Server Token"
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleConnect}
                disabled={testConnection || !hmrcCredentials.clientId || !hmrcCredentials.clientSecret}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                {testConnection ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Testing Connection...
                  </>
                ) : (
                  "Test Connection"
                )}
              </button>
            </div>
          </div>

          {/* Submission History */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Submission History</h3>

              {submissionHistory.length === 0 ? (
                <p className="text-sm text-gray-500">No submissions found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submission ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submissionHistory.map((submission, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {submission.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.submissionId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(submission.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                submission.status === "Success"
                                  ? "bg-green-100 text-green-800"
                                  : submission.status === "Failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {submission.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* API Endpoints */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">HMRC API Endpoints</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Sandbox Environment</h4>
                <p className="text-sm text-gray-600 mb-2">For testing and development</p>
                <code className="text-xs bg-gray-100 p-2 rounded block">https://test-api.service.hmrc.gov.uk</code>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Production Environment</h4>
                <p className="text-sm text-gray-600 mb-2">For live submissions</p>
                <code className="text-xs bg-gray-100 p-2 rounded block">https://api.service.hmrc.gov.uk</code>
              </div>
            </div>
          </div>

          {/* Help & Documentation */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Help & Documentation</h3>
            <div className="space-y-3">
              <a
                href="https://developer.service.hmrc.gov.uk/api-documentation"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:text-blue-800"
              >
                → HMRC API Documentation
              </a>
              <a
                href="https://developer.service.hmrc.gov.uk/api-documentation/docs/authorisation"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:text-blue-800"
              >
                → OAuth 2.0 Authorization Guide
              </a>
              <a
                href="https://developer.service.hmrc.gov.uk/api-documentation/docs/testing"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:text-blue-800"
              >
                → Testing in Sandbox
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HMRCIntegration
