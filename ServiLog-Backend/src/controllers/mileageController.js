const vehicleRepository = require("../repositories/vehicleRepository");
const mileageRepository = require("../repositories/mileageRepository");
const baseResponse = require("../utils/baseResponse");
const { checkAllPartStatus } = require('../services/checkStatusServices')

exports.createMileage = async (req, res) => {
    const { vehicle_id, mileage, date } = req.body;

    if (!mileage || !date) {
        return baseResponse(res, false, 400, "Missing mileage or date", null);
    }

    if (mileage < 0) {
        return baseResponse(res, false, 400, "Mileage cannot be negative", null);
    }

    try {
        const vehicle = await vehicleRepository.getVehiclebyId(vehicle_id);
        if (!vehicle) {
            return baseResponse(res, false, 400, "Vehicle not found", null);
        }

        const mileageObject = {
            vehicle_id: vehicle_id,
            mileage: mileage,
            date: date
        };

        const mileage = await mileageRepository.createMileage(mileageObject);
        const isChecked = await checkAllPartStatus(vehicle_id);

        if (!!mileage && isChecked) {
            return baseResponse(res, true, 201, "Mileage created", mileage);
        } else {
            return baseResponse(res, false, 400, "Mileage not created", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.getMileagebyId = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return baseResponse(res, false, 400, "Missing id", null);
    }

    try {
        const mileage = await mileageRepository.getMileagebyId(id);
        if (!!mileage) {
            return baseResponse(res, true, 200, "Mileage found", mileage);
        } else {
            return baseResponse(res, false, 404, "Mileage not found", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.getMileagesbyVehicleId = async (req, res) => {
    const { vehicleId } = req.params;

    if (!vehicleId) {
        return baseResponse(res, false, 400, "Missing vehicleId", null);
    }

    try {
        const mileages = await mileageRepository.getMileagesbyVehicleId(vehicleId);
        if (mileages.length > 0) {
            return baseResponse(res, true, 200, "Mileages found", mileages);
        } else {
            return baseResponse(res, false, 404, "Mileages not found", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.updateMileage = async (req, res) => {
    const { id } = req.params;
    const { mileage, date } = req.body;

    if (!id || !mileage || !date) {
        return baseResponse(res, false, 400, "Missing id, mileage or date", null);
    }

    if (mileage < 0) {
        return baseResponse(res, false, 400, "Mileage cannot be negative", null);
    }

    try {
        const checkMileage = await mileageRepository.getMileagebyId(id);
        if (!checkMileage) {
            return baseResponse(res, false, 404, "Mileage not found", null);
        }

        const mileageObject = {
            mileage: mileage,
            date: date
        };

        const mileage = await mileageRepository.updateMileage(id, mileageObject);
        const isChecked = await checkAllPartStatus(mileage.vehicle_id);

        if (!!mileage && isChecked) {
            return baseResponse(res, true, 200, "Mileage updated", mileage);
        } else {
            return baseResponse(res, false, 404, "Mileage not updated", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.deleteMileage = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return baseResponse(res, false, 400, "Missing id", null);
    }

    try {
        const mileage = await mileageRepository.deleteMileage(id);
        const isChecked = await checkAllPartStatus(mileage.vehicle_id);

        if (!!mileage && isChecked) {
            return baseResponse(res, true, 200, "Mileage deleted", mileage);
        } else {
            return baseResponse(res, false, 404, "Mileage not found", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}