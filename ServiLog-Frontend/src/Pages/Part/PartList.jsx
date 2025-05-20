import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPartsByVehicleId, deletePart, maintainPart } from "./api";
import { FiPlus, FiEye, FiEdit, FiCheck, FiTrash2 } from "react-icons/fi";

const PartList = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { vehicleId } = useParams();

  useEffect(() => {
    const fetchParts = async () => {
      try {
        setLoading(true);
        const response = await getPartsByVehicleId(vehicleId);
        if (response.success) {
          setParts(response.payload);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to load parts. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, [vehicleId]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this part?")) {
      try {
        const response = await deletePart(id);
        if (response.success) {
          setParts(parts.filter((part) => part.id !== id));
        } else {
          alert(response.message);
        }
      } catch (err) {
        alert("Failed to delete part");
        console.error(err);
      }
    }
  };

  const handleMaintain = async (id) => {
    try {
      const response = await maintainPart(id);
      if (response.success) {
        setParts(
          parts.map((part) =>
            part.id === id ? { ...part, status: "MAINTAINED/REPLACED" } : part
          )
        );
      } else {
        alert(response.message);
      }
    } catch (err) {
      alert("Failed to update maintenance status");
      console.error(err);
    }
  };

  if (loading) 
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D52B1E]"></div>
      </div>
    );

  if (error && !parts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full border-l-4 border-[#D52B1E]">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">No Parts Found</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="bg-[#FECB00]/10 p-4 rounded-lg mb-6">
            <p className="text-gray-700">Start by adding your first vehicle part to track its maintenance schedule.</p>
          </div>
          <Link 
            to={`/parts/add/${vehicleId}`}
            className="flex items-center justify-center gap-2 bg-[#D52B1E] hover:bg-[#D52B1E]/90 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] w-full"
          >
            <FiPlus className="text-lg" />
            Add Your First Part
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Vehicle Parts</h1>
            <p className="text-gray-600 mt-1">Manage and track all components of your vehicle</p>
          </div>
          <Link 
            to={`/parts/add/${vehicleId}`}
            className="flex items-center gap-2 bg-[#D52B1E] hover:bg-[#D52B1E]/90 text-white px-5 py-2.5 rounded-lg font-medium transition-all transform hover:scale-[1.02]"
          >
            <FiPlus className="text-lg" />
            Add New Part
          </Link>
        </div>

        {parts.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-[#FECB00]/20 rounded-full mb-4">
              <span className="text-2xl">🔧</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">No parts yet</h3>
            <p className="text-gray-600 mb-6">Add parts to keep track of maintenance schedules</p>
            <Link 
              to={`/parts/add/${vehicleId}`}
              className="inline-flex items-center gap-2 bg-[#D52B1E] hover:bg-[#D52B1E]/90 text-white px-5 py-2.5 rounded-lg font-medium"
            >
              <FiPlus /> 
              Add Your First Part
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {parts.map((part) => (
                <div 
                  key={part.id} 
                  className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">{part.name}</h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          part.status === "MAINTAINED/REPLACED"
                            ? "bg-green-100 text-green-800"
                            : "bg-[#FECB00]/10 text-[#D52B1E]"
                        }`}
                      >
                        {part.status || "Active"}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p><span className="font-medium">Brand:</span> {part.brand}</p>
                      <p><span className="font-medium">Model:</span> {part.model}</p>
                    </div>
                  </div>
                  
                  <div className="px-5 py-3 bg-gray-50">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium">Installation:</span> {part.install_mileage} km
                      </div>
                      <div>
                        <span className="font-medium">Lifetime:</span> {part.lifetime_mileage} km
                      </div>
                    </div>
                    
                    {/* Calculate percentage used */}
                    {(() => {
                      const currentMileage = part.vehicle?.current_mileage || part.install_mileage;
                      const usedMileage = Math.max(0, currentMileage - part.install_mileage);
                      const percentage = Math.min(100, Math.round((usedMileage / part.lifetime_mileage) * 100));
                      
                      return (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{percentage}% used</span>
                            <span>{part.lifetime_mileage - usedMileage} km remaining</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                percentage > 90 ? "bg-[#D52B1E]" : 
                                percentage > 75 ? "bg-[#FECB00]" : "bg-green-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div className="flex border-t border-gray-100 divide-x divide-gray-100">
                    <Link
                      to={`/parts/${part.id}`}
                      className="flex items-center justify-center gap-1 p-2.5 flex-1 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiEye className="text-[#D52B1E]" /> View
                    </Link>
                    <Link
                      to={`/parts/edit/${part.id}`}
                      className="flex items-center justify-center gap-1 p-2.5 flex-1 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiEdit className="text-[#FECB00]" /> Edit
                    </Link>
                    <button
                      onClick={() => handleMaintain(part.id)}
                      disabled={part.status === "MAINTAINED/REPLACED"}
                      className={`flex items-center justify-center gap-1 p-2.5 flex-1 ${
                        part.status === "MAINTAINED/REPLACED"
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-700 hover:bg-gray-50" 
                      } transition-colors`}
                    >
                      <FiCheck className={part.status === "MAINTAINED/REPLACED" ? "text-gray-400" : "text-green-600"} /> 
                      Maintain
                    </button>
                    <button
                      onClick={() => handleDelete(part.id)}
                      className="flex items-center justify-center gap-1 p-2.5 flex-1 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FiTrash2 className="text-[#D52B1E]" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartList;
