const express = require('express');
const mysql = require('mysql2/promise');
const http = require('http');
const path = require("path");
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const app = express();
const server = http.createServer(app);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./login')));
app.use(limiter);

app.get('/', function(req,res){
    res.sendFile(path.join(__dirname,'./login.html'));
});

// Insert
app.post('/', async function (req, res) {
    const conn = await mysql.createConnection("mysql://root:12345@localhost:3306/mem_game");
    conn.query('INSERT INTO user_login(username, pass_word) VALUES(?,?)', [req.body.username, req.body.password], function (err) {
        if (err) {
            return console.log(err.message);
        }
        console.log("New user has been added");
        res.send("New user has been added into the database ");
    });
});

server.listen(5500,function(){ 
    console.log("Server listening on port: 5500");
});