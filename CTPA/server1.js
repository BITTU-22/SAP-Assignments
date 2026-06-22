const express = require('express');
const app = express();
app.use(express.json());

// In-memory database (array of books):
let books = [
  { id: 1, title: "Clean Code", author: "Robert Martin", price: 450, year: 2008 },
  { id: 2, title: "The Pragmatic Programmer", author: "David Thomas", price: 550, year: 1999 },
  { id: 3, title: "Node.js in Action", author: "Mike Cantelon", price: 600, year: 2017 }
];
let nextId = 4;

// GET /books — Get all books
app.get('/books', (req, res) => {
  res.json({
    count: books.length,
    data: books
  });
});

// GET /books/:id — Get one book
app.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  
  if (!book) {
    return res.status(404).json({ error: `Book with ID ${id} not found` });
  }
  res.json(book);
});

// POST /books — Create a new book
app.post('/books', (req, res) => {
  const { title, author, price, year } = req.body;
  
  // Validation:
  if (!title || !author) {
    return res.status(400).json({ error: "Title and author are required" });
  }
  
  const newBook = {
    id: nextId++,
    title,
    author,
    price: price || 0,
    year: year || new Date().getFullYear()
  };
  
  books.push(newBook);
  res.status(201).json({ message: "Book created!", data: newBook });
});

// PUT /books/:id — Update a book (full replace)
app.put('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: `Book with ID ${id} not found` });
  }
  
  const { title, author, price, year } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: "Title and author are required" });
  }
  
  books[index] = { id, title, author, price: price || 0, year: year || 0 };
  res.json({ message: "Book updated!", data: books[index] });
});

// DELETE /books/:id — Delete a book
app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: `Book with ID ${id} not found` });
  }
  
  const deleted = books.splice(index, 1)[0];
  res.json({ message: "Book deleted!", data: deleted });
});

app.listen(4000, () => console.log("📚 Book API on http://localhost:4000"));