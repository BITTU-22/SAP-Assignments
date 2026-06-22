namespace com.epm;

using { cuid, managed, Currency, Country } from '@sap/cds/common';

type OrderStatus : String enum {
    New = 'N';
    InProcess = 'P';
    Completed = 'C';
    Cancelled = 'X';
};

entity Suppliers : cuid {
    name       : String(100);
    contact    : String(100);
    email      : String(100);
    phone      : String(20);
    city       : String(100);
    country    : Country;
    isActive   : Boolean default true;
    products   : Association to many Products on products.supplier = $self;
}

entity Categories : cuid {
    name           : String(50);
    description    : String(250);
    parentCategory : Association to Categories;
}

entity Products : cuid, managed {
    name        : String(100);
    description : String(250);
    price       : Decimal(9,2);
    currency    : Currency;
    stock       : Integer;
    minStock    : Integer;
    expiryDate   : Date;
    rating      : Decimal(3,2);
    supplier    : Association to Suppliers;
    category    : Association to Categories;
}

entity Customers : cuid, managed {
    name        : String(100);
    email       : String(100);
    phone       : String(20);
    city        : String(100);
    country     : Country;
    creditLimit : Decimal(15,2);
}

entity SalesOrders : cuid, managed {
    orderNumber : String(20);
    customer    : Association to Customers;
    orderDate   : Date;
    netAmount   : Decimal(15,2);
    currency    : Currency;
    status      : OrderStatus default 'N';
    items       : Composition of many SalesOrderItems on items.order = $self;
}

entity SalesOrderItems : cuid {
    order     : Association to SalesOrders;
    product   : Association to Products;
    quantity  : Integer;
    unitPrice : Decimal(9,2);
    netAmount : Decimal(15,2);
}

entity PurchaseOrders : cuid, managed {
    poNumber     : String(20);
    supplier     : Association to Suppliers; // CAP auto-generates supplier_ID behind the scenes
    orderDate    : Date;
    netAmount    : Decimal(15,2);
    currency     : Currency;
    status       : OrderStatus default 'N';
    priority     : String(10);
    items        : Composition of many PurchaseOrderItems on items.order = $self;
    expectedDate : Date;
    totalAmount  : Decimal(15,2);
    taxAmount    : Decimal(15,2);
}

entity PurchaseOrderItems : cuid {
    order      : Association to PurchaseOrders;
    product    : Association to Products; // CAP auto-generates product_ID behind the scenes
    quantity   : Integer;
    unitPrice  : Decimal(9,2);
    totalPrice : Decimal(15,2);
}

view ProductCatalog as 
    select from Products {
        ID,
        name as productName,
        price,
        currency.code as currencyCode,
        supplier.name as supplierName,
        category.name as categoryName,
        case 
            when stock = 0 then 'Out of Stock'
            when stock <= minStock then 'Low Stock'
            else 'In Stock'
        end as stockStatus : String(20)
    };

view OrderReport as 
    select from SalesOrders {
        ID,
        orderNumber,
        customer.name as customerName,
        netAmount,
        currency.code as currencyCode,
        orderDate,
        status
    };

view LowStockAlert as 
    select from Products {
        ID,
        name as productName,
        stock,
        minStock,
        supplier.name as supplierName,
        supplier.contact as supplierContact,
        supplier.email as supplierEmail,
        supplier.phone as supplierPhone
    } where stock <= minStock;