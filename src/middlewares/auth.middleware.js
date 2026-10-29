const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: 'Token not found'
        });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.SECRET_KEY
        );
        console.log(payload.role)

        req.username = payload.username;
        req.role = payload.role;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid JWT token'
        });
    }
};

module.exports = authMiddleware;