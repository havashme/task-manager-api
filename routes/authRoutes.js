const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

const router = express.Router();

router.get("/test", (req, res) => {
    res.send("authRoutes وصل شد!");
});

// ورود کاربر
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "نام کاربری و رمز عبور الزامی است." });
    }

    try {
        // بررسی کاربر در دیتابیس
        const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
        if (users.length === 0) {
            return res.status(404).json({ error: "کاربر یافت نشد!" });
        }

        const user = users[0];

        // بررسی رمز عبور
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "رمز عبور اشتباه است!" });
        }

        // ایجاد توکن
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET, // مقدار از .env خوانده می‌شود
            { expiresIn: "1h" }
        );

        res.json({ message: "ورود موفقیت‌آمیز بود!", token });
    } catch (err) {
        res.status(500).json({ error: "مشکلی پیش آمد! دوباره تلاش کنید." });
    }
    
});

// ثبت‌نام کاربر
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "نام کاربری و رمز عبور الزامی است." });
    }

    try {
        // بررسی اینکه آیا کاربر قبلاً ثبت‌نام کرده یا نه
        const [existingUsers] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ error: "این نام کاربری قبلاً ثبت شده است." });
        }

        // هش کردن پسورد
        const hashedPassword = await bcrypt.hash(password, 10);

        // ذخیره در دیتابیس
        await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

        res.status(201).json({ message: "ثبت‌نام با موفقیت انجام شد!" });
    } catch (err) {
        res.status(500).json({ error: "مشکلی در ثبت‌نام رخ داد. لطفاً دوباره تلاش کنید." });
    }
});




module.exports = router;












