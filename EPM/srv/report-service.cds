using { com.epm as my } from '../db/schema';

service Reportservice {
    @readonly entity ProductCatalog as projection on my.ProductCatalog;
    @readonly entity OrderReport as projection on my.OrderReport;
    @readonly entity LowStockAlert as projection on my.LowStockAlert;
}

