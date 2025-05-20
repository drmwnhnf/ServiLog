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
        const currentMileages = await mileageRepository.getMileagesbyVehicleId(vehicle_id);

        const vehicle = await vehicleRepository.getVehiclebyId(vehicle_id);
        if (!vehicle) {
            return baseResponse(res, false, 400, "Vehicle not found", null);
        }

        const mileageObject = {
            mileage: mileage,
            date: date
        };

        const mileageCreated = await mileageRepository.createMileage(vehicle_id, mileageObject);

        if (currentMileages.length != 0) {
            for (const m of currentMileages) {
                if (m.date.getTime() == mileageCreated.date.getTime()) {
                    await mileageRepository.deleteMileage(mileageCreated.id);
                    return baseResponse(res, false, 400, "Mileage data for the date is already stored", null);
                } else if (m.mileage > mileage && m.date < mileageCreated.date) {
                    await mileageRepository.deleteMileage(mileageCreated.id);
                    return baseResponse(res, false, 400, "Mileage for the date cannot be less than the previous date", null);
                } else if (m.mileage < mileage && m.date > mileageCreated.date) {
                    await mileageRepository.deleteMileage(mileageCreated.id);
                    return baseResponse(res, false, 400, "Mileage for the date cannot be greater than the next date", null);
                }
            }
        }

        const isChecked = await checkAllPartStatus(vehicle_id);

        if (!!mileageCreated && isChecked) {
            return baseResponse(res, true, 201, "Mileage created", mileageCreated);
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
    const { mileage } = req.body;

    if (!id || !mileage) {
        return baseResponse(res, false, 400, "Missing id or mileage", null);
    }

    if (mileage < 0) {
        return baseResponse(res, false, 400, "Mileage cannot be negative", null);
    }

    try {
        const checkMileage = await mileageRepository.getMileagebyId(id);
        if (!checkMileage) {
            return baseResponse(res, false, 404, "Mileage not found", null);
        }

        const currentMileages = await mileageRepository.getMileagesbyVehicleId(checkMileage.vehicle_id);
        for (const m of currentMileages) {
            if (m.mileage > mileage && m.date < checkMileage.date) {
                return baseResponse(res, false, 400, "Mileage for the date cannot be less than the previous date", null);
            } else if (m.mileage < mileage && m.date > checkMileage.date) {
                return baseResponse(res, false, 400, "Mileage for the date cannot be greater than the next date", null);
            }
        }

        const mileageUpdated = await mileageRepository.updateMileage(id, mileage);
        const isChecked = await checkAllPartStatus(mileageUpdated.vehicle_id);

        if (!!mileageUpdated && isChecked) {
            return baseResponse(res, true, 200, "Mileage updated", mileageUpdated);
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