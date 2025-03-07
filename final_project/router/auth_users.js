const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
//customer/auth/review/9?review=123
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query["review"];
    
    if (books[isbn] && books[isbn].reviews){    
        if( req.username in books[isbn].reviews) {
        books[isbn].reviews[req.username] = review;
        return res.status(200).send("User successfully updated a review");
      } else {
        books[isbn].reviews[req.username] = review;
        return res.status(200).send("User successfully added a review");
      }
    }  
    return res.status(404).json({ message: "Book not found" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    
    if (books[isbn] && books[isbn].reviews){    
        if( req.username in books[isbn].reviews) {
        delete books[isbn].reviews[req.username];
        return res.status(200).send("User successfully deleted a review");
      } 
    }  

    return res.status(404).json({ message: "Book not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
