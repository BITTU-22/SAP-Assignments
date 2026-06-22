const totalBill = 4500;
const numberOfPeople = 4;
const tipPercentage = 15;

const tipAmount = totalBill * (tipPercentage / 100);
const finalTotal = totalBill + tipAmount;
const amountPerPerson = finalTotal / numberOfPeople;

console.log(`Original Bill: ₹${totalBill}`);
console.log(`Tip Amount (${tipPercentage}%): ₹${tipAmount}`);
console.log(`Total with Tip: ₹${finalTotal}`);
console.log(`Amount Per Person: ₹${amountPerPerson}`);