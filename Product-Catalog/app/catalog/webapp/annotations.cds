using ProductCatalogService from '../../../srv/product-catalog-service';

// ═══════════════════════════════════════════════════
// PRODUCTS — Full Annotation Set
// ══════════════════════════════════════════════════

annotate ProductCatalogService.Products with @UI: {

  // ─── LIST REPORT: Filter Bar ───────────────────
  SelectionFields: [
    productName,
    price,
    stock,
    category_ID,
    supplier_ID,
    isAvailable
  ],

  // ─── LIST REPORT: Table Columns ────────────────
  LineItem: [
    { Value: productName, Label: 'Product', ![@UI.Importance]: #High },
    { Value: price, Label: 'Price' },
    { Value: stock, Label: 'Stock', Criticality: stockCriticality },
    { Value: rating, Label: 'Rating' },
    { Value: supplier.supplierName, Label: 'Supplier' },
    { Value: category.categoryName, Label: 'Category', ![@UI.Importance]: #Low },
    { Value: isAvailable, Label: 'Available' }
  ],

  // ─── OBJECT PAGE: Header ───────────────────────
  HeaderInfo: {
    TypeName: 'Product',
    TypeNamePlural: 'Products',
    Title: { Value: productName },
    Description: { Value: description }
  },

  // ─── OBJECT PAGE: Header KPIs ─────────────────
  HeaderFacets: [
    { $Type: 'UI.ReferenceFacet', Target: '@UI.DataPoint#Price' },
    { $Type: 'UI.ReferenceFacet', Target: '@UI.DataPoint#Stock' },
    { $Type: 'UI.ReferenceFacet', Target: '@UI.DataPoint#Rating' }
  ],
  DataPoint#Price: {
    Value: price,
    Title: 'Price'
  },
  DataPoint#Stock: {
    Value: stock,
    Title: 'In Stock',
    Criticality: stockCriticality
  },
  DataPoint#Rating: {
    Value: rating,
    Title: 'Rating',
    TargetValue: 5,
    Visualization: #Rating
  },

  // ─── OBJECT PAGE: Sections ────────────────────
  Facets: [
    {
      $Type: 'UI.ReferenceFacet',
      Target: '@UI.FieldGroup#GeneralInfo',
      Label: 'General Information'
    },
    {
      $Type: 'UI.ReferenceFacet',
      Target: '@UI.FieldGroup#StockPricing',
      Label: 'Stock & Pricing'
    },
    {
      $Type: 'UI.ReferenceFacet',
      Target: '@UI.FieldGroup#Admin',
      Label: 'Administration'
    }
  ],

  // ─── FIELD GROUPS (Section Content) ────────────
  FieldGroup#GeneralInfo: {
    Data: [
      { Value: productName, Label: 'Product Name' },
      { Value: description, Label: 'Description' },
      { Value: category.categoryName, Label: 'Category' },
      { Value: supplier.supplierName, Label: 'Supplier' }
    ]
  },
  FieldGroup#StockPricing: {
    Data: [
      { Value: price, Label: 'Price' },
      { Value: stock, Label: 'Current Stock' },
      { Value: minStock, Label: 'Minimum Stock Level' },
      { Value: rating, Label: 'Customer Rating' },
      { Value: isAvailable, Label: 'Available for Sale' }
    ]
  },
  FieldGroup#Admin: {
    Data: [
      { Value: createdAt, Label: 'Created On' },
      { Value: createdBy, Label: 'Created By' },
      { Value: modifiedAt, Label: 'Last Modified' },
      { Value: modifiedBy, Label: 'Modified By' }
    ]
  }
};
annotate ProductCatalogService.Products with {
  category @(Common.ValueList : {
    Label          : 'Categories',
    CollectionPath : 'Categories',
    Parameters     : [
      {
        $Type             : 'Common.ValueListParameterInOut',
        LocalDataProperty : category_ID,
        ValueListProperty : 'ID'
      },
      {
        $Type             : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty : 'categoryName'
      }
    ]
  });
}