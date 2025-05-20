import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// Import the brands data
import brandsData from "./Vehicle/details.json";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  // Get user ID and token from local storage
  const accountId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const API_URL = "https://servilog-backend.vercel.app";

  // Helper function to get logo path by brand name
  const getLogoBrand = (brandName) => {
    if (!brandName) return null;

    const brand = brandsData.brands.find(
      (b) => b.name.toLowerCase() === brandName.toLowerCase()
    );
    return brand ? brand.logo : null;
  };

  useEffect(() => {
    fetchVehicles();
  }, [accountId]);

  const fetchVehicles = async () => {
    if (!accountId) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching vehicles for account:", accountId);
      console.log("Using token:", token);

      // Add Authorization header with the token
      const response = await axios.get(
        `${API_URL}/vehicle/account/${accountId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        // Check if the data is in 'payload' (based on your baseResponse function)
        const vehicleData = response.data.payload || [];
        console.log("Parsed vehicle data:", vehicleData);
        setVehicles(vehicleData);
      } else {
        setVehicles([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      console.log("Error response data:", err.response?.data);

      // If it's a 404, it just means there are no vehicles yet - this is not an error
      if (err.response?.status === 404) {
        console.log("No vehicles found (404) - setting empty array");
        setVehicles([]);
        setError(null); // Clear any existing error
      } else if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        // Optionally redirect to login page
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("userName");
          navigate("/login");
        }, 3000);
      } else {
        setError("Failed to load vehicles. Please try again later.");
      }
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      // Also add Authorization header for delete request
      const response = await axios.delete(`${API_URL}/vehicle/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Delete response:", response.data);

      if (response.data.success) {
        setVehicles(vehicles.filter((vehicle) => vehicle.id !== deleteId));
        setShowDeleteModal(false);
        setDeleteId(null);
      } else {
        setError("Failed to delete vehicle");
      }
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      setError("Failed to delete vehicle. Please try again later.");
    }
  };

  // Helper function to get the status class - with null checks
  const getStatusClass = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toUpperCase()) {
      case "GOOD":
        return "bg-green-100 text-green-800";
      case "MAINTENANCE_DUE":
        return "bg-yellow-100 text-yellow-800";
      case "MAINTENANCE_OVERDUE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get a readable status label - with null checks
  const getStatusLabel = (status) => {
    if (!status) return "Good";

    switch (status.toUpperCase()) {
      case "GOOD":
        return "Good";
      case "MAINTENANCE_DUE":
        return "Maintenance Due";
      case "MAINTENANCE_OVERDUE":
        return "Maintenance Overdue";
      default:
        return status || "Unknown";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Vehicles</h1>
        <Link
          to="/vehicles/create"
          className="px-4 py-2 bg-[#D52B1E] hover:bg-[#C42218] text-white font-medium rounded-md flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Vehicle
        </Link>
      </div>

      {error && (
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
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D52B1E]"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
          {/* Replace image with an SVG icon */}
          <div className="flex justify-center">
            <svg
              className="w-32 h-32 text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 16v-4a4 4 0 0 1 8 0v4M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 7h10M7 12h10"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Your garage is empty
          </h3>
          <p className="mt-2 text-gray-500">
            Add your first vehicle to start tracking its maintenance.
          </p>
          <div className="mt-6">
            <Link
              to="/vehicles/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#D52B1E] hover:bg-[#C42218] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D52B1E]"
            >
              Add Your First Vehicle
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-md"
            >
              <div className="h-2 bg-gradient-to-r from-[#D52B1E] to-[#FECB00]"></div>
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {vehicle.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(
                      vehicle.status
                    )}`}
                  >
                    {getStatusLabel(vehicle.status)}
                  </span>
                </div>

                {/* Brand logo and model information */}
                <div className="mt-2 flex items-center">
                  {getLogoBrand(vehicle.brand) ? (
                    <div className="flex items-center">
                      <img
                        src={getLogoBrand(vehicle.brand)}
                        alt={`${vehicle.brand} logo`}
                        className="h-6 w-auto mr-2"
                      />
                      <p className="text-sm text-gray-500 truncate">
                        {vehicle.model}{" "}
                        {vehicle.year ? `(${vehicle.year})` : ""}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 truncate">
                      {vehicle.brand} {vehicle.model}{" "}
                      {vehicle.year ? `(${vehicle.year})` : ""}
                    </p>
                  )}
                </div>

                {/* Action buttons (no changes) */}
                <div className="mt-6 flex justify-between space-x-3">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D52B1E]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/vehicles/edit/${vehicle.id}`)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D52B1E]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
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
                      Edit
                    </button>
                  </div>
                  <button
                    onClick={() => confirmDelete(vehicle.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-[#D52B1E] bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Vehicle
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this vehicle? All
                        associated data will be permanently removed. This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#D52B1E] text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
