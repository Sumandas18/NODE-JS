const jwt = require("jsonwebtoken");

const tokenModel = require("./../models/tokenModel");

const verifyRefreshToken = async (refreshToken) => {
    try {
        const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

        const existToken = await tokenModel.findOne({ token: refreshToken });

        if (!existToken) {
            return {
                data: null,
                message: 'Invalid refresh token'
            }
        }
        else {
            const verifyToken = jwt.verify(refreshToken, REFRESH_SECRET_KEY);

            if (!verifyToken) {
                return {
                    data: null,
                    message: 'Invalid refresh token'
                }
            }
            else {
                return {
                    data: verifyToken,
                    message: 'Valid refresh token'
                }
            }
        }
    }
    catch (err) {
        return {
            data: null,
            message: 'Invalid refresh token'
        }
    }
}

module.exports = verifyRefreshToken;    