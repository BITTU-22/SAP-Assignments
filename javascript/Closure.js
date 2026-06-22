const orders = [
  { id: "ORD-001", customer: "Acme Corp", amount: 15000, status: "pending" },
  { id: "ORD-002", customer: "Beta Inc", amount: 8000, status: "approved" },
  { id: "ORD-003", customer: "Gamma Ltd", amount: 52000, status: "pending" },
  { id: "ORD-004", customer: "Delta Co", amount: 3000, status: "rejected" },
  { id: "ORD-005", customer: "Epsilon SA", amount: 95000, status: "pending" }
];

// TASK 1:
// Function that:
// 1. Filters data
// 2. Transforms data
// 3. Sends final result to summary function

const processOrders = (orderList, filterFn, transformFn, summaryFn) => { 
  const filteredOrders = orderList.filter(filterFn); //1.filters the orders 
  const transformedOrders = filteredOrders.map(transformFn); //2.transforms the orders
  summaryFn(transformedOrders); //

};
