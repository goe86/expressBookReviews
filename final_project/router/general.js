const express = require('express');
let books = require("./booksdb.js");
const { JsonWebTokenError } = require('jsonwebtoken');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
let username= req.body.username
let password= req.body.password

if (!isValid(username)){
    users.push({username, password})
    return res.status(200).json({message: "User registered Successfully"})
}else{
    return res.status(400).json({message: "User Already Exists!"});
    }
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    let allBooks= new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(res.status(200).json(books))
        },1000)})
        return allBooks;
    });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn=req.params.isbn
  let bookByIsbn= new Promise ((resolve,reject)=>{
    setTimeout (()=>{
        resolve(res.status(200).json(books[isbn]))
    },1000)
})  
    return bookByIsbn ;
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
let author=req.params.author
let booksbyAuthor=[]
Object.keys(books).forEach(key => {
    let book = books[key]
    if (book.author===author){
        booksbyAuthor.push(book.title)
    }})
    if(booksbyAuthor.length>0){
        return res.status(200).json(booksbyAuthor);
    }else{
        return res.status(404).json({ message: "No books found for the given author" });
    }
})


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title
  let bookbyTitle=[]
  Object.keys(books).forEach(key=>{
    let book=books[key]
    if (book.title===title){
        bookbyTitle.push(book.title)
    }
  })
  if(bookbyTitle.length>0){
  return res.status(200).json(bookbyTitle);
}else{
  return res.status(404).json({ message: "No books found with that title" });
 
}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn=req.params.isbn
  return res.status(200).json(books[isbn]['reviews']);
});

module.exports.general = public_users;
