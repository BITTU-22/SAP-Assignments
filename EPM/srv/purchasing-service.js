const cds = require('@sap/cds');

module.exports = function () {

  // ═══════════════════════════════════════════════
  //  SUBMIT Purchase Order
  // ═══════════════════════════════════════════════
  this.on('submit', 'PurchaseOrders', async (req) => {
    const { ID } = req.params[0];
    const { PurchaseOrders, PurchaseOrderItems, Suppliers } = cds.entities;
    
    console.log(`[SUBMIT] Initiating PO submission for ID: ${ID} by User: ${req.user.id}`);

    // Fetch the PO
    const po = await SELECT.one.from(PurchaseOrders).where({ ID });
    if (!po) {
      console.warn(`[SUBMIT] PO not found for ID: ${ID}`);
      req.reject(404, 'Purchase Order not found');
    }

    // Rule: Only Draft POs can be submitted
    if (po.status !== 'Draft') {
      console.warn(`[SUBMIT] PO ${po.poNumber} rejection: Status is "${po.status}", expected "Draft"`);
      req.reject(400,
        `Cannot submit: PO is in "${po.status}" status. Only Draft POs can be submitted.`
      );
    }

    // FIX 1: Changed "purchaseOrder_ID" to "order_ID" to match schema.cds
    const items = await SELECT.from(PurchaseOrderItems).where({ order_ID: ID });
    if (items.length === 0) {
      console.warn(`[SUBMIT] PO ${po.poNumber} rejection: No items found`);
      req.reject(400, 'Cannot submit: PO has no items. Add at least one item first.');
    }

    // Rule: Total amount must be calculated
    const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const calculatedTotal = +total.toFixed(2);
    console.log(`[SUBMIT] PO ${po.poNumber} validated. Calculated total: $${calculatedTotal} across ${items.length} item(s)`);

    // Update status
    await UPDATE(PurchaseOrders).set({
      status: 'Submitted',
      totalAmount: calculatedTotal
    }).where({ ID });
    console.log(`[SUBMIT] PO ${po.poNumber} successfully updated to 'Submitted' state in DB`);

    // Get supplier name for event
    const supplier = await SELECT.one.from(Suppliers).where({ ID: po.supplier_ID });

    // Emit event
    await this.emit('POSubmitted', {
      poId: ID,
      poNumber: po.poNumber,
      supplierName: supplier?.supplierName || 'Unknown',
      totalAmount: calculatedTotal,
      submittedBy: req.user.id
    });

    const resPayload = {
      status: 'Submitted',
      message: `PO ${po.poNumber} submitted for approval. Total: $${calculatedTotal} (${items.length} items)`
    };
    console.log(`[SUBMIT] Returning payload:`, resPayload);
    return resPayload;
  });

  // ═══════════════════════════════════════════════
  //  APPROVE Purchase Order
  // ═══════════════════════════════════════════════
  this.on('approve', 'PurchaseOrders', async (req) => {
    const { ID } = req.params[0];
    const { comment } = req.data;
    const { PurchaseOrders } = cds.entities;

    console.log(`[APPROVE] Initiating approval for PO ID: ${ID} by User: ${req.user.id}`);

    const po = await SELECT.one.from(PurchaseOrders).where({ ID });
    if (!po) {
      console.warn(`[APPROVE] PO not found for ID: ${ID}`);
      req.reject(404, 'Purchase Order not found');
    }

    if (po.status !== 'Submitted') {
      console.warn(`[APPROVE] PO ${po.poNumber} rejection: Status is "${po.status}", expected "Submitted"`);
      req.reject(400,
        `Cannot approve: PO is in "${po.status}" status. Only Submitted POs can be approved.`
      );
    }

    await UPDATE(PurchaseOrders).set({
      status: 'Approved'
    }).where({ ID });
    console.log(`[APPROVE] PO ${po.poNumber} status updated to 'Approved' in DB`);

    // Emit event
    await this.emit('POApproved', {
      poId: ID,
      poNumber: po.poNumber,
      approvedBy: req.user.id,
      comment: comment || ''
    });

    const resPayload = {
      status: 'Approved',
      message: `PO ${po.poNumber} has been approved.${comment ? ' Comment: ' + comment : ''}`,
      approvedAt: new Date().toISOString()
    };
    console.log(`[APPROVE] Returning payload:`, resPayload);
    return resPayload;
  });

  // ═══════════════════════════════════════════════
  //  REJECT Purchase Order
  // ═══════════════════════════════════════════════
  this.on('reject', 'PurchaseOrders', async (req) => {
    const { ID } = req.params[0];
    const { reason } = req.data;
    const { PurchaseOrders } = cds.entities;

    console.log(`[REJECT] Initiating rejection for PO ID: ${ID} by User: ${req.user.id}`);

    const po = await SELECT.one.from(PurchaseOrders).where({ ID });
    if (!po) {
      console.warn(`[REJECT] PO not found for ID: ${ID}`);
      req.reject(404, 'Purchase Order not found');
    }

    if (po.status !== 'Submitted') {
      console.warn(`[REJECT] PO ${po.poNumber} rejection: Status is "${po.status}", expected "Submitted"`);
      req.reject(400, `Cannot reject: PO is in "${po.status}" status. Only Submitted POs can be rejected.`);
    }

    if (!reason || reason.trim() === '') {
      console.warn(`[REJECT] PO ${po.poNumber} rejection missing a mandatory rejection reason`);
      req.reject(400, 'Rejection reason is required. Please explain why this PO is being rejected.');
    }

    await UPDATE(PurchaseOrders).set({
      status: 'Rejected'
    }).where({ ID });
    console.log(`[REJECT] PO ${po.poNumber} status updated to 'Rejected' in DB. Reason: ${reason}`);

    // Emit event
    await this.emit('POrejected', {
      poId: ID,
      poNumber: po.poNumber,
      rejectedBy: req.user.id,
      reason: reason
    });

    const resPayload = {
      status: 'Rejected',
      message: `PO ${po.poNumber} rejected. Reason: ${reason}`
    };
    console.log(`[REJECT] Returning payload:`, resPayload);
    return resPayload;
  });

  // ═══════════════════════════════════════════════
  //  RECEIVE Purchase Order (goods arrived)
  // ═══════════════════════════════════════════════
  this.on('receive', 'PurchaseOrders', async (req) => {
    const { ID } = req.params[0];
    const { notes } = req.data;
    const { PurchaseOrders, PurchaseOrderItems, Products } = cds.entities;

    console.log(`[RECEIVE] Initiating Goods Receipt for PO ID: ${ID}`);

    const po = await SELECT.one.from(PurchaseOrders).where({ ID });
    if (!po) {
      console.warn(`[RECEIVE] PO not found for ID: ${ID}`);
      req.reject(404, 'Purchase Order not found');
    }

    if (po.status !== 'Approved') {
      console.warn(`[RECEIVE] PO ${po.poNumber} receipt failed: Status is "${po.status}", expected "Approved"`);
      req.reject(400, `Cannot receive: PO must be "Approved". Current status: "${po.status}"`);
    }

    // Update PO status
    await UPDATE(PurchaseOrders).set({
      status: 'Received'
    }).where({ ID });
    console.log(`[RECEIVE] PO ${po.poNumber} status updated to 'Received' in DB`);

    // FIX 2: Changed "purchaseOrder_ID" to "order_ID" to match schema.cds
    const items = await SELECT.from(PurchaseOrderItems).where({ order_ID: ID });
    console.log(`[RECEIVE] Adjusting inventory stock for ${items.length} line items...`);

    for (const item of items) {
      // FIX 2b: Changed "item.product_ID" to "item.product_id" (CAP standardizes lowercase names from schema)
      const product = await SELECT.one.from(Products).where({ ID: item.product_id });
      if (product) {
        const oldStock = product.stock;
        const newStock = product.stock + item.quantity;
        await UPDATE(Products).set({ stock: newStock }).where({ ID: item.product_id });
        console.log(`[RECEIVE] Product ID ${item.product_id}: Stock increased from ${oldStock} to ${newStock} (+${item.quantity})`);
      } else {
        console.error(`[RECEIVE] Inventory Error: Product ID ${item.product_id} not found in database!`);
      }
    }

    const resPayload = {
      status: 'Received',
      message: `PO ${po.poNumber} received. Stock updated for ${items.length} products.${notes ? ' Notes: ' + notes : ''}`
    };
    console.log(`[RECEIVE] Returning payload:`, resPayload);
    return resPayload;
  });

  // ═══════════════════════════════════════════════
  //  BOUND FUNCTION: getSummary
  // ═══════════════════════════════════════════════
  this.on('getSummary', 'PurchaseOrders', async (req) => {
    const { ID } = req.params[0];
    const { PurchaseOrders, PurchaseOrderItems, Suppliers } = cds.entities;

    console.log(`[FUNCTION: getSummary] Fetching data for PO ID: ${ID}`);

    const po = await SELECT.one.from(PurchaseOrders).where({ ID });
    if (!po) {
      console.warn(`[FUNCTION: getSummary] PO not found for ID: ${ID}`);
      req.reject(404, 'Purchase Order not found');
    }

    // FIX 3: Changed "purchaseOrder_ID" to "order_ID" to match schema.cds
    const items = await SELECT.from(PurchaseOrderItems).where({ order_ID: ID });
    
    // FIX 3b: Changed "po.supplier_ID" to "po.supplier_id" (matches database column syntax)
    const supplier = await SELECT.one.from(Suppliers).where({ ID: po.supplier_id });

    // Calculate days open
    const createdDate = new Date(po.createdAt || po.orderDate);
    const today = new Date();
    const daysOpen = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));

    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    const resPayload = {
      poNumber: po.poNumber,
      supplier: supplier?.supplierName || 'Unknown',
      itemCount: items.length,
      totalAmount: +totalAmount.toFixed(2),
      status: po.status,
      daysOpen: daysOpen
    };
    
    console.log(`[FUNCTION: getSummary] Aggregated Summary for PO ${po.poNumber}: Items: ${items.length}, Total: $${resPayload.totalAmount}`);
    return resPayload;
  });

  // ═══════════════════════════════════════════════
  //  UNBOUND FUNCTION: getPurchasingDashboard
  // ═══════════════════════════════════════════════
  this.on('getPurchasingDashboard', async (req) => {
    const { PurchaseOrders } = cds.entities;
    
    console.log(`[FUNCTION: getPurchasingDashboard] Compiling metrics dashboard...`);

    const allPOs = await SELECT.from(PurchaseOrders);

    const dashboardMetrics = {
      totalPOs: allPOs.length,
      draftCount: allPOs.filter(p => p.status === 'Draft').length,
      pendingApproval: allPOs.filter(p => p.status === 'Submitted').length,
      approvedCount: allPOs.filter(p => p.status === 'Approved').length,
      totalSpend: +allPOs
        .filter(p => ['Approved', 'Received'].includes(p.status))
        .reduce((sum, p) => sum + (p.totalAmount || 0), 0)
        .toFixed(2)
    };

    console.log(`[FUNCTION: getPurchasingDashboard] Compiled metrics: Total POs: ${dashboardMetrics.totalPOs}, Total Spend: $${dashboardMetrics.totalSpend}`);
    return dashboardMetrics;
  });

  // ═══════════════════════════════════════════════
  //  EVENT LISTENERS
  // ═══════════════════════════════════════════════

  this.on('POSubmitted', (msg) => {
    const { poNumber, supplierName, totalAmount, submittedBy } = msg.data;
    console.log(`\n📋 [PO SUBMITTED EVENT HANDLER] ${poNumber}`);
    console.log(`   Supplier: ${supplierName}`);
    console.log(`   Amount: $${totalAmount}`);
    console.log(`   By: ${submittedBy}`);
    console.log(`   → Waiting for approval...\n`);
  });

  this.on('POApproved', (msg) => {
    const { poNumber, approvedBy, comment } = msg.data;
    console.log(`\n✅ [PO APPROVED EVENT HANDLER] ${poNumber}`);
    console.log(`   Approved by: ${approvedBy}`);
    if (comment) console.log(`   Comment: ${comment}`);
    console.log(`   → Ready for goods receipt\n`);
  });

  this.on('POrejected', (msg) => {
    const { poNumber, rejectedBy, reason } = msg.data;
    console.log(`\n❌ [PO REJECTED EVENT HANDLER] ${poNumber}`);
    console.log(`   Rejected by: ${rejectedBy}`);
    console.log(`   Reason: ${reason}`);
    console.log(`   → Returned to requester\n`);
  });

};