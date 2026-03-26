const jwt = require("jsonwebtoken");

const tokenModel = require("./../models/tokenModel");
const verifyRefreshToken = require("./../utils/verifyRefreshToken");
const STATUS_CODE = require("./../utils/statusCode");

class TokenController {

    async checkToken(req, res) {
        try {

            const refreshToken = req.cookies.refreshToken;

            const checkToken = await verifyRefreshToken(refreshToken);

            if (checkToken.data) {
                const accessToken = jwt.sign({
                    id: checkToken.data.id,
                    name: checkToken.data.name,
                    email: checkToken.data.email,
                    role: checkToken.data.role
                }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '20s' });

                res.cookie('accessToken', accessToken);

                // return res.status(STATUS_CODE.OK).json({
                //     success: true,
                //     message: "Access token created successfully",
                //     accessToken
                // })

                if (checkToken.data.role === 'admin') {
                    res.redirect("/view/admin/dashboard");
                }
                else {
                    res.redirect("/view/dashboard");
                }
            }
            else {

                res.redirect("/auth/view/login");

                // return res.status(STATUS_CODE.SERVER_ERROR).json({
                //     success: false,
                //     message: "Internal server error"
                // })
            }
        }
        catch (err) {

            res.redirect("/auth/view/login");

            // return res.status(STATUS_CODE.SERVER_ERROR).json({
            //     success: false,
            //     message: err.message
            // })
        }
    }
}

module.exports = new TokenController();