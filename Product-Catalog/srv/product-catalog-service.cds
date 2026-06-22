using { com.catalog as db } from '../db/product-catalog';

service ProductCatalogService @(path : '/products') {
    entity Products as select from db.Products {
        *,
        case 
            when stock < 10 then 1  // Red / Danger
            when stock < 20 then 2  // Yellow / Warning
            else 3                  // Green / Safe
        end as stockCriticality : Integer
    };
    entity Categories as projection on db.Categories;
}