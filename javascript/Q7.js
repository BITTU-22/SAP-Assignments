const text = "JavaScript is the language of the web";
const totalChars = text.length;
const wordsArray = text.split(" ");
const totalWords = wordsArray.length;
const countA = text.split('a').length - 1;
const firstWord = wordsArray[0];
const lastWord = wordsArray[wordsArray.length - 1];

console.log(`Total characters: ${totalChars}`);
console.log(`Total words: ${totalWords}`);
console.log(`Number of 'a' characters: ${countA}`);
console.log(`First word: ${firstWord}`);
console.log(`Last word: ${lastWord}`);