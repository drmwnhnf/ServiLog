const { pool } = require('../configs/db');

exports.getMileagebyId = async (id) => {
    try {
        const res = await pool.query(
            "SELECT * FROM mileages WHERE id = $1", 
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.getMileagesbyVehicleId = async (vehicleId) => {
    try {
        const res = await pool.query(
            "SELECT * FROM mileages WHERE vehicle_id = $1 ORDER BY mileage DESC", 
            [vehicleId]
        );
        return res.rows;
    }
    catch (error) {
        console.error("Error executing query", error);
    }
}

exports.createMileage = async (vehicleId, mileage) => {
    try {
        const res = await pool.query(
            "INSERT INTO mileages (vehicle_id, mileage, date) VALUES ($1, $2, $3) RETURNING *", 
            [vehicleId, mileage.mileage, mileage.date]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.updateMileage = async (id, mileage) => {
    try {
        const res = await pool.query(
            "UPDATE mileages SET mileage = $1, updated_at = $2 WHERE id = $3 RETURNING *", 
            [mileage, new Date(), id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.deleteMileage = async (id) => {
    try {
        const res = await pool.query(
            "DELETE FROM mileages WHERE id = $1 RETURNING *", 
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}