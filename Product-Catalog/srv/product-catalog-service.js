const cds = require('@sap/cds');

module.exports = function () {

  // ═══════════════════════════════════════════════
  //  PRODUCTS — BEFORE CREATE
  // ═══════════════════════════════════════════════
  this.before('CREATE', 'Products', async (req) => {
    const { productName, price, stock, sku, category_ID } = req.data;

    // Required fields
    if (!productName || productName.trim() === '') {
      req.error(400, 'Product name is required', 'productName');
    }
    if (price === undefined || price === null) {
      req.error(400, 'Price is required', 'price');
    }

    // Price range
    if (price !== undefined && price <= 0) {
      req.error(400, 'Price must be greater than zero', 'price');
    }
    if (price !== undefined && price > 99999.99) {
      req.error(400, 'Price cannot exceed 99999.99', 'price');
    }

    // Stock validation
    if (stock !== undefined && stock < 0) {
      req.error(400, 'Stock cannot be negative', 'stock');
    }

    // SKU format: AAA-00000
    if (sku) {
      const skuPattern = /^[A-Z]{3}-\d{5}$/;
      if (!skuPattern.test(sku)) {
        req.error(400, 'SKU must match format: 3 uppercase letters + dash + 5 digits (e.g., PRD-00001)', 'sku');
      }

      // SKU uniqueness
      const existing = await SELECT.one.from('com.catalog.Products').where({ sku });
      if (existing) {
        req.error(409, `SKU "${sku}" already exists`, 'sku');
      }
    }

    // Category must exist and be active
    if (category_ID) {
      const category = await SELECT.one.from('com.catalog.Categories')
        .where({ ID: category_ID });
      if (!category) {
        req.error(404, 'Category not found', 'category_ID');
      } else if (!category.isActive) {
        req.error(400, 'Cannot assign product to an inactive category', 'category_ID');
      }
    }

    // Clean input
    if (productName) req.data.productName = productName.trim();
  });

  // ═══════════════════════════════════════════════
  //  PRODUCTS — BEFORE UPDATE
  // ═══════════════════════════════════════════════
  this.before('UPDATE', 'Products', async (req) => {
    const productId = req.params[0]?.ID || req.params[0];
    const current = await SELECT.one.from('com.catalog.Products').where({ ID: productId });

    if (!current) {
      req.reject(404, 'Product not found');
    }

    // Cannot update discontinued products
    if (current.status === 'Discontinued') {
      req.reject(400, 'Cannot update a discontinued product. Delete it or change its status first.');
    }

    // Price validation
    if (req.data.price !== undefined && req.data.price <= 0) {
      req.error(400, 'Price must be greater than zero', 'price');
    }

    // Stock validation
    if (req.data.stock !== undefined && req.data.stock < 0) {
      req.error(400, 'Stock cannot be negative', 'stock');
    }

    // Clean input
    if (req.data.productName) {
      req.data.productName = req.data.productName.trim();
    }
  });

  // ═══════════════════════════════════════════════
  //  PRODUCTS — BEFORE DELETE
  // ═══════════════════════════════════════════════
  this.before('DELETE', 'Products', async (req) => {
    const productId = req.params[0]?.ID || req.params[0];
    const product = await SELECT.one.from('com.catalog.Products').where({ ID: productId });

    if (product && product.status === 'Active' && product.stock > 0) {
      req.reject(409,
        `Cannot delete active product with ${product.stock} items in stock. ` +
        `Set status to "Discontinued" first or reduce stock to zero.`
      );
    }
  });

  // ═══════════════════════════════════════════════
  //  PRODUCTS — AFTER READ
  // ═══════════════════════════════════════════════
  this.after('READ', 'Products', (results) => {
    const products = Array.isArray(results) ? results : [results];

    for (const product of products) {
      // Needs reorder?
      if (product.stock !== undefined && product.minStock !== undefined) {
        product.needsReorder = product.stock < product.minStock;
      }

      // Price with tax
      if (product.price) {
        product.priceWithTax = +(product.price * 1.18).toFixed(2);
      }
    }
  });

  // ═══════════════════════════════════════════════
  //  CATEGORIES — VALIDATIONS
  // ═══════════════════════════════════════════════
  this.before('CREATE', 'Categories', (req) => {
    if (!req.data.categoryName || req.data.categoryName.trim() === '') {
      req.error(400, 'Category name is required', 'categoryName');
    }
    if (req.data.categoryName) {
      req.data.categoryName = req.data.categoryName.trim();
    }
  });

  this.before('DELETE', 'Categories', async (req) => {
    const catId = req.params[0]?.ID || req.params[0];
    const products = await SELECT.from('com.catalog.Products')
      .where({ category_ID: catId });

    if (products.length > 0) {
      req.reject(409,
        `Cannot delete category: ${products.length} product(s) belong to it. Reassign or delete them first.`
      );
    }
  });
  this.after('READ', 'Products', (results) => {
    if (!results) return;
    
    // Ensure results is always treated as an array so it never crashes
    const products = Array.isArray(results) ? results : [results];

    for (const p of products) {
      if (p.stock === 0) {
        p.stockCriticality = 1; // Red / Error
      } else if (p.stock < 10) {
        p.stockCriticality = 2; // Orange/Yellow / Warning
      } else {
        p.stockCriticality = 3; // Green / Success
      }
    }
  });

};
