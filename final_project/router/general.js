const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios')
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

public_users.get('/', function (req, res) {
    // Retrieve and display the list of books
    res.status(200).send(JSON.stringify(books, null, 4));
  });

//using Promise callbacks or async-await with Axios  
public_users.get('/promise', (req, res) => {
    axios.get('https://poojamishra4-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/')
      .then(response => {
        res.status(200).json(response.data);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error fetching books' });
      });
  });

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
      res.status(200).send(JSON.stringify(book, null, 4));
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });
  

//using Promise callbacks or async-await with Axios  
public_users.get('/isbn/promise/:isbn', (req, res) => {
    const { isbn } = req.params;
    axios.get(`https://poojamishra4-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`)
      .then(response => {
        res.status(200).json(response.data);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error fetching book details' });
      });
  });

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookList = Object.values(books).filter(book => book.author === author);
    
    if (bookList.length > 0) {
      res.status(200).send(JSON.stringify(bookList, null, 4));
    } else {
      res.status(404).json({ message: "Books by the author not found" });
    }
  });
  

//using Promise callbacks or async-await with Axios  
public_users.get('/author/promise/:author', (req, res) => {
const { author } = req.params;
axios.get(`https://poojamishra4-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`)
    .then(response => {
    res.status(200).json(response.data);
    })
    .catch(error => {
    res.status(500).json({ message: 'Error fetching books by author' });
    });
});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookList = Object.values(books).filter(book => book.title === title);
    
    if (bookList.length > 0) {
      res.status(200).send(JSON.stringify(bookList, null, 4));
    } else {
      res.status(404).json({ message: "Books with the title not found" });
    }
  });
  

//using Promise callbacks or async-await with Axios  
public_users.get('/title/promise/:title', (req, res) => {
const { title } = req.params;
axios.get(`https://poojamishra4-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`)
    .then(response => {
    res.status(200).json(response.data);
    })
    .catch(error => {
    res.status(500).json({ message: 'Error fetching books by title' });
    });
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book && book.reviews) {
    res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({ message: "Reviews not found for the book" });
  }
});

module.exports.general = public_users;
