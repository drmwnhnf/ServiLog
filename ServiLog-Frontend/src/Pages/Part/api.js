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

export const getPartById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/part/id/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPartsByVehicleId = async (vehicleId) => {
  try {
    const response = await axios.get(
      `${API_URL}/part/vehicle/${vehicleId}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPart = async (partData) => {
  try {
    const response = await axios.post(
      `${API_URL}/part`,
      partData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const maintainPart = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/part/maintain/${id}`,
      {},
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePart = async (id, partData) => {
  try {
    const response = await axios.put(
      `${API_URL}/part/${id}`,
      partData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePart = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/part/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
