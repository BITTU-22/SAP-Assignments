using ProductCatalogService as service from '../../srv/product-catalog-service';
using from '@sap/cds/common';

annotate service.Products with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : stockCriticality,
            Label : 'stockCriticality',
        },
        {
            $Type : 'UI.DataField',
            Value : stock,
            Label : 'stock',
        },
        {
            $Type : 'UI.DataField',
            Value : category.products.category_ID,
            Label : 'category_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : category.products.category.products.minStock,
            Label : 'minStock',
        },
        {
            $Type : 'UI.DataField',
            Value : category.products.category.products.status,
            Label : 'status',
        },
        {
            $Type : 'UI.DataField',
            Value : category.products.category.products.stockCriticality,
            Label : 'stockCriticality',
        },
        {
            $Type : 'UI.DataField',
            Value : category.products.category.products.category_ID,
            Label : 'category_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : category.products.category.products.ID,
            Label : 'ID',
        },
        {
            $Type : 'UI.DataField',
            Value : category.products.category.products.price,
            Label : 'price',
        },
        {
            $Type : 'UI.DataField',
            Value : category.products.category.products.productName,
            Label : 'productName',
        },
        {
            $Type : 'UI.DataField',
            Value : category.products.category.products.rating,
            Label : 'rating',
        },
        {
            $Type : 'UI.DataField',
            Value : category.products.category.products.stock,
            Label : 'stock',
        },
    ]
);
