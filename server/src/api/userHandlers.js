const bcrypt = require("bcrypt");
const sql = require("mssql");
const dbConfig = require("../config/dbConfig.js");
const { getPool } = require("./poolManager");

exports.getUsers = async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool
            .request()
            .query(`SELECT * FROM ${dbConfig.user_table_name}`);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error getting users:", err);
        res.status(500).send("Failed to retrieve users.");
    }
};

exports.addUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const pool = await getPool();
        const request = pool.request();
        request.input("name", sql.VarChar, name);
        request.input("email", sql.VarChar, email);
        request.input("password", sql.VarChar, hashedPassword);
        request.input("role", sql.VarChar, role);

        const query = `
            INSERT INTO ${dbConfig.user_table_name} (name, email, password, role)
            OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role, INSERTED.createdAt, INSERTED.updatedAt
            VALUES (@name, @email, @password, @role);
        `;
        const result = await request.query(query);
        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.removeUsers = async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res
            .status(400)
            .json({ message: "Invalid input, expected a non-empty array" });
    }

    try {
        const pool = await getPool();
        const request = pool.request();
        ids.forEach((id, index) => {
            request.input(`id${index}`, sql.Int, id);
        });
        const query = `DELETE FROM ${dbConfig.user_table_name} WHERE id IN (${ids.map((id, index) => `@id${index}`).join(", ")})`;

        const result = await request.query(query);
        if (result.rowsAffected[0] > 0) {
            res.json({
                message: `Users deleted successfully`,
                count: result.rowsAffected[0],
            });
        } else {
            res.status(404).json({ message: "No users found to delete" });
        }
    } catch (error) {
        console.error("Error removing users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.updateUser = async (req, res) => {
    const { id, name, email, password, role } = req.body;
    try {
        const pool = await getPool();
        const request = pool.request();
        request.input("id", sql.Int, id);
        request.input("name", sql.VarChar, name);
        request.input("email", sql.VarChar, email);
        request.input("password", sql.VarChar, password); // Assuming you may hash this if updating
        request.input("role", sql.VarChar, role);

        const query = `
            UPDATE ${dbConfig.user_table_name}
            SET name = @name, email = @email, password = @password, role = @role
            WHERE id = @id;
        `;
        const result = await request.query(query);
        if (result.rowsAffected[0] > 0) {
            res.json({ message: "User updated successfully", id: id });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
