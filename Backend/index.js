const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({

    host: "localhost",
    user: "root",
    password: "",
    database: "office_transactions"

})

db.connect((err)=>{
    if(err) throw err;
    console.log("connected to mysql")
});


app.get("/api/transactions", (req,res)=>{

    const sql = "SELECT * FROM transactions ORDER BY date DESC";

    db.query(sql, (err,result)=>{
        if(err) throw err;

        res.json(result);
    })
})

app.post("/api/transactions", (req,res)=>{
    const{ description, credit, debit}= req.body;
    console.log(req.body)

    const balanceQurery = 
    "SELECT running_balance FROM transactions ORDER BY id DESC LIMIT 1 ";

    db.query (balanceQurery, async(err,result)=>{
        if(err) throw err;

        let running_balance = await result.length> 0 ? result[0].running_balance : 0;


        running_balance += credit - debit
        console.log(typeof running_balance)
        console.log(running_balance)

        const newTransaction = { description, credit, debit, running_balance};

       const sql = "INSERT INTO transactions SET ?";
       db.query(sql, newTransaction, (err)=>{

        if(err) throw err;
        res.json({message: "Transaction added", transaction: newTransaction});


       });
    });
});

app.listen(3001,()=>{
    console.log("Server is running");
})