const express = require('express');
const jwt = require('jsonwebtoken');
const  books = require("./booksdb.js");
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
    let isbn=req.params.isbn
    let review = req.query.review
    let username=req.query.user
    let book = books[isbn]
    if (book){
        if(!Array.isArray(book["reviews"])){
            book["reviews"]=[]
        }
        book["reviews"].push({
          name: username,
          review: review
         });
         return res.status(200).json({message: "User review updated successfully", book: books[isbn]})
    }else{
        return res.status(404).json({ message: "Book not found" });
    }
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
    let isbn=req.params.isbn
    let book = books[isbn]
    let username = req.query.user
    let bookReviews=book['reviews']
    
    
    if (book){
        if(!Array.isArray(bookReviews)){
           bookReviews=[]
        }
      
    bookReviews.forEach(bookReview => {        
        if(username===bookReview.name){
           delete bookReview.name
           delete bookReview.review
           return res.status(200).json({message: `User Review Deleted Successfully,\n ${(book)}`})
        }else{
            return res.json({message: "User Review Not Found"})
        }
    })}
})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
