const fs = require('fs').promises;  // Use promises version!

// Read a file:
const content = await fs.readFile('data.txt', 'utf8');

// Write a file:
await fs.writeFile('output.txt', 'Hello World!');

// Append to a file:
await fs.appendFile('log.txt', 'New log entry\n');

// Check if file exists:
try {
  await fs.access('config.json');
  console.log("File exists!");
} catch {
  console.log("File not found");
}

// Delete a file:
await fs.unlink('temp.txt');

// Create a directory:
await fs.mkdir('new-folder', { recursive: true });

// List files in directory:
const files = await fs.readdir('.');
console.log(files);