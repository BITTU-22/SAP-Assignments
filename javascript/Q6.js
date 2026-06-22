const birthYear = 2001;
const currentYear = 2026;
const age = currentYear - birthYear;
const canVote = age >= 18;
const canDrive = age >= 18;
const canDrink = age >= 21;

console.log(`Current Age: ${age}`);
console.log(`Can Vote (>=18): ${canVote}`);
console.log(`Can Drive (>=18): ${canDrive}`);
console.log(`Can Drink (>=21): ${canDrink}`);