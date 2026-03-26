const jwt = require("jsonwebtoken");

const checkAuth = async (req, res, next) => {
    // console.log(req.cookies);

    try {
        if (req.cookies && req.cookies.accessToken) {

            const data = jwt.verify(req.cookies.accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
            // console.log(data);

            if (!data) {
                // console.log(" Token invalid or expired for:", req.path);


                if (req.path === "/token/generate") {
                    return res.redirect("/auth/view/login");
                }

                return res.redirect("/token/generate");
            }

            //console.log(" Token valid:", data);

            req.user = data;

            next();
        } else {
            return res.redirect("/auth/view/login");
        }
    }
    catch (err) {
        // console.log(" Token invalid or expired for:", req.path);

        if (req.path === "/token/generate") {
            return res.redirect("/auth/view/login");
        }

        return res.redirect("/token/generate");
    }
};

module.exports = checkAuth;