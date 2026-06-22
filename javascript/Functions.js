// let getEvens = arr => arr.filter(n => n % 2 === 0);
// console.log(getEvens([1, 2, 3, 4, 5, 6])); 

// const makeUser  = (name, age) => ({name, age});
// const user1 = makeUser("Rahul", 25);
// console.log(user1); // Output: { name: 'Rahul', age: 25 }


//=====================================================================================
// convert to arrow function

// const square = n => n ** 2;
// console.log(square(15));

// 2.isEven
// const isEven = n => n % 2 === 0;
// console.log(isEven(6)); 


//Fullname
//const fullName = (first, last) => `${first} ${last}`;
//console.log(fullName("Bhanu", "Kumar"));

//find max 
// const findMax = arr => Math.max(...arr);
// console.log(findMax([100,100,40,3000,5000]));

//data
// const createPO = (vendor, amount) => ({
//   id: `PO-${Date.now()}`,
//   vendor,
//   amount,
//   status: "Draft"
// });
// const po1 = createPO("GlassDoor", 5000);
// console.log(po1);

//Closure Question
function outerFunction() {
    let count = 0;
    function innerFunction() {
        count++;
        console.log(count);
    }
    return innerFunction;
}
const counter = outerFunction();
counter();
counter();
counter();
counter();