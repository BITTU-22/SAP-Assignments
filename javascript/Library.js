// // ============================================
// //  MINI LIBRARY MANAGEMENT SYSTEM
// //  Using Classes, Error Handling, and Closures
// // ============================================

// class Book {
//   constructor(title, author, isbn, copies = 1) {
//     if (!title || !author || !isbn) {
//       throw new Error("Title, author, and ISBN are required");
//     }
//     this.title = title;
//     this.author = author;
//     this.isbn = isbn;
//     this.totalCopies = copies;
//     this.availableCopies = copies;
//     this.borrowHistory = [];
//   }
  
//   getInfo() {
//     return `"${this.title}" by ${this.author} [${this.isbn}] — ${this.availableCopies}/${this.totalCopies} available`;
//   }
// }

// class Member {
//   constructor(name, memberId) {
//     this.name = name;
//     this.memberId = memberId;
//     this.borrowedBooks = [];
//     this.borrowLimit = 3;
//   }
  
//   canBorrow() {
//     return this.borrowedBooks.length < this.borrowLimit;
//   }
// }

// class Library {
//   constructor(name) {
//     this.name = name;
//     this.books = [];
//     this.members = [];
//     this.transactions = [];
//   }
  
//   // Add a book to the library
//   addBook(title, author, isbn, copies) {
//     const existing = this.books.find(b => b.isbn === isbn);
//     if (existing) {
//       existing.totalCopies += copies;
//       existing.availableCopies += copies;
//       return `Updated: "${title}" now has ${existing.totalCopies} copies`;
//     }
//     const book = new Book(title, author, isbn, copies);
//     this.books.push(book);
//     return `Added: "${title}" (${copies} copies)`;
//   }
  
//   // Register a new member
//   addMember(name) {
//     const id = `MEM-${String(this.members.length + 1).padStart(3, "0")}`;
//     const member = new Member(name, id);
//     this.members.push(member);
//     return `Welcome, ${name}! Your ID: ${id}`;
//   }
  
//   // Borrow a book
//   borrowBook(memberId, isbn) {
//     const member = this.members.find(m => m.memberId === memberId);
//     if (!member) throw new Error(`Member ${memberId} not found`);
    
//     const book = this.books.find(b => b.isbn === isbn);
//     if (!book) throw new Error(`Book with ISBN ${isbn} not found`);
    
//     if (!member.canBorrow()) {
//       throw new Error(`${member.name} has reached the borrow limit (${member.borrowLimit} books)`);
//     }
    
//     if (book.availableCopies <= 0) {
//       throw new Error(`"${book.title}" is not available. All copies are borrowed.`);
//     }
    
//     // Process borrow:
//     book.availableCopies--;
//     member.borrowedBooks.push(isbn);
//     book.borrowHistory.push({ memberId, date: new Date().toISOString(), action: "borrow" });
    
//     this.transactions.push({
//       type: "BORROW",
//       memberId,
//       isbn,
//       date: new Date().toISOString()
//     });
    
//     return `✅ ${member.name} borrowed "${book.title}" (${book.availableCopies} copies remaining)`;
//   }
  
//   // Return a book
//   returnBook(memberId, isbn) {
//     const member = this.members.find(m => m.memberId === memberId);
//     if (!member) throw new Error(`Member ${memberId} not found`);
    
//     const book = this.books.find(b => b.isbn === isbn);
//     if (!book) throw new Error(`Book with ISBN ${isbn} not found`);
    
//     const borrowIndex = member.borrowedBooks.indexOf(isbn);
//     if (borrowIndex === -1) {
//       throw new Error(`${member.name} hasn't borrowed "${book.title}"`);
//     }
    
//     // Process return:
//     book.availableCopies++;
//     member.borrowedBooks.splice(borrowIndex, 1);
//     book.borrowHistory.push({ memberId, date: new Date().toISOString(), action: "return" });
    
//     this.transactions.push({
//       type: "RETURN",
//       memberId,
//       isbn,
//       date: new Date().toISOString()
//     });
    
//     return `✅ ${member.name} returned "${book.title}" (${book.availableCopies} copies available)`;
//   }
  
//   // Search books
//   searchBooks(query) {
//     const q = query.toLowerCase();
//     return this.books.filter(b => 
//       b.title.toLowerCase().includes(q) || 
//       b.author.toLowerCase().includes(q)
//     );
//   }
  
//   // Get library stats
//   getStats() {
//     return {
//       totalBooks: this.books.length,
//       totalCopies: this.books.reduce((sum, b) => sum + b.totalCopies, 0),
//       availableCopies: this.books.reduce((sum, b) => sum + b.availableCopies, 0),
//       totalMembers: this.members.length,
//       totalTransactions: this.transactions.length
//     };
//   }
  
//   // Display all books
//   displayBooks() {
//     console.log(`\n📚 ${this.name} — Book Catalog:`);
//     console.log("─".repeat(70));
//     this.books.forEach(book => console.log(`  ${book.getInfo()}`));
//     console.log("─".repeat(70));
//   }
// }

// // ========== TEST THE LIBRARY ==========

// const lib = new Library("SAP Academy Library");

// // Add books:
// console.log(lib.addBook("Clean Code", "Robert Martin", "978-0132350884", 3));
// console.log(lib.addBook("JavaScript: The Good Parts", "Douglas Crockford", "978-0596517748", 2));
// console.log(lib.addBook("Design Patterns", "Gang of Four", "978-0201633610", 1));
// console.log(lib.addBook("Node.js in Action", "Mike Cantelon", "978-1617290572", 4));

// // Add members:
// console.log(lib.addMember("Priya Sharma"));
// console.log(lib.addMember("Rahul Kumar"));

// // Display catalog:
// lib.displayBooks();

// // Borrow books:
// try {
//   console.log(lib.borrowBook("MEM-001", "978-0132350884"));
//   console.log(lib.borrowBook("MEM-001", "978-0596517748"));
//   console.log(lib.borrowBook("MEM-002", "978-0132350884"));
  
//   // Try borrowing unavailable book:
//   // console.log(lib.borrowBook("MEM-002", "978-0201633610"));
//   // console.log(lib.borrowBook("MEM-002", "978-0201633610"));  // Would fail!
// } catch (error) {
//   console.log(`❌ Error: ${error.message}`);
// }

// // Return a book:
// console.log(lib.returnBook("MEM-001", "978-0132350884"));

// // Search:
// console.log("\n🔍 Search results for 'java':");
// lib.searchBooks("java").forEach(b => console.log(`  ${b.getInfo()}`));

// // Stats:
// console.log("\n📊 Library Stats:", lib.getStats());

console.log("1"); 
setTimeout(() => console.log("2"), 1000); 
setTimeout(() => console.log("3"), 0); 
console.log("4"); 
