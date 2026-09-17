import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import { issueAuthTokens } from "../services/auth.service.js";

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
                data: {}
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name, email, password: hashedPassword
        });

        const accessToken = issueAuthTokens(user, res);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
            },
        });

    } catch (error) {
        console.error("~ registerUser ~ error:", error)
        next(error);
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const loggedInUser = await User.findOne({ email });

        if (!loggedInUser) {
            return res.status(401).json({
                success: false,
                message: "Please enter a valid email or password",
                data: {},
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, loggedInUser.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Please enter a valid email or password",
                data: {},
            });
        }

        const accessToken = issueAuthTokens(loggedInUser, res);

        return res.status(200).json({
            success: true,
            message: "User LoggedIn Successfully",
            data: {
                id: loggedInUser._id,
                name: loggedInUser.name,
                email: loggedInUser.email,
                role: loggedInUser.role,
                accessToken
            }
        })

    } catch (error) {
        console.error("~ registerUser ~ error:", error)
        return next(error);
    }
}

export const logOutUser = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return res.status(200).json({
        success: true,
        message: "User logged out successfully",
        data: {},
    });
}

export const getCurrentUser = async (req, res, next) => {
    try {
        const userId = req.user.sub;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {},
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is inactive",
                data: {},
            });
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error("getCurrentUser error:", error);
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
        });

    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userId = req.user.sub;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {},
            });
        }

        if (email && email !== user.email) {

            const existingUser = await User.findOne({
                email,
                _id: { $ne: userId }
            });

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Email already registered",
                    data: {},
                });
            }

            user.email = email;
        }

        if (name !== undefined) {
            user.name = name
        }

        if (password !== undefined) {
            user.password = await bcrypt.hash(password, 12);
        }

        const updatedUser = user.save();

        return res.status(200).json({
            success: true,
            message: "User Updated successfully",
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isActive: updatedUser.isActive,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            }
        });

    } catch (error) {
        next(error);
    }
}

export const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const userId = req.user.sub;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: {},
            });
        }

        if (!await bcrypt.compare(oldPassword, user.password)) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect",
                data: {},
            });
        }

        const updatedPassword = await User.findByIdAndUpdate(userId, { password: await bcrypt.hash(newPassword, 12) }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
            data: {},
        })

    } catch (error) {
        next(error);
    }
}