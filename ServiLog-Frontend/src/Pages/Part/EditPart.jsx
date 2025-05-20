import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPartById, updatePart } from "./api";
import { FiSave, FiX, FiArrowLeft, FiInfo } from "react-icons/fi";
import axios from "axios";
import partsList from "./part.json";

const EditPart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
    install_mileage: "",
    lifetime_mileage: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [originalPart, setOriginalPart] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [selectedPart, setSelectedPart] = useState("");
  const [customPartName, setCustomPartName] = useState("");

  useEffect(() => {
    const fetchPartAndVehicleData = async () => {
      try {
        setLoading(true);
        const response = await getPartById(id);

        if (response.success) {
          const part = response.payload;
          setOriginalPart(part);

          // Determine if the part name is in our list or if it's a custom one
          const partNameExists = partsList.includes(part.name);
          setSelectedPart(partNameExists ? part.name : "Other");
          if (!partNameExists) {
            setCustomPartName(part.name);
          }

          setFormData({
            name: part.name || "",
            brand: part.brand || "",
            model: part.model || "",
            year: part.year || "",
            install_mileage: part.install_mileage || "",
            lifetime_mileage: part.lifetime_mileage || "",
          });

          // Fetch vehicle data
          const vehicleId = part.vehicle_id;
          if (vehicleId) {
            const API_URL = "https://servilog-backend.vercel.app";
            const token = localStorage.getItem("token");
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
              // Update brand, model, year from vehicle
              setFormData((prev) => ({
                ...prev,
                brand: vehicleResponse.data.payload.brand,
                model: vehicleResponse.data.payload.model,
                year: vehicleResponse.data.payload.year,
              }));
            }
          }
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to load part data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartAndVehicleData();
  }, [id]);

  // Handle part selection
  useEffect(() => {
    if (selectedPart === "Other") {
      setFormData((prev) => ({
        ...prev,
        name: customPartName,
      }));
    } else if (selectedPart) {
      setFormData((prev) => ({
        ...prev,
        name: selectedPart,
      }));
    }
  }, [selectedPart, customPartName]);

  const handlePartSelect = (e) => {
    setSelectedPart(e.target.value);
  };

  const handleCustomPartChange = (e) => {
    setCustomPartName(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.brand ||
      !formData.model ||
      !formData.install_mileage ||
      !formData.lifetime_mileage
    ) {
      setError("Please fill all required fields");
      return;
    }

    // Validate numbers
    if (
      parseInt(formData.install_mileage) < 0 ||
      parseInt(formData.lifetime_mileage) < 0
    ) {
      setError("Mileage values cannot be negative");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const dataToSend = {
        ...formData,
        install_mileage: parseInt(formData.install_mileage),
        lifetime_mileage: parseInt(formData.lifetime_mileage),
        year: formData.year ? parseInt(formData.year) : null,
      };

      const response = await updatePart(id, dataToSend);

      if (response.success) {
        navigate(`/parts/${id}`);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to update part. Please try again.");
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

  if (error && !originalPart) {
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
          to={`/parts/${id}`}
          className="inline-flex items-center gap-2 text-[#D52B1E] hover:text-[#D52B1E]/80 font-medium"
        >
          <FiArrowLeft /> Back to Part Details
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#FECB00] to-[#FECB00]/80 p-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Part</h1>
          <p className="text-gray-800/80 mt-1">
            Update maintenance information for {originalPart?.name}
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
                    Editing part for:{" "}
                    <span className="font-semibold">{vehicle.name}</span> ({vehicle.brand}{" "}
                    {vehicle.model} {vehicle.year || ""})
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label
                  htmlFor="partSelect"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Part Type *
                </label>
                <select
                  id="partSelect"
                  value={selectedPart}
                  onChange={handlePartSelect}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FECB00]/50 focus:border-[#FECB00] outline-none transition-colors"
                  required
                >
                  <option value="">Select a part type</option>
                  {partsList.map((part, index) => (
                    <option key={index} value={part}>
                      {part}
                    </option>
                  ))}
                </select>
              </div>

              {selectedPart === "Other" && (
                <div>
                  <label
                    htmlFor="customPartName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Custom Part Name *
                  </label>
                  <input
                    id="customPartName"
                    type="text"
                    value={customPartName}
                    onChange={handleCustomPartChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FECB00]/50 focus:border-[#FECB00] outline-none transition-colors"
                    required
                  />
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-md font-medium text-gray-700 mb-3">
                  Vehicle Information (Auto-filled)
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 cursor-not-allowed"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Model
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 cursor-not-allowed"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      value={formData.year || "N/A"}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 cursor-not-allowed"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Maintenance Information
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="install_mileage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Installation Mileage (KM) *
                  </label>
                  <input
                    id="install_mileage"
                    type="number"
                    name="install_mileage"
                    min="0"
                    value={formData.install_mileage}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FECB00]/50 focus:border-[#FECB00] outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="lifetime_mileage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Lifetime Mileage (KM) *
                  </label>
                  <input
                    id="lifetime_mileage"
                    type="number"
                    name="lifetime_mileage"
                    min="0"
                    value={formData.lifetime_mileage}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FECB00]/50 focus:border-[#FECB00] outline-none transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/parts/${id}`)}
                className="mt-3 sm:mt-0 inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <FiX className="mr-2" /> Cancel
              </button>
              <button
                type="submit"
                disabled={
                  submitting ||
                  !selectedPart ||
                  (selectedPart === "Other" && !customPartName)
                }
                className="inline-flex justify-center items-center px-6 py-2.5 rounded-lg shadow-sm text-sm font-medium text-white bg-[#D52B1E] hover:bg-[#D52B1E]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D52B1E] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FiSave className="mr-2" />
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPart;
