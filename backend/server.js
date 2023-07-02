const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const { check, validationResult } = require("express-validator");

const app = express();
app.use(cors());
app.use(express.json())

const db = mysql.createConnection({
    port: "3307",
    host: "localhost",
    user: "root",
    password: "T@kash1710",
    database: "assessment_regov"
    
})

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO user (`name`, `email`, `password`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];
    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});

app.post('/login', [
    check('email', "Email length error").isEmail().isLength({ min: 10, max: 30 }),
    check('password', "Password length 8-10").isLength({ min: 8, max: 10 })
  ], (req, res) => {
    const sql = "SELECT * FROM user WHERE `email` = ? AND `password` = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ success: false, errors: errors.array() }); // Return validation errors
      } else {
        if (err) {
          return res.json({ success: false, message: "Error" });
        }
        if (data.length > 0) {
          const user = data[0]; // Assuming the query returns a single user row
          return res.json({ success: true, message: "Success", user: user }); // Return user data along with success response
        } else {
          return res.json({ success: false, message: "Failed" });
        }
      }
    });
  });
  


app.listen(8081, () => {
    console.log("Listening");
})