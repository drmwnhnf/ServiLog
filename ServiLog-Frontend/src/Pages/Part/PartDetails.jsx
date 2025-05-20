import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPartById, deletePart, maintainPart } from "./api";
import { FiArrowLeft, FiEdit, FiCheck, FiTrash2, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

const PartDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartDetails = async () => {
      try {
        setLoading(true);
        const response = await getPartById(id);
        if (response.success) {
          setPart(response.payload);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to load part details. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this part?")) {
      try {
        const response = await deletePart(id);
        if (response.success) {
          navigate(`/parts/vehicle/${part.vehicle_id}`);
        } else {
          alert(response.message);
        }
      } catch (err) {
        alert("Failed to delete part");
        console.error(err);
      }
    }
  };

  const handleMaintain = async () => {
    try {
      const response = await maintainPart(id);
      if (response.success) {
        setPart({ ...part, status: "MAINTAINED/REPLACED" });
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

  if (error) {
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

  if (!part) return <div className="text-center py-10">Part not found</div>;

  // Calculate remaining lifetime based on vehicle current mileage
  const currentMileage = part.vehicle?.current_mileage || part.install_mileage;
  const usedMileage = Math.max(0, currentMileage - part.install_mileage);
  const remainingMileage = Math.max(0, part.lifetime_mileage - usedMileage);
  const lifePercentage = Math.min(
    100,
    Math.round((usedMileage / part.lifetime_mileage) * 100)
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link
          to={`/parts/vehicle/${part.vehicle_id}`}
          className="inline-flex items-center gap-2 text-[#D52B1E] hover:text-[#D52B1E]/80 font-medium"
        >
          <FiArrowLeft /> Back to Parts List
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="relative bg-gradient-to-r from-[#D52B1E] to-[#D52B1E]/80 p-6">
          <div className="absolute top-0 right-0 bottom-0 w-1/4 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHBhdHRlcm4gaWQ9InBhdHRlcm4iIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+CjxyZWN0IHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgZmlsbD0iI0ZFQ0IwMCIgZmlsbC1vcGFjaXR5PSIwLjIiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz4KPC9zdmc+')]"></div>
          <h1 className="text-3xl font-bold text-white relative z-10">{part.name}</h1>
          <div className="flex items-center gap-3 mt-2 relative z-10">
            <span className="text-white/90">{part.brand} {part.model}</span>
            {part.year && (
              <>
                <span className="text-white/50">•</span>
                <span className="text-white/90">Year: {part.year}</span>
              </>
            )}
          </div>
          <div className="mt-4 relative z-10">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                part.status === "MAINTAINED/REPLACED"
                  ? "bg-green-100 text-green-800"
                  : "bg-[#FECB00] text-gray-800"
              }`}
            >
              {part.status === "MAINTAINED/REPLACED" ? (
                <><FiCheckCircle className="mr-1" /> Maintained</>
              ) : (
                "Needs Maintenance"
              )}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-100">
                Part Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 items-center">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-800">{part.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 items-center">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium text-gray-800">{part.brand}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 items-center">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium text-gray-800">{part.model}</span>
                </div>
                {part.year && (
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <span className="text-gray-600">Year:</span>
                    <span className="font-medium text-gray-800">{part.year}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 items-center">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      part.status === "MAINTAINED/REPLACED"
                        ? "bg-green-100 text-green-800"
                        : "bg-[#FECB00]/10 text-[#D52B1E]"
                    }`}
                  >
                    {part.status || "Active"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-100">
                Maintenance Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 items-center">
                  <span className="text-gray-600">Installation:</span>
                  <span className="font-medium text-gray-800">{part.install_mileage} km</span>
                </div>
                <div className="grid grid-cols-2 gap-2 items-center">
                  <span className="text-gray-600">Lifetime:</span>
                  <span className="font-medium text-gray-800">{part.lifetime_mileage} km</span>
                </div>
                <div className="grid grid-cols-2 gap-2 items-center">
                  <span className="text-gray-600">Current Vehicle:</span>
                  <span className="font-medium text-gray-800">{currentMileage} km</span>
                </div>
                <div className="grid grid-cols-2 gap-2 items-center">
                  <span className="text-gray-600">Used:</span>
                  <span className="font-medium text-gray-800">{usedMileage} km</span>
                </div>
                <div className="grid grid-cols-2 gap-2 items-center">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium text-gray-800">{remainingMileage} km</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Lifetime Usage:</h3>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  lifePercentage > 90
                    ? "bg-[#D52B1E]"
                    : lifePercentage > 75
                    ? "bg-[#FECB00]"
                    : "bg-green-500"
                }`}
                style={{ width: `${lifePercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>{lifePercentage}% used</span>
              <span>{remainingMileage} km remaining</span>
            </div>
          </div>

          {part.status === "MAINTAINED/REPLACED" ? (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <FiCheckCircle className="text-green-600 text-xl mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-800">Maintenance Complete</h4>
                <p className="text-green-700 text-sm mt-1">
                  This part has been successfully maintained or replaced. It is now in optimal condition.
                </p>
              </div>
            </div>
          ) : lifePercentage > 90 ? (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <FiAlertTriangle className="text-[#D52B1E] text-xl mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-[#D52B1E]">Maintenance Required</h4>
                <p className="text-red-700 text-sm mt-1">
                  This part has reached {lifePercentage}% of its expected lifetime. Maintenance is recommended soon.
                </p>
              </div>
            </div>
          ) : lifePercentage > 75 ? (
            <div className="mt-6 p-4 bg-[#FECB00]/10 border border-[#FECB00]/20 rounded-lg flex items-start">
              <FiAlertTriangle className="text-[#FECB00] text-xl mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-800">Maintenance Soon</h4>
                <p className="text-gray-700 text-sm mt-1">
                  This part is at {lifePercentage}% of its expected lifetime. Consider scheduling maintenance in the near future.
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/parts/edit/${part.id}`}
              className="inline-flex items-center gap-2 bg-[#FECB00] hover:bg-[#FECB00]/90 text-gray-800 px-5 py-2.5 rounded-lg font-medium transition-all"
            >
              <FiEdit /> Edit Part
            </Link>
            <button
              onClick={handleMaintain}
              disabled={part.status === "MAINTAINED/REPLACED"}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                part.status === "MAINTAINED/REPLACED"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <FiCheck /> Mark as Maintained
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 bg-[#D52B1E] hover:bg-[#D52B1E]/90 text-white px-5 py-2.5 rounded-lg font-medium transition-all"
            >
              <FiTrash2 /> Delete Part
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartDetails;
