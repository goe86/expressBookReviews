const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username===username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.find(user => user.username===username && user.password===password)
}
//only registered users can login
regd_users.post("/login", (req,res) => {
let username =req.body.username
let password = req.body.password

  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"})
  }

  if (authenticatedUser){
    const userPayload= {userN: authenticatedUser.username}
    const accessToken= jwt.sign(userPayload,"fingerprint_customer",{expiresIn: 60*60})
    return res.status(200).send({message:"User Log in Successfully!", accessToken});
  }else {
    return res.status(401).json({message:"Invalid username or password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
