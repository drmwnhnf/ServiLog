const { pool } = require('../configs/db');

exports.getPartbyId = async (id) => {
    try {
        const res = await pool.query(
            "SELECT * FROM parts WHERE id = $1", 
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.getPartsbyVehicleId = async (vehicleId) => {
    try {
        const res = await pool.query(
            "SELECT * FROM parts WHERE vehicle_id = $1", 
            [vehicleId]
        );
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.createPart = async (part, vehicleId) => {
    try {
        const res = await pool.query(
            "INSERT INTO parts (vehicle_id, name, brand, model, year, install_mileage, lifetime_mileage) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", 
            [vehicleId, part.name, part.brand, part.model, part.year, part.install_mileage, part.lifetime_mileage]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.updatePart = async (part, id) => {
    try {
        const res = await pool.query(
            "UPDATE parts SET name = $1, brand = $2, model = $3, year = $4, install_mileage = $5, lifetime_mileage = $6, updated_at = $7 WHERE id = $8 RETURNING *", 
            [part.name, part.brand, part.model, part.year, part.install_mileage, part.lifetime_mileage, new Date(), id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.deletePart = async (id) => {
    try {
        const res = await pool.query(
            "DELETE FROM parts WHERE id = $1 RETURNING *", 
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.updatePartStatus = async (id, status) => {
    try {
        const res = await pool.query(
            "UPDATE parts SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *", 
            [status, new Date(), id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}