const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const authModel = require("../models/authModel");
const tokenModel = require("../models/tokenModel");
const STATUS_CODE = require("../utils/statusCode");

class AuthController {

    async authRegister(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(STATUS_CODE.BAD_GATEWAY).json({
                    success: false,
                    message: "All field required"
                })
            }

            const checkAuth = await authModel.findOne({ email });
            if (checkAuth) {
                return res.status(STATUS_CODE.BAD_GATEWAY).json({
                    success: false,
                    message: "User already exist"
                })
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = bcrypt.hashSync(password, salt);

            const authObj = new authModel({ name, email, password: hashPassword });

            const authData = await authObj.save();

            // Redirect to login page with a success query param (optional UI addition) or just redirect
            return res.redirect("/auth/view/login");
        }
        catch (err) {
            // Can pass error to UI via flash messages, for now simply redirect to register
            return res.redirect("/auth/view/register");
        }
    }

    async authLogin(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {

                res.redirect("/auth/view/login");

                // return res.status(STATUS_CODE.NOT_FOUND).json({
                //     success: false,
                //     message: 'All fields required'
                // })
            }

            const existUser = await authModel.findOne({ email });
            // console.log(existUser);

            if (!existUser) {

                res.redirect("/auth/view/login");

                // return res.status(STATUS_CODE.BAD_GATEWAY).json({
                //     success: false,
                //     message: "User not found"
                // });
            }

            const checkPassword = await bcrypt.compare(password, existUser.password);

            if (!checkPassword) {

                res.redirect("/auth/view/login");

                // return res.status(STATUS_CODE.BAD_GATEWAY).json({
                //     success: false,
                //     message: "Password not match"
                // });
            }
            else {
                const access_token = jwt.sign({
                    id: existUser._id,
                    name: existUser.name,
                    email: existUser.email,
                    role: existUser.role
                }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '20s' });

                const refresh_token = jwt.sign({
                    id: existUser._id,
                    name: existUser.name,
                    email: existUser.email,
                    role: existUser.role
                }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' });

                const tokenObj = new tokenModel({
                    userId: existUser._id,
                    token: refresh_token
                });

                await tokenObj.save();

                res.cookie("refreshToken", refresh_token);
                res.cookie('accessToken', access_token);

                // return res.status(STATUS_CODE.OK).json({
                //     success: true,
                //     message: "Logged in successfully",
                //     data: {
                //         name: existUser.name,
                //         email: existUser.email
                //     },
                //     access_token, refresh_token
                // })

                if (existUser.role === 'admin') {
                    res.redirect("/view/admin/dashboard");
                }
                else {
                    res.redirect("/view/dashboard");
                }
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

    loginPage(req, res) {
        res.render("pages/auth/login",
            { title: 'Login Page' });
    }

    registerPage(req, res) {
        res.render("pages/auth/register",
            { title: 'Register Page' });
    }

    async logout(req, res) {

        if (req.user.id) {
            await tokenModel.deleteMany({ userId: req.user.id });
        }

        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.redirect("/auth/view/login")
    }
}

module.exports = new AuthController();