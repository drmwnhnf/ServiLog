import axios from "axios";

const API_URL = "https://servilog-backend.vercel.app";

// Configure axios with auth token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getMileageById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/mileage/id/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMileagesByVehicleId = async (vehicleId) => {
  try {
    const response = await axios.get(
      `${API_URL}/mileage/vehicle/${vehicleId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createMileage = async (mileageData) => {
  try {
    const response = await axios.post(
      `${API_URL}/mileage`,
      mileageData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMileage = async (id, mileageData) => {
  try {
    const response = await axios.put(
      `${API_URL}/mileage/${id}`,
      mileageData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteMileage = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/mileage/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
