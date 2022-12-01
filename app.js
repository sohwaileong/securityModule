//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login", {userName:'', password:'', errMsg:''});
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req,res){
  const newUser = User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }
  });
})

app.post("/login", function(req,res){

  User.findOne({
    email: req.body.username,
  }, function(err, foundUser){
    if(err){
      console.log(err);
    } else{
      if (foundUser){
        if (foundUser.password === req.body.password){
          res.render("secrets");
        } else{
          res.render("login",{userName: req.body.username, password: req.body.password, errMsg: "Wrong Username or Password!"});
        }
      }
    }
  });
})


app.listen(3000, function(){
  console.log("Listening on port 3000");
});
