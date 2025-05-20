import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { createMileage } from "./api";
import { FiSave, FiX, FiArrowLeft, FiInfo, FiCalendar, FiTrendingUp } from "react-icons/fi";
import axios from "axios";

const CreateMileage = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicle_id: vehicleId,
    mileage: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [vehicleLoading, setVehicleLoading] = useState(true);
  const [previousMileages, setPreviousMileages] = useState([]);

  // Fetch vehicle data and previous mileages for display only
  useEffect(() => {
    const fetchVehicleData = async () => {
      setVehicleLoading(true);
      try {
        const API_URL = "https://servilog-backend.vercel.app";
        const token = localStorage.getItem("token");
        
        // Fetch vehicle details
        const vehicleResponse = await axios.get(
          `${API_URL}/vehicle/${vehicleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (vehicleResponse.data.success) {
          setVehicle(vehicleResponse.data.payload);
        } else {
          setError("Failed to load vehicle data");
        }

        // Fetch previous mileages for reference display only
        const mileageResponse = await axios.get(
          `${API_URL}/mileage/vehicle/${vehicleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (mileageResponse.data.success) {
          setPreviousMileages(mileageResponse.data.payload);
        }
      } catch (err) {
        setError("Error fetching vehicle data");
        console.error(err);
      } finally {
        setVehicleLoading(false);
      }
    };

    fetchVehicleData();
  }, [vehicleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation only
    if (!formData.mileage || !formData.date) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const dataToSend = {
        ...formData,
        mileage: parseInt(formData.mileage),
      };

      const response = await createMileage(dataToSend);

      if (response.success) {
        navigate(`/vehicles/${vehicleId}`);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to create mileage record. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          to={`/vehicles/${vehicleId}`}
          className="inline-flex items-center gap-2 text-[#D52B1E] hover:text-[#D52B1E]/80 font-medium"
        >
          <FiArrowLeft /> Back to Vehicle Details
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#D52B1E] to-[#D52B1E]/80 p-6">
          <h1 className="text-2xl font-bold text-white">Add Mileage Record</h1>
          <p className="text-white/80 mt-1">
            Keep track of your vehicle's mileage for maintenance scheduling
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-[#D52B1E] p-4 rounded-md">
              <div className="flex items-start">
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
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-1 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {vehicleLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D52B1E]"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {vehicle && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiInfo className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Adding mileage for: <span className="font-semibold">{vehicle.name}</span> ({vehicle.brand} {vehicle.model} {vehicle.year || ''})
                      </p>
                      {previousMileages.length > 0 && (
                        <p className="text-sm text-blue-700 mt-1">
                          Last recorded: <span className="font-semibold">{previousMileages[0].mileage} km</span> on {new Date(previousMileages[0].date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <label
                    htmlFor="mileage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current Mileage (km) *
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTrendingUp className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="mileage"
                      type="number"
                      name="mileage"
                      min="0"
                      placeholder="Enter current odometer reading"
                      value={formData.mileage}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D52B1E]/50 focus:border-[#D52B1E] outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Reading Date *
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#D52B1E]/50 focus:border-[#D52B1E] outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {previousMileages.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Previous Mileage Records</h3>
                  <div className="overflow-x-auto max-h-40 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mileage (km)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previousMileages.slice(0, 5).map((mileage, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                              {new Date(mileage.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 font-medium">
                              {mileage.mileage}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(`/vehicles/${vehicleId}`)}
                  className="mt-3 sm:mt-0 inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  <FiX className="mr-2" /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center items-center px-6 py-2.5 rounded-lg shadow-sm text-sm font-medium text-white bg-[#D52B1E] hover:bg-[#D52B1E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D52B1E] transition-colors"
                >
                  <FiSave className="mr-2" />
                  {loading ? "Saving..." : "Save Mileage"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMileage;
