const jwt = require("jsonwebtoken");

const validateTokenMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer Token

    if (!token) {
        return res
            .status(403)
            .json({ message: "A token is required for authentication" });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // You might store decoded data in req.user for further use
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};

module.exports = validateTokenMiddleware;
