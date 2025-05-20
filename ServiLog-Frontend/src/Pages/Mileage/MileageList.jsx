import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMileagesByVehicleId, deleteMileage } from "./api";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiAlertTriangle,
  FiBarChart2,
} from "react-icons/fi";
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MileageList = () => {
  const [mileages, setMileages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { vehicleId } = useParams();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchMileages = async () => {
      try {
        setLoading(true);
        const response = await getMileagesByVehicleId(vehicleId);

        if (response.success) {
          // Just set the data as received from backend
          setMileages(response.payload);
          
          // Prepare chart data
          if (response.payload.length > 0) {
            // Sort chronologically for the chart
            const chronologicalData = [...response.payload].sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            );
            
            const labels = chronologicalData.map((m) =>
              new Date(m.date).toLocaleDateString()
            );

            const data = chronologicalData.map((m) => m.mileage);

            setChartData({
              labels,
              datasets: [
                {
                  label: "Mileage (km)",
                  data,
                  fill: false,
                  backgroundColor: "#D52B1E",
                  borderColor: "#D52B1E",
                  tension: 0.1,
                },
              ],
            });
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

    fetchMileages();
  }, [vehicleId]);

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this mileage record?")
    ) {
      try {
        const response = await deleteMileage(id);

        if (response.success) {
          // Refresh the data after deletion
          const refreshResponse = await getMileagesByVehicleId(vehicleId);
          if (refreshResponse.success) {
            setMileages(refreshResponse.payload);
            
            // Update chart
            if (refreshResponse.payload.length > 0) {
              const chronologicalData = [...refreshResponse.payload].sort(
                (a, b) => new Date(a.date) - new Date(b.date)
              );
              
              const labels = chronologicalData.map((m) =>
                new Date(m.date).toLocaleDateString()
              );
              const data = chronologicalData.map((m) => m.mileage);
              
              setChartData({
                labels,
                datasets: [
                  {
                    label: "Mileage (km)",
                    data,
                    fill: false,
                    backgroundColor: "#D52B1E",
                    borderColor: "#D52B1E",
                    tension: 0.1,
                  },
                ],
              });
            } else {
              setChartData(null);
            }
          }
        } else {
          alert(response.message);
        }
      } catch (err) {
        alert("Failed to delete mileage record");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D52B1E]"></div>
      </div>
    );
  }

  if (error && !mileages.length) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <FiAlertTriangle className="h-8 w-8 text-[#D52B1E]" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No Mileage Data
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {error || "No mileage records found for this vehicle."}
          </p>
          <div className="mt-6">
            <Link
              to={`/mileage/add/${vehicleId}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D52B1E] hover:bg-[#D52B1E]/90"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              Add First Mileage Record
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Mileage History",
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <FiBarChart2 className="mr-2 text-[#D52B1E]" />
          Mileage History
        </h2>
        <Link
          to={`/mileage/add/${vehicleId}`}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#D52B1E] hover:bg-[#D52B1E]/90"
        >
          <FiPlus className="mr-2" />
          Add Mileage
        </Link>
      </div>

      {chartData && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="h-64 w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mileage (km)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mileages.map((mileage) => (
                <tr key={mileage.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(mileage.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {mileage.mileage.toLocaleString()} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/mileage/edit/${mileage.id}`}
                      className="text-[#FECB00] hover:text-[#FECB00]/80 mr-4"
                    >
                      <FiEdit className="inline h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(mileage.id)}
                      className="text-[#D52B1E] hover:text-[#D52B1E]/80"
                    >
                      <FiTrash2 className="inline h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MileageList;
