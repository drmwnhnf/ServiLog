const accountRepository = require("../repositories/accountRepository");
const vehicleRepository = require("../repositories/vehicleRepository");
const baseResponse = require("../utils/baseResponse");

exports.createVehicle = async (req, res) => {
    const { owner_id, name, brand, model, year } = req.body;

    if (!name || !brand || !model) {
        return baseResponse(res, false, 400, "Missing name, brand, or model", null);
    }
    
    try {
        let actualYear;

        if (!year) {
            actualYear = null;
        } else {
            actualYear = year;
        }

        const account = await accountRepository.getAccountbyId(owner_id);
        if (!account) {
            return baseResponse(res, false, 400, "Account not found", null);
        }

        const vehicleObject = {
            owner_id: owner_id,
            name: name,
            brand: brand,
            model: model,
            year: actualYear
        };

        const vehicle = await vehicleRepository.createVehicle(vehicleObject);
        if (!!vehicle) {
            return baseResponse(res, true, 201, "Vehicle created", vehicle);
        } else {
            return baseResponse(res, false, 400, "Vehicle not created", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.getVehicleById = async (req, res) => {
    const { id } = req.params;

    try {
        const vehicle = await vehicleRepository.getVehicleById(id);
        if (!!vehicle) {
            return baseResponse(res, true, 200, "Vehicle found", vehicle);
        } else {
            return baseResponse(res, false, 404, "Vehicle not found", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.getVehiclesByAccountId = async (req, res) => {
    const { accountId } = req.params;

    try {
        const vehicles = await vehicleRepository.getVehiclesByAccountId(accountId);
        if (vehicles.length > 0) {
            return baseResponse(res, true, 200, "Vehicles found", vehicles);
        } else {
            return baseResponse(res, false, 404, "Vehicles not found", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.updateVehicle = async (req, res) => {
    const { id } = req.params;
    const { name, brand, model, year } = req.body;

    if (!name || !brand || !model) {
        return baseResponse(res, false, 400, "Missing name, brand, or model", null);
    }

    try {
        let actualYear;
        
        if (!year) {
            actualYear = null;
        } else {
            actualYear = year;
        }

        const vehicleObject = {
            name: name,
            brand: brand,
            model: model,
            year: actualYear
        };

        const vehicle = await vehicleRepository.updateVehicle(vehicleObject, id);
        if (!!vehicle) {
            return baseResponse(res, true, 200, "Vehicle updated", vehicle);
        } else {
            return baseResponse(res, false, 404, "Vehicle not found", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.deleteVehicle = async (req, res) => {
    const { id } = req.params;

    try {
        const vehicle = await vehicleRepository.deleteVehicle(id);
        if (!!vehicle) {
            return baseResponse(res, true, 200, "Vehicle deleted", vehicle);
        } else {
            return baseResponse(res, false, 404, "Vehicle not found", null);
        }
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
}