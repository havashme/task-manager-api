const express = require("express")
const pool = require("./db")
require("dotenv").config()
const cors = require("cors")
const mysql = require("mysql2")
const taskRoutes = require("./routes/taskRoutes")
const authRoutes = require("./routes/authRoutes")

const app = express()
app.use(express.json())
app.use("/api" , taskRoutes);
app.use("/api/auth" , authRoutes);


const port = process.env.PORT || 3000
app.listen(port , () =>{
  console.log(`listening port ${port}`)
})

// im havash_shadow




