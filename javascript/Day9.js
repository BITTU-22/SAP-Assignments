// // console.log("Start");

// // setTimeout(() => {
// //   console.log("Timeout 1");
// // }, 0);

// // Promise.resolve().then(() => {
// //   console.log("Promise 1");
// // });

// // process.nextTick(() => {
// //   console.log("Next Tick");
// // });
// // console.log("End");


// //Question ) What is the output order?





// // for (var i = 1; i <= 3; i++) {
// //   setTimeout(() => {
// //     console.log(i);
// //   }, i * 100);
// // } 




// // for (let i = 1; i <= 3; i++) {
// //   setTimeout(() => {
// //     console.log(i);
// //   }, i * 100);
// // }





// // Promise.resolve(1)
// //   .then((x) => {
// //     console.log(x);
// //     return x + 1;
// //   })
// //   .then((x) => {
// //     throw new Error("Failed");
// //   })
// //   .catch((err) => {
// //     console.log(err.message);
// //     return 100;
// //   })
// //   .then((x) => {
// //     console.log(x);
// //   });






// // const wait = (ms, value) =>
// //   new Promise((resolve) =>
// //     setTimeout(() => resolve(value), ms)
// //   );

// // async function run() {
// //   console.time("time");

// //   const a = await wait(1000, "A");
// //   const b = await wait(1000, "B");

// //   console.log(a, b);

// //   console.timeEnd("time");
// // }

// // run();







// // async function run() {
// //   console.time("time");

// //   const [a, b] = await Promise.all([
// //     wait(1000, "A"),
// //     wait(1000, "B")
// //   ]);

// //   console.log(a, b);

// //   console.timeEnd("time");
// // }







// // async function test() {
// //   return Promise.resolve("Hello");
// // }

// // console.log(test());








// // const p = new Promise((resolve, reject) => {
// //   resolve("First");
// //   resolve("Second");
// //   reject("Error");
// // });

// // p.then(console.log).catch(console.log);






// // async function test() {
// //   try {
// //     Promise.reject("Failed");
// //   } catch (e) {
// //     console.log("Caught");
// //   }
// // }

// // test();

// // //Question) Will "Caught" print?





// // let balance = 100;

// // async function deduct(amount) {
// //   const current = balance;

// //   await new Promise((r) => setTimeout(r, 100));

// //   balance = current - amount;
// // }

// // async function run() {
// //   await Promise.all([
// //     deduct(30),
// //     deduct(50)
// //   ]);

// //   console.log(balance);
// // }

// // run();

// // //Question ) What can the final balance be?




// // setTimeout(() => console.log("timeout"));
// // setImmediate(() => console.log("immediate"));
// // Promise.resolve().then(() => console.log("promise"));
// // process.nextTick(() => console.log("nextTick"));

// // //Question) Predict the exact order.








// // const fetchUserData = async (userId) => {
// //   try {
// //     // Simulate API call:
// //     const user = await new Promise(resolve => 
// //       setTimeout(() => resolve({ id: userId, name: "Priya", role: "Developer" }), 500)
// //     );
    
// //     const orders = await new Promise(resolve => 
// //       setTimeout(() => resolve([
// //         { id: "PO-001", amount: 5000 },
// //         { id: "PO-002", amount: 12000 }
// //       ]), 700)
// //     );
    
// //     return {
// //       ...user,
// //       orders,
// //       totalOrders: orders.length,
// //       totalAmount: orders.reduce((sum, o) => sum + o.amount, 0)
// //     };
    
// //   } catch (error) {
// //     console.log("Failed to load user data:", error.message);
// //     return null;
// //   }
// // };

// // // Usage:
// // const main = async () => {
// //   const userData = await fetchUserData("USER-001");
// //   console.log("User Data:", JSON.stringify(userData, null, 2));
// // };
// // main();

// const processAllOrders = async (orderIds) => {
//   const results = [];
  
//   for (const id of orderIds) {
//     try {
//       console.log(`Processing ${id}...`);
//       const result = await processOrder(id);
//       results.push({ id, status: "success", data: result });
//     } catch (error) {
//       results.push({ id, status: "failed", error: error.message });
//     }
//   }
  
//   return results;
// };

// // Process one by one (sequential):
// processAllOrders(["PO-001", "PO-002", "PO-003"])
//   .then(results => console.log("All done:", results));

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Waited ${ms}ms`);
    }, ms);
  });
};

delay(1000).then((message) => console.log(message));

const fetchProduct = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id.startsWith("PRD")) {
        resolve({
          id,
          name: "Laptop",
          price: 55000
        });
      } else {
        reject("Invalid product ID");
      }
    }, 500);
  });
};

fetchProduct("PRD-001")
  .then((product) => console.log(product))
  .catch((error) => console.log(error));

fetchProduct("INVALID")
  .then((product) => console.log(product))
  .catch((error) => console.log(error));

const retryFetch = (url, maxRetries = 3) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const fetchData = () => {
      attempts++;

      console.log(`Attempt ${attempts} for ${url}`);

      setTimeout(() => {
        const success = Math.random() > 0.7;

        if (success) {
          resolve({
            url,
            message: "Data fetched successfully",
            attempts
          });
        } else {
          console.log("Fetch failed");

          if (attempts < maxRetries) {
            fetchData();
          } else {
            reject("All retries failed");
          }
        }
      }, 500);
    };

    fetchData();
  });
};

retryFetch("https://api.example.com/data", 5)
  .then((data) => console.log(data))
  .catch((error) => console.log(error));

Promise.all([
  delay(2000),
  fetchProduct("PRD-101"),
  retryFetch("https://api.example.com/users", 4)
])
  .then((results) => {
    console.log("\n=== Promise.all Results ===");

    console.log(results[0]);

    console.log("Product:", results[1]);

    console.log("Fetched Data:", results[2]);
  })
  .catch((error) => {
    console.log("\nPromise.all Error:");
    console.log(error);
  });