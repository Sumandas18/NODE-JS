const express = require("express");

const authRoute = require("../routes/authRoute");
const userRoute = require("../routes/userRoute");
const tokenRoute = require("../routes/refreshToken");
const authViewRoute = require("../routes/authViewRoute");
const userViewRoute = require("../routes/userViewRoute");

const router = express.Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/token', tokenRoute);
router.use('/auth/view', authViewRoute);
router.use('/view', userViewRoute);

module.exports = router;