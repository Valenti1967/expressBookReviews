const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) {
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registered. Now you can login" });
      } else {
        return res.status(404).json({ message: "User already exists!" });
      }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

function getBooks(){
    return books;
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    new Promise((resolve, reject) => {
        
        const currentBooks = getBooks();  
        
        if (currentBooks) {
          resolve(currentBooks);
        } else {
          reject('No books found');
        }
      })
      .then((currentBooks) => {
        return res.send(currentBooks); 
      })
      .catch((error) => {
        return res.status(500).send({ error: error }); 
      });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Create a new Promise
    new Promise((resolve, reject) => {
        const book = books[isbn];
        
        if (book) {
            resolve(book);  // Resolving the Promise with the book if found
        } else {
            reject({ message: "Book not found" });  // Rejecting the Promise if not found
        }
    })
    .then(book => {
        return res.send(book);  // Send the book in the response if resolved
    })
    .catch(err => {
        return res.status(404).json(err);  // Send error response if rejected
    });
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

    // Create a new Promise
    new Promise((resolve, reject) => {
        const book = findBookByAuthor(author);

        if (book) {
            resolve(book);  // Resolve the promise with the book if found
        } else {
            reject({ message: "Book not found" });  // Reject the promise if the book is not found
        }
    })
    .then(book => {
        return res.send(book);  // Send the book in the response if the promise resolves
    })
    .catch(err => {
        return res.status(404).json(err);  // Send the error response if the promise is rejected
    });
});

function findBookByTitle(title) {
    for (let id in books) {
      if (books[id].title === title) {
        return books[id]; // Return the book if the title matches
      }
    }
    return null; // Return null if no match is found
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

     // Create a new Promise
     new Promise((resolve, reject) => {
        const book = findBookByTitle(title);

        if (book) {
            resolve(book);  // Resolve the promise with the book if found
        } else {
            reject({ message: "Book not found" });  // Reject the promise if the book is not found
        }
    })
    .then(book => {
        return res.send(book);  // Send the book in the response if the promise resolves
    })
    .catch(err => {
        return res.status(404).json(err);  // Send the error response if the promise is rejected
    });
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
