const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
var CryptoJS = require("crypto-js");
//let jwt = require('jsonwebtoken');
//let config = require('./config');
//let middleware = require('./middleware');
const bp = require("body-parser");
const db = require("./db");
app.use(bp.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json("Hi");
});
////////////////////////////////////////////////////////
// Encrypt
var ciphertext = CryptoJS.AES.encrypt(
  "my message",
  "secret key 123"
).toString();
// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext, "secret key 123");
var originalText = bytes.toString(CryptoJS.enc.Utf8);

//console.log(originalText); // 'my message'
//////////////////////////////////////////////////////////
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT password FROM login WHERE "username" = $1';
  db.query(query, [username], (err, response) => {
    if (err) {
      console.log(err.stack);
    } else {
      if (!response.rows[0]) {
        res.json("incorrect username");
      } else {
        const hash = response.rows[0].password;
        bcrypt.compare(password, hash, function (err, result) {
          if (err) {
            console.log(err);
          }
          if (result == true) {
            res.json({
              success: true,
              message: "Authentication successful!",
            });
          } else {
            res.json("incorrect password");
          }
        });
      }
    }
  });
});
app.post("/register", (req, res) => {
  const { email, username, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  db.query(
    "INSERT INTO users(username,email,password) VALUES($1,$2,$3)",
    [username, email, hash],
    (err, response) => {
      console.log(err, response);
    }
  );
  res.json("success");
});
app.post("/card", (req, res) => {
  const { username, email, website, password } = req.body;
  var ciphertext = CryptoJS.AES.encrypt(password, "secret key 123").toString();
  db.query(
    "INSERT INTO cards(username,website,email,password) VALUES($1,$2,$3,$4)",
    [username, website, email, ciphertext],
    (err, response) => {
      console.log(err, response);
      if (err) {
        res.json("fail");
      } else res.json("success");
    }
  );
});
app.post("/cardlist", (req, res) => {
  const { username } = req.body;
  db.query(
    'SELECT website,email,password FROM cards WHERE "username"=$1',
    [username],
    (err, response) => {
      if (err) {
        console.log(err);
      }
      res.json(response.rows);
    }
  );
});
app.listen(process.env.PORT || 3001, () => {
  console.log(`App is running on ${process.env.PORT}`);
});
