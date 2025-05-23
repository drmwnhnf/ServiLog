import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import VehicleModal from "../components/VehicleModal";
import PartModal from "../components/PartModal";
import MileageModal from "../components/MileageModal";
import { useAuth } from "../contexts/AuthContext";
import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import { useTheme } from "../contexts/ThemeContext";

const statusMap = {
    NORMAL: "Normal",
    MAINTENANCE_DUE: "Maintenance Due",
    MAINTENANCE_OVERDUE: "Maintenance Overdue",
    MAINTAINED: "Maintained/Replaced",
    REPLACED: "Maintained/Replaced"
};

const VehiclePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const { isDarkMode } = useTheme();
    const theme = isDarkMode ? "dark" : "light";
    const [vehicle, setVehicle] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [showPartModal, setShowPartModal] = useState(false);
    const [showMileageModal, setShowMileageModal] = useState(false);
    const [editPart, setEditPart] = useState(null);
    const [editMileage, setEditMileage] = useState(null);
    const [tab, setTab] = useState("parts");
    const [parts, setParts] = useState([]);
    const [mileages, setMileages] = useState([]);
    const [confirmModal, setConfirmModal] = useState({ open: false });

    // Fetch vehicle data
    useEffect(() => {
        const fetchVehicle = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await axios.get(
                    `/vehicle/id/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data.success) {
                    setVehicle(res.data.payload);
                } else {
                    setError(res.data.message);
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id, token]);

    // Fetch parts
    useEffect(() => {
        if (!vehicle) return;
        if (tab === "parts") {
            axios
                .get(`/part/vehicle/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((res) => {
                    if (res.data.success) setParts(res.data.payload);
                    else setParts([]);
                })
                .catch(() => setParts([]));
        }
    }, [tab, id, token, vehicle]);

    // Fetch mileages
    useEffect(() => {
        if (!vehicle) return;
        if (tab === "mileages") {
            axios
                .get(`/mileage/vehicle/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then((res) => {
                    if (res.data.success) setMileages(res.data.payload);
                    else setMileages([]);
                })
                .catch(() => setMileages([]));
        }
    }, [tab, id, token, vehicle]);

    // Helper for date formatting
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    // Confirm modal
    const ConfirmModal = ({ open, message, onConfirm, onCancel }) => {
        if (!open) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-sm">
                    <div className="mb-4 text-center text-lg">{message}</div>
                    <div className="flex justify-center gap-4">
                        <button
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 rounded bg-[#D52B1E] text-white hover:bg-[#FECB00] hover:text-[#D52B1E]"
                            onClick={onConfirm}
                        >
                            Yes
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Delete vehicle
    const handleDeleteVehicle = async () => {
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_BACKEND_DOMAIN}/vehicle/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                navigate("/dashboard");
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
        setConfirmModal({ open: false });
    };

    // Delete part
    const handleDeletePart = async (partId) => {
        try {
            const res = await axios.delete(
                `/part/${partId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) window.location.reload();
            else alert(res.data.message);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
        setConfirmModal({ open: false });
    };

    // Maintain/Replace part
    const handleMaintainPart = async (partId) => {
        try {
            const res = await axios.post(
                `/part/maintain/${partId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) window.location.reload();
            else alert(res.data.message);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
        setConfirmModal({ open: false });
    };

    // Delete mileage
    const handleDeleteMileage = async (mileageId) => {
        try {
            const res = await axios.delete(
                `/mileage/${mileageId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) window.location.reload();
            else alert(res.data.message);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
        setConfirmModal({ open: false });
    };

    // Table columns
    const partColumns = [
        "Name",
        "Brand",
        "Model",
        "Year",
        "Status",
        "Install Mileage",
        "Lifetime",
        {
            name: "Actions",
            formatter: (_, row) => {
                const part = parts[row._index];
                return (
                    <div className="flex gap-2">
                        <button
                            className="px-2 py-1 rounded bg-[#FECB00] text-[#D52B1E] font-bold"
                            onClick={() => {
                                setEditPart(part);
                                setShowPartModal(true);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            className="px-2 py-1 rounded bg-blue-200 text-blue-800 font-bold"
                            onClick={() => setConfirmModal({ open: true, message: `Maintain/Replace part '${part.name}'?`, onConfirm: () => handleMaintainPart(part.id), onCancel: () => setConfirmModal({ open: false }) })}
                        >
                            Maintain/Replace
                        </button>
                        <button
                            className="px-2 py-1 rounded bg-red-200 text-red-800 font-bold"
                            onClick={() => setConfirmModal({ open: true, message: `Delete part '${part.name}'?`, onConfirm: () => handleDeletePart(part.id), onCancel: () => setConfirmModal({ open: false }) })}
                        >
                            Delete
                        </button>
                    </div>
                );
            }
        }
    ];

    const mileageColumns = [
        "Mileage",
        "Date",
        {
            name: "Actions",
            formatter: (_, row) => {
                const mileage = mileages[row._index];
                return (
                    <div className="flex gap-2">
                        <button
                            className="px-2 py-1 rounded bg-[#FECB00] text-[#D52B1E] font-bold"
                            onClick={() => {
                                setEditMileage(mileage);
                                setShowMileageModal(true);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            className="px-2 py-1 rounded bg-red-200 text-red-800 font-bold"
                            onClick={() => setConfirmModal({ open: true, message: `Delete mileage ${mileage.mileage}?`, onConfirm: () => handleDeleteMileage(mileage.id), onCancel: () => setConfirmModal({ open: false }) })}
                        >
                            Delete
                        </button>
                    </div>
                );
            }
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                <Navbar />
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900">
                <Navbar />
                <div className="text-xl text-red-600 text-center mt-10">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <div className="max-w-4xl mx-auto p-4 pt-24"> {/* Tambahkan pt-24 agar konten tidak tertimpa Navbar */}
                {/* Vehicle Info */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="text-2xl font-bold mb-1" style={{ fontFamily: "Arial, sans-serif" }}>{vehicle.name}</div>
                            <div className="text-lg mb-1" style={{ fontFamily: "Arial, sans-serif" }}>{vehicle.brand} - {vehicle.model} ({vehicle.year})</div>
                            <div className="text-base mb-1" style={{ fontFamily: "Arial, sans-serif" }}>
                                <span className={
                                    vehicle.status === 'MAINTENANCE_OVERDUE' ? 'text-red-600 dark:text-red-400' :
                                    vehicle.status === 'MAINTENANCE_DUE' ? 'text-yellow-600 dark:text-yellow-400' :
                                    'text-green-600 dark:text-green-400'
                                }>
                                    Status: <span className="font-bold">{statusMap[vehicle.status] || vehicle.status}</span>
                                </span>
                            </div>
                            <div className="text-sm">Created: {formatDate(vehicle.created_at)}</div>
                            <div className="text-sm">Updated: {formatDate(vehicle.updated_at)}</div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="px-4 py-2 rounded bg-[#FECB00] text-[#D52B1E] font-bold"
                                onClick={() => setShowVehicleModal(true)}
                            >
                                Edit Vehicle
                            </button>
                            <button
                                className={`px-4 py-2 rounded font-bold transition-colors duration-200 ${
                                    'bg-red-200 text-red-800 hover:bg-red-400 hover:text-white'
                                }`}
                                onClick={() => setConfirmModal({ open: true, message: `Delete vehicle '${vehicle.name}'?`, onConfirm: handleDeleteVehicle, onCancel: () => setConfirmModal({ open: false }) })}
                            >
                                Delete Vehicle
                            </button>
                        </div>
                    </div>
                </div>
                {/* Tabs */}
                <div className="flex gap-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded-t font-bold ${tab === "parts" ? "bg-[#D52B1E] text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"}`}
                        onClick={() => setTab("parts")}
                    >
                        Parts
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t font-bold ${tab === "mileages" ? "bg-[#D52B1E] text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"}`}
                        onClick={() => setTab("mileages")}
                    >
                        Mileages
                    </button>
                </div>
                {/* Add Button */}
                <div className="mb-4">
                    {tab === "parts" ? (
                        <button
                            className="px-4 py-2 rounded bg-[#D52B1E] text-white font-bold hover:bg-[#FECB00] hover:text-[#D52B1E]"
                            onClick={() => { setEditPart(null); setShowPartModal(true); }}
                        >
                            Add Part
                        </button>
                    ) : (
                        <button
                            className="px-4 py-2 rounded bg-[#D52B1E] text-white font-bold hover:bg-[#FECB00] hover:text-[#D52B1E]"
                            onClick={() => { setEditMileage(null); setShowMileageModal(true); }}
                        >
                            Add Mileage
                        </button>
                    )}
                </div>
                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    {tab === "parts" ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className="bg-[#FECB00] text-[#D52B1E] font-bold px-2 py-2">Name</th>
                                        <th className="bg-[#FECB00] text-[#D52B1E] font-bold px-2 py-2">Brand</th>
                                        <th className="bg-[#FECB00] text-[#D52B1E] font-bold px-2 py-2">Model</th>
                                        <th className="bg-[#FECB00] text-[#D52B1E] font-bold px-2 py-2">Year</th>
                                        <th className="bg-[#FECB00] text-[#D52B1E] font-bold px-2 py-2">Status</th>
                                        <th className="bg-[#FECB00] text-[#D52B1E] font-bold px-2 py-2">Install Mileage</th>
                                        <th className="bg-[#FECB00] text-[#D52B1E] font-bold px-2 py-2">Lifetime</th>
                                        <th className="bg-[#FECB00] text-[#D52B1E] font-bold px-2 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parts.map((part) => (
                                        <tr key={part.id} className="bg-white dark:bg-gray-800 border-b">
                                            <td className="px-2 py-2">{part.name}</td>
                                            <td className="px-2 py-2">{part.brand}</td>
                                            <td className="px-2 py-2">{part.model}</td>
                                            <td className="px-2 py-2">{part.year}</td>
                                            <td className="px-2 py-2">{statusMap[part.status] || part.status}</td>
                                            <td className="px-2 py-2">{part.install_mileage}</td>
                                            <td className="px-2 py-2">{part.lifetime_mileage}</td>
                                            <td className="px-2 py-2">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-2 py-1 rounded bg-[#FECB00] text-[#D52B1E] font-bold"
                                                        onClick={() => {
                                                            setEditPart(part);
                                                            setShowPartModal(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="px-2 py-1 rounded bg-blue-200 text-blue-800 font-bold"
                                                        onClick={() => setConfirmModal({ open: true, message: `Maintain/Replace part '${part.name}'?`, onConfirm: () => handleMaintainPart(part.id), onCancel: () => setConfirmModal({ open: false }) })}
                                                    >
                                                        Maintain/Replace
                                                    </button>
                                                    <button
                                                        className="px-2 py-1 rounded bg-red-200 text-red-800 font-bold"
                                                        onClick={() => setConfirmModal({ open: true, message: `Delete part '${part.name}'?`, onConfirm: () => handleDeletePart(part.id), onCancel: () => setConfirmModal({ open: false }) })}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr>
                                        <th className="bg-[#FECB00] text-[#D52B1E] font-bold px-2 py-2">Mileage</th>
                                        <th className="bg-[#FECB00] text-[#D52B1E] font-bold px-2 py-2">Date</th>
                                        <th className="bg-[#FECB00] text-[#D52B1E] font-bold px-2 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mileages.map((mileage) => (
                                        <tr key={mileage.id} className="bg-white dark:bg-gray-800 border-b">
                                            <td className="px-2 py-2">{mileage.mileage}</td>
                                            <td className="px-2 py-2">{formatDate(mileage.date)}</td>
                                            <td className="px-2 py-2">
                                                <div className="flex gap-2">
                                                    <button
                                                        className="px-2 py-1 rounded bg-[#FECB00] text-[#D52B1E] font-bold"
                                                        onClick={() => {
                                                            setEditMileage(mileage);
                                                            setShowMileageModal(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="px-2 py-1 rounded bg-red-200 text-red-800 font-bold"
                                                        onClick={() => setConfirmModal({ open: true, message: `Delete mileage ${mileage.mileage}?`, onConfirm: () => handleDeleteMileage(mileage.id), onCancel: () => setConfirmModal({ open: false }) })}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            {/* Modals */}
            {showVehicleModal && (
                <VehicleModal
                    isOpen={showVehicleModal}
                    onClose={() => setShowVehicleModal(false)}
                    vehicle={vehicle}
                    mode="edit"
                />
            )}
            {showPartModal && (
                <PartModal
                    isOpen={showPartModal}
                    onClose={() => { setShowPartModal(false); setEditPart(null); }}
                    mode={editPart ? "edit" : "add"}
                    vehicleId={id}
                    partData={editPart}
                    onSuccess={() => window.location.reload()}
                />
            )}
            {showMileageModal && (
                <MileageModal
                    isOpen={showMileageModal}
                    onClose={() => { setShowMileageModal(false); setEditMileage(null); }}
                    mode={editMileage ? "edit" : "add"}
                    vehicleId={id}
                    mileageData={editMileage}
                    onSuccess={() => window.location.reload()}
                />
            )}
            <ConfirmModal {...confirmModal} />
        </div>
    );
};

export default VehiclePage;
