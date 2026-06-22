using { com.epm as my } from '../db/schema';

// 1. Admin Service - Full access to everything
service AdminService {
    entity Suppliers as projection on my.Suppliers;
    entity Categories as projection on my.Categories;
    entity Products as projection on my.Products;
    entity Customers as projection on my.Customers;
    entity SalesOrders as projection on my.SalesOrders;
    entity SalesOrderItems as projection on my.SalesOrderItems;
    entity PurchaseOrders as projection on my.PurchaseOrders;
    entity PurchaseOrderItems as projection on my.PurchaseOrderItems;
}