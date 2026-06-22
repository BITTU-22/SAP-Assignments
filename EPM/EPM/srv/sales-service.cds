using { com.epm as my } from '../db/schema';

service SalesService @(path: '/sales') {

  entity SalesOrders as projection on my.SalesOrders
    actions {
      action confirm() returns { status: String; message: String; };
      action cancel(reason: String(500)) returns { status: String; message: String; };
      action ship(trackingNumber: String(50), carrier: String(50)) returns { status: String; };
    };

  entity Customers as projection on my.Customers;
}