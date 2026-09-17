import { createAccessToken, createRefreshToken } from "../utils/jwt.js";

export const issueAuthTokens = (user, res) => {

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const baseConfig = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    };

    res.cookie("refreshToken", refreshToken, {
        ...baseConfig,
        maxAge: 24 * 60 * 60 * 1000
    });

    return accessToken;
}