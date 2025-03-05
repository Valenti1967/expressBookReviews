const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    let book = books[isbn];
    if(book){
        return res.send(book);
    }

    return res.status(404).json({ message: "Book not found" });

 });
  
 function findBookByAuthor(author) {
    // Loop through each book in the 'books' object
    for (let id in books) {
      if (books[id].author === author) {
        return books[id]; // Return the book if the author matches
      }
    }
    return null; // Return null if no match is found
  }

// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    const author = req.params.author;
    let book = findBookByAuthor(author);

    if(book){
        return res.send(book);
    }

    return res.status(404).json({ message: "Book not found" });

});

function findBookByTitle(title) {
    for (let id in books) {
      if (books[id].title === title) {
        return books[id]; 
      }
    }
    return null; // Return null if no match is found
  }

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let book = findBookByTitle(title);

    if(book){
        return res.send(book);
    }

    return res.status(404).json({ message: "Book not found" });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    let reviews = books[isbn].reviews;
    if(reviews){
        return res.send(reviews);
    }

    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
