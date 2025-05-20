import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getMileageById, updateMileage, getMileagesByVehicleId } from "./api";
import { FiSave, FiX, FiArrowLeft, FiInfo, FiTrendingUp } from "react-icons/fi";
import axios from "axios";

const EditMileage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mileage: "",
  });
  const [originalMileage, setOriginalMileage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [otherMileages, setOtherMileages] = useState([]);

  useEffect(() => {
    const fetchMileageData = async () => {
      try {
        setLoading(true);
        // Get the mileage record
        const response = await getMileageById(id);

        if (response.success) {
          const mileage = response.payload;
          setOriginalMileage(mileage);
          setFormData({
            mileage: mileage.mileage,
          });

          // Get the vehicle info for display
          const API_URL = "https://servilog-backend.vercel.app";
          const token = localStorage.getItem("token");

          const vehicleResponse = await axios.get(
            `${API_URL}/vehicle/${mileage.vehicle_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (vehicleResponse.data.success) {
            setVehicle(vehicleResponse.data.payload);
          }

          // Get other mileage records for reference display
          const mileagesResponse = await getMileagesByVehicleId(
            mileage.vehicle_id
          );

          if (mileagesResponse.success) {
            // Filter out the current mileage record
            const filteredMileages = mileagesResponse.payload.filter(
              (m) => m.id !== mileage.id
            );
            setOtherMileages(filteredMileages);
          }
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to load mileage data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMileageData();
  }, [id]);

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
    if (!formData.mileage) {
      setError("Please enter a mileage value");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const dataToSend = {
        mileage: parseInt(formData.mileage),
      };

      const response = await updateMileage(id, dataToSend);

      if (response.success) {
        navigate(`/vehicles/${originalMileage.vehicle_id}`);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to update mileage record. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D52B1E]"></div>
      </div>
    );

  if (error && !originalMileage) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border-l-4 border-[#D52B1E]">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 bg-[#D52B1E] hover:bg-[#D52B1E]/90 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] w-full"
          >
            <FiArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          to={`/vehicles/${originalMileage?.vehicle_id}`}
          className="inline-flex items-center gap-2 text-[#D52B1E] hover:text-[#D52B1E]/80 font-medium"
        >
          <FiArrowLeft /> Back to Vehicle Details
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#FECB00] to-[#FECB00]/80 p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Mileage Record
          </h1>
          <p className="text-gray-800/80 mt-1">
            Update the odometer reading from{" "}
            {new Date(originalMileage?.date).toLocaleDateString()}
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

          {vehicle && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiInfo className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Editing mileage for:{" "}
                    <span className="font-semibold">{vehicle.name}</span> (
                    {vehicle.brand} {vehicle.model} {vehicle.year || ""})
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Date:{" "}
                    <span className="font-semibold">
                      {new Date(originalMileage?.date).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label
                htmlFor="mileage"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mileage (km) *
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
                  value={formData.mileage}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FECB00]/50 focus:border-[#FECB00] outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {otherMileages.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Other Mileage Records
                </h3>
                <div className="overflow-x-auto max-h-40 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Mileage (km)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {otherMileages.slice(0, 5).map((mileage, index) => (
                        <tr
                          key={index}
                          className={
                            new Date(mileage.date) <
                            new Date(originalMileage?.date)
                              ? "bg-blue-50"
                              : "bg-yellow-50"
                          }
                        >
                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                            {new Date(mileage.date).toLocaleDateString()}
                            {new Date(mileage.date) <
                            new Date(originalMileage?.date)
                              ? " (Earlier)"
                              : " (Later)"}
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
                onClick={() =>
                  navigate(`/vehicles/${originalMileage?.vehicle_id}`)
                }
                className="mt-3 sm:mt-0 inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <FiX className="mr-2" /> Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex justify-center items-center px-6 py-2.5 rounded-lg shadow-sm text-sm font-medium text-white bg-[#D52B1E] hover:bg-[#D52B1E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D52B1E] transition-colors"
              >
                <FiSave className="mr-2" />
                {submitting ? "Saving..." : "Update Mileage"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMileage;
