const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.query.review;
  let isbn = req.params.isbn;
  let username = req.session.username; // Assuming the username is stored in the session
  
  // Check if the book exists in the "books" object
  if (books.hasOwnProperty(isbn)) {
    // Check if the user has already posted a review for the same ISBN
    if (books[isbn].reviews.hasOwnProperty(username)) {
      // Modify the existing review for the user
      books[isbn].reviews[username] = review;
      
      // Send a response indicating the review was modified successfully
      res.status(200).json({ message: "Review modified successfully" });
    } else {
      // Add a new review for the user under the same ISBN
      books[isbn].reviews[username] = review;
      
      // Send a response indicating the review was added successfully
      res.status(200).json({ message: "Review added successfully" });
    }
  } else {
    // Send a response indicating that the book was not found
    res.status(404).json({ error: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.session.username; // Assuming the username is stored in the session
  
  // Check if the book exists in the "books" object
  if (books.hasOwnProperty(isbn)) {
    // Check if the user has a review for the same ISBN
    if (books[isbn].reviews.hasOwnProperty(username)) {
      // Delete the user's review for the book
      delete books[isbn].reviews[username];
      
      // Send a response indicating the review was deleted successfully
      res.status(200).json({ message: "Review deleted successfully" });
    } else {
      // Send a response indicating that the user's review was not found
      res.status(404).json({ error: "Review not found for the user" });
    }
  } else {
    // Send a response indicating that the book was not found
    res.status(404).json({ error: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
