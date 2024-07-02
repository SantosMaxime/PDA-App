const bcrypt = require("bcrypt");
const sql = require("mssql");
const dbConfig = require("../config/dbConfig.js");
const jwt = require("jsonwebtoken");
const { addToken, validateToken } = require("./tokenStorage");

exports.loginUser = async (req, res) => {
    const { email, password, token } = req.body;

    if (req.session.isAuthenticated) {
        return res.json({
            message: "Already authenticated",
            token: req.cookies.accessToken,
        });
    }

    if (token) {
        if (!validateToken(token)) {
            return res.status(401).json({
                message:
                    "Your token is invalid or has expired. Please log in again.",
            });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            await sql.connect(dbConfig);
            const request = new sql.Request();
            request.input("email", sql.VarChar, decoded.user.email);
            const result = await request.query(
                `SELECT id, name, email, password, role, createdAt, updatedAt FROM ${dbConfig.user_table_name} WHERE email = @email`,
            );

            if (result.recordset.length > 0) {
                const user = result.recordset[0];
                if (validateToken(token)) {
                    // Ensure the token is still valid in the server's memory
                    return res.json({
                        message: "Token validated successfully",
                        token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        },
                    });
                } else {
                    return res.status(401).json({
                        message:
                            "Token is no longer valid. Please log in again.",
                    });
                }
            } else {
                return res.status(401).json({ message: "User not found." });
            }
        } catch (error) {
            return res
                .status(401)
                .json({ message: "Invalid or expired token." });
        }
    }

    if (!email || !password) {
        return res.status(400).json({
            message:
                "Email and password are required for login without a token.",
        });
    }

    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input("email", sql.VarChar, email);
        const result = await request.query(
            `SELECT id, name, email, password, role, createdAt, updatedAt FROM ${dbConfig.user_table_name} WHERE email = @email`,
        );

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = result.recordset[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            const newToken = jwt.sign(
                {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                },
                process.env.JWT_SECRET,
                { expiresIn: "30d" },
            );

            addToken(newToken);

            res.json({
                message: "Login successful",
                token: newToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } else {
            res.status(401).json({ message: "Invalid password" });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal Server Error" });
    } finally {
        await sql.close();
    }
};
