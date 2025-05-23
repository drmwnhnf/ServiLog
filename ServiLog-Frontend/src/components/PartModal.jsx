import { useState, useEffect, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const PartModal = ({ isOpen, onClose, mode = "add", vehicleId, partData = {}, onSuccess }) => {
    const { token } = useAuth();
    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? "dark" : "light";
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        model: "",
        year: "",
        install_mileage: "",
        lifetime: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (partData && mode === "edit") {
            setFormData({
                name: partData.name || "",
                brand: partData.brand || "",
                model: partData.model || "",
                year: partData.year || "",
                install_mileage: partData.install_mileage || "",
                lifetime: partData.lifetime_mileage || ""
            });
        } else {
            setFormData({
                name: "",
                brand: "",
                model: "",
                year: "",
                install_mileage: "",
                lifetime: ""
            });
        }
    }, [partData, mode, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            let res;
            if (mode === "add") {
                res = await axios.post(
                    `/part/`,
                    {
                        vehicle_id: vehicleId,
                        name: formData.name,
                        brand: formData.brand,
                        model: formData.model,
                        year: formData.year,
                        install_mileage: formData.install_mileage,
                        lifetime_mileage: formData.lifetime
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            } else {
                res = await axios.put(
                    `/part/${partData.id}`,
                    {
                        name: formData.name,
                        brand: formData.brand,
                        model: formData.model,
                        year: formData.year,
                        install_mileage: formData.install_mileage,
                        lifetime_mileage: formData.lifetime
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            }
            if (res.data.success) {
                onClose(true);
                if (onSuccess) onSuccess();
            } else {
                setError(res.data.message || "Failed to save part.");
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("account");
                window.location.href = "/login";
            } else {
                setError(
                    err.response?.data?.message || err.message || "Failed to save part."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => onClose(false)}
                aria-hidden="true"
            />
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center p-4">
                    <div
                        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-title font-semibold text-gray-900 dark:text-white">
                                {mode === 'add' ? 'Add New Part' : 'Edit Part'}
                            </h3>
                            <button
                                onClick={() => onClose(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                aria-label="Close"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="px-6 py-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-arial text-gray-700 dark:text-gray-300 mb-1">
                                        Name*
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D52B1E] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                        placeholder="Enter part name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-arial text-gray-700 dark:text-gray-300 mb-1">
                                        Brand*
                                    </label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D52B1E] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                        placeholder="Enter brand name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-tnr text-gray-700 dark:text-gray-300 mb-1">
                                        Model*
                                    </label>
                                    <input
                                        type="text"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D52B1E] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                        placeholder="Enter model name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-tnr text-gray-700 dark:text-gray-300 mb-1">
                                        Year (Optional)
                                    </label>
                                    <input
                                        type="number"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D52B1E] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter year"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-arial text-gray-700 dark:text-gray-300 mb-1">
                                        Install Mileage*
                                    </label>
                                    <input
                                        type="number"
                                        name="install_mileage"
                                        value={formData.install_mileage}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D52B1E] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter install mileage"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-arial text-gray-700 dark:text-gray-300 mb-1">
                                        Lifetime (Mileage)*
                                    </label>
                                    <input
                                        type="number"
                                        name="lifetime"
                                        value={formData.lifetime}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D52B1E] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter lifetime mileage"
                                    />
                                </div>
                            </div>
                            {error && (
                                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                                    {error}
                                </div>
                            )}
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => onClose(false)}
                                    className="px-4 py-2 text-sm font-arial text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-arial text-white bg-[#D52B1E] hover:bg-[#FECB00] hover:text-[#D52B1E] rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D52B1E] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (mode === 'add' ? 'Adding...' : 'Saving...') : (mode === 'add' ? 'Add Part' : 'Edit Part')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

PartModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(["add", "edit"]),
    vehicleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    partData: PropTypes.object,
    onSuccess: PropTypes.func
};

export default PartModal;
