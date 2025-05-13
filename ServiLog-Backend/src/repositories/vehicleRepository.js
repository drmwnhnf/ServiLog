const { pool } = require('../configs/db');

exports.createVehicle = async (vehicle) => {
    try {
        const res = await pool.query(
            "INSERT INTO vehicles (owner_id, name, brand, model, year) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
            [vehicle.owner_id, vehicle.name, vehicle.brand, vehicle.model, vehicle.year]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.getVehiclebyId = async (id) => {
    try {
        const res = await pool.query(
            "SELECT * FROM vehicles WHERE id = $1", 
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.getVehiclesbyAccountId = async (userId) => {
    try {
        const res = await pool.query(
            "SELECT * FROM vehicles WHERE owner_id = $1", 
            [userId]
        );
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.updateVehicle = async (vehicle, id) => {
    try {
        const res = await pool.query(
            "UPDATE vehicles SET name = $1, brand = $2, model = $3, year = $4, updated_at = $5 WHERE id = $6 RETURNING *", 
            [vehicle.name, vehicle.brand, vehicle.model, vehicle.year, new Date(), id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.deleteVehicle = async (id) => {
    try {
        const res = await pool.query(
            "DELETE FROM vehicles WHERE id = $1 RETURNING *", 
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.updateVehicleStatus = async (id, status) => {
    try {
        const res = await pool.query(
            "UPDATE vehicles SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *", 
            [status, new Date(), id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}