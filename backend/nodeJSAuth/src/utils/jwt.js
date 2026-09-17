import jwt from "jsonwebtoken";

export const createAccessToken = (user) => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    )
}

export const createRefreshToken = (user) => {
    return jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '1d' }
    )
}