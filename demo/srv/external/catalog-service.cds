using { northwind as external } from './northwind.csn';

service CatalogService {

    @readonly
    entity Products as projection on external.Products {
     key ID, Name, Description, ReleaseDate, DiscontinuedDate, Rating, Price
    };
}