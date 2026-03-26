const authModel = require("../models/authModel");
const STATUS_CODE = require("../utils/statusCode");

class UserController {

    async userListPage(req, res) {
        const users = await authModel.find();

        res.render("pages/adminDashboard",
            {
                title: 'Dashboard',
                users
            });
    }

    async profilePage(req, res) {
        res.render("pages/userDashboard",
            {
                title: 'Profile',
                user: req.user
            });
    }

    async fetchAllUser(req, res) {
        try {
            const users = await authModel.find();

            return res.status(STATUS_CODE.OK).json({
                success: true,
                message: "All available users",
                count: users.length,
                data: users
            })
        }
        catch (err) {
            return res.status(STATUS_CODE.SERVER_ERROR).json({
                success: false,
                message: err.message
            })
        }
    }

    async fetchUserProfile(req, res) {
        try {
            const user = req.user;

            if (!user) {
                return res.status(STATUS_CODE.BAD_GATEWAY).json({
                    success: false,
                    message: "Token is required"
                })
            }

            return res.status(STATUS_CODE.OK).json({
                success: true,
                message: "Profile data",
                data: user
            })
        }
        catch (err) {
            return res.status(STATUS_CODE.SERVER_ERROR).json({
                success: false,
                message: err.message
            })
        }
    }
}

module.exports = new UserController();