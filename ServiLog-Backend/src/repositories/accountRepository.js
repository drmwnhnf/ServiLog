const { pool } = require('../configs/db');

exports.register = async (account) => {
    try {
        const res = await pool.query(
            "INSERT INTO accounts (name, password, email) VALUES ($1, $2, $3) RETURNING *", 
            [account.name, account.password, account.email]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getAccountbyEmail = async (email) => {
    try {
        const res = await pool.query(
            "SELECT * FROM accounts WHERE email = $1", 
            [email]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.login = async (email, password) => {
    try {
        const res = await pool.query(
            "SELECT * FROM accounts WHERE email = $1 AND password = $2", 
            [email, password]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.updateAccount = async (account, id) => {
    try {
        const res = await pool.query(
            "UPDATE accounts SET name = $1, password = $2, email = $3 WHERE id = $4 RETURNING *", 
            [account.name, account.password, account.email, id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.getAccountbyId = async (id) => {
    try {
        const res = await pool.query(
            "SELECT * FROM accounts WHERE id = $1", 
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.deleteAccount = async (id) => {
    try {
        const res = await pool.query(
            "DELETE FROM accounts WHERE id = $1 RETURNING *", 
            [id]
        );
        return res.rows[0]
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.verifyAccount = async (id) => {
    try {
        const res = await pool.query(
            "UPDATE accounts SET is_verified = true WHERE id = $1 RETURNING *", 
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}