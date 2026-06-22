namespace com.catalog;
using { cuid, managed, Currency } from '@sap/cds/common';

type ProductStatus : String(20) enum {
  Draft; Active; Discontinued;
}

entity Products : cuid, managed {
  productName   : String(100);
  description   : String(500);
  price         : Decimal(10,2);
  currency      : Currency;
  stock         : Integer default 0;
  minStock      : Integer default 10;
  rating        : Decimal(2,1) default 0.0;
  status        : ProductStatus default 'Draft';
  sku           : String(20);
  weight        : Decimal(6,2);
  category      : Association to Categories;
  stockCriticality  : Integer @Core.Computed;

}

entity Categories : cuid, managed {
  categoryName  : String(100);
  description   : String(300);
  isActive      : Boolean default true;
  products      : Association to many Products on products.category = $self;
}


   
