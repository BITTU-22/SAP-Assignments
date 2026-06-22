const testNumbers = [17, 42, 0, -5];
for (let i = 0; i < testNumbers.length; i++) {
  let num = testNumbers[i];
    if (num % 2 === 0) {
    console.log(`${num} is even`);
  } else {
    console.log(`${num} is odd`);
  }
}