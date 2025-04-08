const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");

    console.log("token" , token)

    if (!token) return res.status(401).json({ error: "دسترسی غیرمجاز!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.dir(decoded)
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "توکن نامعتبر است!" });
    }
};




