import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// Import brands data
import brandsData from "./details.json";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [parts, setParts] = useState([]);
  const [mileages, setMileages] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Get token from local storage
  const token = localStorage.getItem("token");
  const API_URL = "https://servilog-backend.vercel.app";

  // Helper function to get logo path by brand name
  const getLogoBrand = (brandName) => {
    if (!brandName) return null;

    const brand = brandsData.brands.find(
      (b) => b.name && b.name.toLowerCase() === brandName.toLowerCase()
    );
    return brand?.logo || null;
  };

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setLoading(true);

        // Check if token exists
        if (!token) {
          setError("Authentication required. Please log in again.");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        // Fetch vehicle details with Authorization header
        const vehicleResponse = await axios.get(`${API_URL}/vehicle/id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Vehicle response:", vehicleResponse.data);

        if (vehicleResponse.data.success) {
          // Access data from payload instead of data
          setVehicle(vehicleResponse.data.payload);
        } else {
          setError("Failed to fetch vehicle details");
          setLoading(false);
          return;
        }

        // Fetch parts with Authorization header
        try {
          const partsResponse = await axios.get(
            `${API_URL}/part/vehicle/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Parts response:", partsResponse.data);

          if (partsResponse.data.success) {
            setParts(partsResponse.data.payload || []);
          } else {
            // It's okay to have no parts - this isn't an error
            setParts([]);
          }
        } catch (partsErr) {
          console.log("Parts fetch error:", partsErr);
          // 404 means "no parts found", which is expected for a new vehicle
          if (partsErr.response?.status === 404) {
            setParts([]);
          } else {
            console.error("Error fetching parts:", partsErr);
          }
        }

        // Fetch mileages with Authorization header
        try {
          const mileagesResponse = await axios.get(
            `${API_URL}/mileage/vehicle/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Mileages response:", mileagesResponse.data);

          if (mileagesResponse.data.success) {
            // Sort mileages by date ascending
            const sortedMileages = (mileagesResponse.data.payload || []).sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            );
            setMileages(sortedMileages);
          } else {
            // It's okay to have no mileage records - this isn't an error
            setMileages([]);
          }
        } catch (mileageErr) {
          console.log("Mileage fetch error:", mileageErr);
          // 404 means "no mileages found", which is expected for a new vehicle
          if (mileageErr.response?.status === 404) {
            setMileages([]);
          } else {
            console.error("Error fetching mileages:", mileageErr);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching vehicle data:", err);

        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            navigate("/login");
          }, 2000);
        } else {
          setError("An error occurred while fetching vehicle data");
        }
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicleData();
    }
  }, [id, API_URL, navigate, token]);

  // Prepare chart data for mileage
  const chartData = {
    labels: mileages.map((m) => new Date(m.date).toLocaleDateString()),
    datasets: [
      {
        label: "Mileage (km)",
        data: mileages.map((m) => m.mileage),
        fill: false,
        backgroundColor: "#FECB00",
        borderColor: "#D52B1E",
        tension: 0.2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Mileage History",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Kilometers",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  // Helper function to get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case "GOOD":
        return "bg-green-100 text-green-800";
      case "MAINTENANCE_DUE":
        return "bg-yellow-100 text-yellow-800";
      case "MAINTENANCE_OVERDUE":
        return "bg-red-100 text-red-800";
      case "MAINTAINED/REPLACED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get readable status label
  const getStatusLabel = (status) => {
    switch (status) {
      case "GOOD":
        return "Good";
      case "MAINTENANCE_DUE":
        return "Maintenance Due";
      case "MAINTENANCE_OVERDUE":
        return "Maintenance Overdue";
      case "MAINTAINED/REPLACED":
        return "Maintained/Replaced";
      default:
        return status || "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D52B1E]"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error || "Vehicle not found"}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/vehicles")}
          className="flex items-center text-[#D52B1E] hover:text-[#B01D11] transition-colors"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Back to Vehicles
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate("/vehicles")}
        className="flex items-center text-[#D52B1E] hover:text-[#B01D11] mb-4 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        Back to Vehicles
      </button>

      {/* Vehicle header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="h-2 bg-gradient-to-r from-[#D52B1E] to-[#FECB00]"></div>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {vehicle.name}
              </h1>
              <div className="flex items-center mt-1">
                {getLogoBrand(vehicle.brand) ? (
                  <>
                    <img
                      src={getLogoBrand(vehicle.brand)}
                      alt={`${vehicle.brand} logo`}
                      className="h-6 w-auto mr-2"
                    />
                    <p className="text-lg text-gray-600">
                      {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ""}
                    </p>
                  </>
                ) : (
                  <p className="text-lg text-gray-600">
                    {vehicle.brand} {vehicle.model}{" "}
                    {vehicle.year ? `(${vehicle.year})` : ""}
                  </p>
                )}
              </div>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                vehicle.status
              )}`}
            >
              {getStatusLabel(vehicle.status)}
            </span>
          </div>

          <div className="mt-6 flex space-x-4">
            <Link
              to={`/vehicles/edit/${vehicle.id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D52B1E]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Vehicle
            </Link>
            <Link
              to={`/mileage/add/${vehicle.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#D52B1E] hover:bg-[#B01D11] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D52B1E]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Mileage
            </Link>
            <Link
              to={`/parts/vehicle/${vehicle.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-800 bg-[#FECB00] hover:bg-[#E0B500] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FECB00]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Manage Parts
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex -mb-px space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-[#D52B1E] text-[#D52B1E]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "parts"
                ? "border-[#D52B1E] text-[#D52B1E]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("parts")}
          >
            Parts
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "mileage"
                ? "border-[#D52B1E] text-[#D52B1E]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("mileage")}
          >
            Mileage History
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Information Card */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Vehicle Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{vehicle.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Brand:</span>
                  {getLogoBrand(vehicle.brand) ? (
                    <div className="flex items-center">
                      <img
                        src={getLogoBrand(vehicle.brand)}
                        alt={vehicle.brand}
                        className="h-6 w-auto mr-2"
                      />
                      <span className="font-medium">{vehicle.brand}</span>
                    </div>
                  ) : (
                    <span className="font-medium">{vehicle.brand}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{vehicle.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-medium">
                    {vehicle.year || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(
                      vehicle.status
                    )}`}
                  >
                    {getStatusLabel(vehicle.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Maintenance Summary Card */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Maintenance Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Mileage:</span>
                  <span className="font-medium">
                    {mileages.length > 0
                      ? `${mileages[mileages.length - 1].mileage} km`
                      : "No data"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parts Count:</span>
                  <span className="font-medium">{parts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Parts Needing Attention:
                  </span>
                  <span className="font-medium">
                    {
                      parts.filter(
                        (part) =>
                          part.status === "MAINTENANCE_DUE" ||
                          part.status === "MAINTENANCE_OVERDUE"
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Mileage Update:</span>
                  <span className="font-medium">
                    {mileages.length > 0
                      ? new Date(
                          mileages[mileages.length - 1].date
                        ).toLocaleDateString()
                      : "No data"}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Parts Card */}
            <div className="border border-gray-200 rounded-lg p-5 md:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Parts Needing Attention
                </h3>
                <button
                  onClick={() => setActiveTab("parts")}
                  className="text-sm text-[#D52B1E] hover:text-[#B01D11]"
                >
                  View All Parts
                </button>
              </div>

              {parts.filter(
                (part) =>
                  part.status === "MAINTENANCE_DUE" ||
                  part.status === "MAINTENANCE_OVERDUE"
              ).length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  No parts need attention
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Brand & Model
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parts
                        .filter(
                          (part) =>
                            part.status === "MAINTENANCE_DUE" ||
                            part.status === "MAINTENANCE_OVERDUE"
                        )
                        .map((part) => (
                          <tr key={part.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {part.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {part.brand} {part.model}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(
                                  part.status
                                )}`}
                              >
                                {getStatusLabel(part.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Link
                                to={`/parts/${part.id}`}
                                className="text-[#D52B1E] hover:text-[#B01D11] mr-3"
                              >
                                View
                              </Link>
                              <button className="text-blue-600 hover:text-blue-800">
                                Maintain
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Parts Tab */}
        {activeTab === "parts" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Vehicle Parts
              </h3>
              <Link
                to={`/parts/add/${vehicle.id}`}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#D52B1E] hover:bg-[#B01D11]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Part
              </Link>
            </div>

            {parts.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No parts
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new part.
                </p>
                <div className="mt-6">
                  <Link
                    to={`/parts/add/${vehicle.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#D52B1E] hover:bg-[#B01D11]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Part
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {parts.map((part) => (
                  <div
                    key={part.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md"
                  >
                    <div
                      className={`h-2 ${
                        part.status === "GOOD"
                          ? "bg-green-500"
                          : part.status === "MAINTENANCE_DUE"
                          ? "bg-[#FECB00]"
                          : part.status === "MAINTENANCE_OVERDUE"
                          ? "bg-[#D52B1E]"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {part.name}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(
                            part.status
                          )}`}
                        >
                          {getStatusLabel(part.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {part.brand} {part.model}{" "}
                        {part.year ? `(${part.year})` : ""}
                      </p>

                      <div className="mt-4 space-y-2">
                        <div className="grid grid-cols-2 text-sm">
                          <span className="text-gray-500">Installation:</span>
                          <span className="text-right">
                            {part.install_mileage} km
                          </span>
                        </div>
                        <div className="grid grid-cols-2 text-sm">
                          <span className="text-gray-500">Lifetime:</span>
                          <span className="text-right">
                            {part.lifetime_mileage} km
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between space-x-2">
                        <Link
                          to={`/parts/${part.id}`}
                          className="flex-1 text-center py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => {
                            /* Add maintain functionality */
                          }}
                          className="flex-1 text-center py-2 bg-blue-500 rounded text-sm font-medium text-white hover:bg-blue-600"
                          disabled={part.status === "MAINTAINED/REPLACED"}
                        >
                          Maintain
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mileage Tab */}
        {activeTab === "mileage" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Mileage History
              </h3>
              <Link
                to={`/mileage/add/${vehicle.id}`}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#D52B1E] hover:bg-[#B01D11]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Mileage
              </Link>
            </div>

            {mileages.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 17l-5-5 5-5m0 10h10"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No mileage data
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start tracking your vehicle's mileage.
                </p>
                <div className="mt-6">
                  <Link
                    to={`/mileage/add/${vehicle.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#D52B1E] hover:bg-[#B01D11]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add First Mileage
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Chart */}
                <div className="border border-gray-200 rounded-lg p-5 bg-white">
                  <div className="h-64">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>

                {/* Mileage Records Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mileage (km)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Change
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mileages
                        .slice()
                        .reverse()
                        .map((mileage, index, array) => {
                          const prevMileage =
                            index < array.length - 1
                              ? array[index + 1].mileage
                              : mileage.mileage;
                          const difference = mileage.mileage - prevMileage;

                          return (
                            <tr key={mileage.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(mileage.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {mileage.mileage.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {index < array.length - 1 ? (
                                  <span
                                    className={
                                      difference > 0 ? "text-green-600" : ""
                                    }
                                  >
                                    +{difference.toLocaleString()}
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                <Link
                                  to={`/mileage/edit/${mileage.id}`}
                                  className="text-[#D52B1E] hover:text-[#B01D11] mr-3"
                                >
                                  Edit
                                </Link>
                                <button
                                  className="text-gray-600 hover:text-gray-900"
                                  onClick={() => {
                                    /* Add delete functionality */
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails;
