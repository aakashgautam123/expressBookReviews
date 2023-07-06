const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req, res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  
  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Username &/ password not provided"});

});

public_users.get('/', async function (req, res) {
  try {
    const bookList = await getBookList();
    res.send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function getBookList() {
  return new Promise((resolve, reject) => {
    try {
      // You can replace this setTimeout with your actual asynchronous logic to fetch the book list
      setTimeout(() => {
        resolve(books);
      }, 1000); // Simulating a delay of 1 second
    } catch (error) {
      reject(error);
    }
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  getBookDetails(isbn)
    .then((bookDetails) => {
      res.send(JSON.stringify(bookDetails, null, 4));
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

function getBookDetails(isbn) {
  return new Promise((resolve, reject) => {
    try {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error('Book not found'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  getBooksByAuthor(author)
    .then((booksByAuthor) => {
      res.send(JSON.stringify(booksByAuthor, null, 4));
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    try {
      const booksByAuthor = Object.values(books).filter((book) => book.author === author);
      resolve(booksByAuthor);
    } catch (error) {
      reject(error);
    }
  });
}

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  getBooksByTitle(title)
    .then((booksByTitle) => {
      res.send(JSON.stringify(booksByTitle, null, 4));
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    try {
      const booksByTitle = Object.values(books).filter((book) => book.title === title);
      resolve(booksByTitle);
    } catch (error) {
      reject(error);
    }
  });
}


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;

  let book = books[isbn];

  res.send(JSON.stringify(book.reviews, null, 4));
});

module.exports.general = public_users;
