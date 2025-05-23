import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import VehicleModal from '../components/VehicleModal';
import Navbar from '../components/Navbar';

const DashboardPage = () => {    const { token, account } = useAuth();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

    // Sorting and filtering states
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'NORMAL', label: 'Normal' },
        { value: 'MAINTENANCE_DUE', label: 'Maintenance Due' },
        { value: 'MAINTENANCE_OVERDUE', label: 'Maintenance Overdue' }
    ];    const fetchVehicles = async () => {
        try {
            const response = await axios.get(`/vehicle/account/${account.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });            console.log('Raw API Response:', response);
            console.log('Response data:', response.data);
            console.log('Response payload:', response.data.payload);
            
            const vehiclesData = response.data?.payload;
            console.log('Vehicles data to be set:', vehiclesData);
            
            if (Array.isArray(vehiclesData)) {
                setVehicles(vehiclesData);
                console.log('Vehicles state set to array:', vehiclesData);
            } else {
                console.error('Vehicles data is not an array:', vehiclesData);
                setVehicles([]);
            }
        } catch (err) {
            console.error('Error fetching vehicles:', err);
            setError(err.response?.data?.message || 'Failed to fetch vehicles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [token, account.id]);

    const handleAddVehicle = () => {
        setIsVehicleModalOpen(true);
    };

    const handleVehicleClick = (vehicleId) => {
        navigate(`/vehicle/${vehicleId}`);
    };    // Filter and sort vehicles
    const filteredAndSortedVehicles = useMemo(() => {
        // Make sure vehicles is an array
        if (!Array.isArray(vehicles)) return [];
        
        console.log('Vehicles data:', vehicles);
        let filtered = [...vehicles];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(vehicle => {
                const searchFields = ['name', 'brand', 'model', 'year'].map(field =>
                    vehicle[field]?.toString().toLowerCase() || ''
                );
                return searchFields.some(field => field.includes(searchTerm.toLowerCase()));
            });
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(vehicle => vehicle.status === statusFilter);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = a[sortField]?.toString().toLowerCase() || '';
            let bValue = b[sortField]?.toString().toLowerCase() || '';            // Convert to numbers for numeric fields, strings for text fields
            if (sortField === 'year') {
                const aNum = parseInt(a[sortField]) || 0;
                const bNum = parseInt(b[sortField]) || 0;
                return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
            }

            // String comparison for text fields
            if (sortOrder === 'asc') {
                return aValue.toString().localeCompare(bValue.toString(), undefined, { numeric: true });
            } else {
                return bValue.toString().localeCompare(aValue.toString(), undefined, { numeric: true });
            }
        });

        return filtered;
    }, [vehicles, searchTerm, statusFilter, sortField, sortOrder]);

    const getStatusDisplay = (status) => {
        switch (status) {
            case 'NORMAL':
                return 'Normal';
            case 'MAINTENANCE_DUE':
                return 'Maintenance Due';
            case 'MAINTENANCE_OVERDUE':
                return 'Maintenance Overdue';
            default:
                return status;
        }
    };    if (error) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="container mx-auto px-4 pt-20">
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-arial font-bold text-gray-900 dark:text-white">
                                My Vehicles
                            </h1>
                            <button
                                onClick={handleAddVehicle}
                                className="px-4 py-2 bg-[#D52B1E] text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Add Vehicle
                            </button>
                        </div>
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    </div>
                </div>
                <VehicleModal
                    isOpen={isVehicleModalOpen}
                    onClose={(shouldRefresh) => {
                        setIsVehicleModalOpen(false);
                        if (shouldRefresh) {
                            fetchVehicles();
                        }
                    }}
                    mode="add"
                    vehicle={null}
                />
            </div>
        );
    }    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="container mx-auto px-4 pt-20">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-arial font-bold text-gray-900 dark:text-white">
                            My Vehicles
                        </h1>
                        <button
                            onClick={handleAddVehicle}
                            className="px-4 py-2 bg-[#D52B1E] text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Add Vehicle
                        </button>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D52B1E]"></div>
                    </div>
                </div>
                <VehicleModal
                    isOpen={isVehicleModalOpen}
                    onClose={(shouldRefresh) => {
                        setIsVehicleModalOpen(false);
                        if (shouldRefresh) {
                            fetchVehicles();
                        }
                    }}
                    mode="add"
                    vehicle={null}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 pt-20">
                <div className="flex flex-col space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-arial font-bold text-gray-900 dark:text-white">
                            My Vehicles
                        </h1>
                        <button
                            onClick={handleAddVehicle}
                            className="px-4 py-2 bg-[#D52B1E] text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            Add Vehicle
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-arial text-gray-600 dark:text-gray-400">Sort by:</label>
                            <select
                                value={sortField}
                                onChange={(e) => setSortField(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="name">Name</option>
                                <option value="brand">Brand</option>
                                <option value="model">Model</option>
                                <option value="year">Year</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                                className="px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-arial text-gray-600 dark:text-gray-400">Status:</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center space-x-2 md:col-span-2">
                            <input
                                type="text"
                                placeholder="Search by name, brand, model, or year..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                    </div>
                </div>                {filteredAndSortedVehicles.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400 font-arial">
                            {Array.isArray(vehicles) && vehicles.length === 0
                                ? "You haven't added any vehicles yet. Click the 'Add Vehicle' button to get started."
                                : "No vehicles match your search criteria."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAndSortedVehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                onClick={() => handleVehicleClick(vehicle.id)}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-title font-semibold text-gray-900 dark:text-white mb-2">
                                        {vehicle.name}
                                    </h3>                            <div className="space-y-2 text-gray-600 dark:text-gray-400 font-arial">
                                <p>Brand: {vehicle.brand}</p>
                                <p>Model: {vehicle.model}</p>
                                {vehicle.year && <p>Year: {vehicle.year}</p>}
                                <p className={
                                    vehicle.status === 'MAINTENANCE_OVERDUE' ? 'text-red-600 dark:text-red-400' :
                                        vehicle.status === 'MAINTENANCE_DUE' ? 'text-yellow-600 dark:text-yellow-400' :
                                            'text-green-600 dark:text-green-400'
                                }>
                                    Status: {getStatusDisplay(vehicle.status)}
                                </p>
                            </div>
                                </div>
                            </div>
                        ))}
                    </div>                )}
                <VehicleModal
                    isOpen={isVehicleModalOpen}
                    onClose={(shouldRefresh) => {
                        setIsVehicleModalOpen(false);
                        if (shouldRefresh) {
                            fetchVehicles();
                        }
                    }}
                    mode="add"
                    vehicle={null}
                />
            </div>
        </div>
    );
};

export default DashboardPage;