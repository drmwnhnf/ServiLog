const vehicleRepository = require("../repositories/vehicleRepository");
const partRepository = require("../repositories/partRepository");
const { checkPartStatus } = require('../services/checkStatusServices');
const baseResponse = require("../utils/baseResponse");

exports.getPartbyId = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return baseResponse(res, false, 400, "Missing id", null);
    }

    try {
        const part = await partRepository.getPartbyId(id);
        if (!!part) {
            return baseResponse(res, true, 200, "Part found", part);
        } else {
            return baseResponse(res, false, 404, "Part not found", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.getPartsbyVehicleId = async (req, res) => {
    const { vehicleId } = req.params;

    if (!vehicleId) {
        return baseResponse(res, false, 400, "Missing vehicleId", null);
    }

    try {
        const vehicle = await vehicleRepository.getVehiclebyId(vehicleId);
        if (!vehicle) {
            return baseResponse(res, false, 404, "Vehicle not found", null);
        }

        const parts = await partRepository.getPartsbyVehicleId(vehicleId);
        if (parts.length > 0) {
            return baseResponse(res, true, 200, "Parts found", parts);
        } else {
            return baseResponse(res, false, 404, "Parts not found", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.createPart = async (req, res) => {
    const { vehicle_id, name, brand, model, year, install_mileage, lifetime_mileage} = req.body;

    if (!name || !brand || !model || !install_mileage || !lifetime_mileage) {
        return baseResponse(res, false, 400, "Missing name, brand, model, install_mileage, or lifetime_mileage", null);
    }

    if (install_mileage < 0 || lifetime_mileage < 0) {
        return baseResponse(res, false, 400, "Install mileage or lifetime mileage cannot be negative", null);
    }

    try {
        const vehicle = await vehicleRepository.getVehiclebyId(vehicle_id);
        if (!vehicle) {
            return baseResponse(res, false, 404, "Vehicle not found", null);
        }

        let actualYear;
        if (!year) {
            actualYear = null;
        }

        const partObject = {
            name: name,
            brand: brand,
            model: model,
            year: actualYear,
            install_mileage: install_mileage,
            lifetime_mileage: lifetime_mileage
        };

        const part = await partRepository.createPart(partObject, vehicle_id);
        const isChecked = await checkPartStatus(part.id);

        if (!!part && isChecked) {
            return baseResponse(res, true, 201, "Part created", newPart);
        } else {
            return baseResponse(res, false, 400, "Part not created", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.maintainPart = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return baseResponse(res, false, 400, "Missing id", null);
    }

    try {
        const part = await partRepository.updatePartStatus(id, 'MAINTAINED/REPLACED');
        if (!!part) {
            return baseResponse(res, true, 200, "Part maintained", part);
        } else {
            return baseResponse(res, false, 404, "Part not found", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.updatePart = async (req, res) => {
    const { id } = req.params;
    const { name, brand, model, year, install_mileage, lifetime_mileage } = req.body;

    if (!id) {
        return baseResponse(res, false, 400, "Missing id", null);
    }

    if (!name || !brand || !model || !install_mileage || !lifetime_mileage) {
        return baseResponse(res, false, 400, "Missing name, brand, model, install_mileage or lifetime_mileage", null);
    }

    if (install_mileage < 0 || lifetime_mileage < 0) {
        return baseResponse(res, false, 400, "Install mileage or lifetime mileage cannot be negative", null);
    }

    try {

        let actualYear;
        if (!year) {
            actualYear = null;
        }

        const partObject = {
            name: name,
            brand: brand,
            model: model,
            year: actualYear,
            install_mileage: install_mileage,
            lifetime_mileage: lifetime_mileage
        };

        const part = await partRepository.updatePart(partObject, id);
        const isChecked = await checkPartStatus(part.id);
        
        if (!!part && isChecked) {
            return baseResponse(res, true, 200, "Part updated", part);
        } else {
            return baseResponse(res, false, 404, "Part not found", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.deletePart = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return baseResponse(res, false, 400, "Missing id", null);
    }

    try {
        const part = await partRepository.deletePart(id);
        if (!!part) {
            return baseResponse(res, true, 200, "Part deleted", part);
        } else {
            return baseResponse(res, false, 404, "Part not found", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}