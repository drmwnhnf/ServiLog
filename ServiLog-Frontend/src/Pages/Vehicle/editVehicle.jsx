import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import vehicleData from "./details.json";

const EditVehicle = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    year: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [models, setModels] = useState([]);
  const navigate = useNavigate();

  const API_URL = "https://servilog-backend.vercel.app/vehicle";

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setFetchingData(true);
        const response = await axios.get(`${API_URL}/id/${id}`);

        if (response.data.success) {
          const vehicle = response.data.data;

          setFormData({
            name: vehicle.name || "",
            brand: vehicle.brand || "",
            model: vehicle.model || "",
            year: vehicle.year || "",
          });

          setSelectedBrand(vehicle.brand || "");
        } else {
          setError("Failed to fetch vehicle data");
          setTimeout(() => {
            navigate("/vehicles");
          }, 2000);
        }
      } catch (err) {
        setError("Error fetching vehicle data. Please try again.");
        console.error("Error fetching vehicle:", err);
      } finally {
        setFetchingData(false);
      }
    };

    if (id) {
      fetchVehicleData();
    }
  }, [id, navigate]);

  useEffect(() => {
    if (selectedBrand) {
      const brandData = vehicleData.brands.find(
        (b) => b.name === selectedBrand
      );
      setModels(brandData ? brandData.models : []);
      setFormData((prev) => ({ ...prev, brand: selectedBrand }));
    }
  }, [selectedBrand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    // Clear model when brand changes
    setFormData((prev) => ({ ...prev, model: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate required fields
    if (!formData.name || !formData.brand || !formData.model) {
      setError("Vehicle name, brand, and model are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        name: formData.name,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
      });

      if (response.data.success) {
        setSuccess("Vehicle updated successfully!");

        setTimeout(() => {
          navigate("/vehicles");
        }, 2000);
      } else {
        setError(response.data.message || "Failed to update vehicle");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      console.error("Error updating vehicle:", err);
    } finally {
      setLoading(false);
    }
  };

  const years = Array.from(
    { length: 50 },
    (_, i) => new Date().getFullYear() - i
  );

  if (fetchingData) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-5 bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D52B1E]"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-5 bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md overflow-hidden relative">
        {/* Colored header strip */}
        <div className="h-2 w-full bg-gradient-to-r from-[#D52B1E] via-[#D52B1E] to-[#FECB00]"></div>

        <h2 className="text-2xl font-semibold text-gray-800 text-center my-6">
          Edit Vehicle
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-[#D52B1E] text-[#D52B1E] p-3 mx-7 mb-5 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-500 p-3 mx-7 mb-5 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5 px-7">
            <label
              htmlFor="name"
              className="block mb-1.5 font-medium text-gray-700"
            >
              Vehicle Name/Nickname*
            </label>
            <input
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/20 focus:border-[#D52B1E]"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. My Family Car"
              required
            />
          </div>

          <div className="mb-5 px-7">
            <label
              htmlFor="brand"
              className="block mb-1.5 font-medium text-gray-700"
            >
              Brand*
            </label>
            <select
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/20 focus:border-[#D52B1E]"
              id="brand"
              name="brand"
              value={selectedBrand}
              onChange={handleBrandChange}
              required
            >
              <option value="">Select a brand</option>
              {vehicleData.brands.map((brand) => (
                <option key={brand.name} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5 px-7">
            <label
              htmlFor="model"
              className="block mb-1.5 font-medium text-gray-700"
            >
              Model*
            </label>
            <select
              className={`w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/20 focus:border-[#D52B1E] ${
                !selectedBrand ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              disabled={!selectedBrand}
            >
              <option value="">Select a model</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5 px-7">
            <label
              htmlFor="year"
              className="block mb-1.5 font-medium text-gray-700"
            >
              Year
            </label>
            <select
              className="w-full px-3 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/20 focus:border-[#D52B1E]"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
            >
              <option value="">Select year (optional)</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between px-7 py-6">
            <button
              type="button"
              className="px-6 py-3 bg-white text-gray-600 border border-gray-300 rounded-md text-base hover:bg-gray-50 transition duration-200"
              onClick={() => navigate("/vehicles")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-3 text-white rounded-md text-base font-medium transition duration-200 ${
                loading
                  ? "bg-[#e88e85] cursor-not-allowed"
                  : "bg-[#D52B1E] hover:bg-[#C42218]"
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicle;
