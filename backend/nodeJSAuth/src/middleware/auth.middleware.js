import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader?.startsWith("Bearer ")){
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        req.user = decoded;
        
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token"
        });
    }
}