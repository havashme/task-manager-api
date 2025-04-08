const express = require("express")
const pool = require("../db")
const auth = require("./middleware_auth")

const router = express.Router()


// router.get("/tasks" ,async (req , res) => {
//     try{
//           const [rows] = await  pool.query(`select * from tasks `)
//             res.json(rows)
//     }catch(err) {
//           res.status(500).json({error : err.message})
//     }
// })

router.get("/tasks" , auth , async (req , res) => {
    const user_id = req.user.userId;

    try{
        const [tasks] = await pool.query
        (`select * from tasks WHERE id = ?` , [user_id]);
        res.json(tasks);
    }catch(err) {
        res.status(500).json({error : err.message});
    }
})

router.post("/tasks" , auth , async (req , res) => {
    const {title} = req.body;
    const userId = req.user.userId;   //  از توکن گرفته میشه

    const completed = false

    if(!title)return res.status(500).json({error : "task title is required"})
        try{
     const[result] = await pool.query
     (`insert into tasks (title , completed , id) values (? , ? , ?)` ,
         [title , completed , userId]);
         res.status(201).json({id : result.insertId , title , completed : false});
    }catch(err) {
        res.status(500).json({error : err.message});
    }
})

// "اضافه کردن تسک جدید"
router.post("/tasks" ,async (req , res) => {
    const {title} = req.body;
//   console.log(title)
    if(!title)return res.status(400).json({error : "the title must not be empty"})
        try{
    const [result] = await pool.query(`insert into tasks (title , completed) values (? , ?)` , [title , false]);
    res.json({id : result.insertId , title , completed : false})
    }catch(err) {
         res.status(500).json({error : err.message})
    }
   
})

// "ویزاییش تسک"
router.put("/tasks/:id" ,async (req , res) => {
 const {id} = req.params;
 const {title , completed} = req.body;
if(!title)return res.status(400).json({error : "the title must not be empty"})

    try{
await pool.query(`update tasks set title = ? , completed = ? where id = ?` , [title , completed , id]);
   
        res.json({message : "update to task"});

    }catch(err) {
          res.status(500).json({error : err.message});
    }
})

//"حذف تسک"
router.delete("/tasks/:id" ,async (req , res) => {
    const {id} = req.params;
    try{
   await pool.query(`DELETE FROM tasks WHERE id = ?` , [id]); 
        res.json({message : "delete to task"});

    }catch(err) {
        res.status(500).json({error : err.message})
    }
})




module.exports = router




