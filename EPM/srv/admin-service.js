const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    const { PurchaseOrders, PurchaseOrderItems } = this.entities;

    // 1. Calculate Item Amount automatically during draft modifications
    this.before(['CREATE', 'UPDATE'], 'PurchaseOrderItems', async (req) => {
        const item = req.data;
        if (item.quantity && item.price) {
            item.amount = item.quantity * item.price;
        }
    });

    // 2. Recalculate Parent Header Total Amount when any items are modified
    this.after(['CREATE', 'UPDATE', 'DELETE'], 'PurchaseOrderItems', async (insertedItem, req) => {
        const parentId = insertedItem.parent_ID || req.data.parent_ID;
        if (!parentId) return;

        const tx = cds.tx(req);
        const items = await tx.run(SELECT.from(PurchaseOrderItems).where({ parent_ID: parentId }));
        const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

        await tx.run(UPDATE(PurchaseOrders).set({ totalAmount: total }).where({ ID: parentId }));
    });

    // 3. Validation Rules on Save (Draft Activation)
    this.before('SAVE', 'PurchaseOrders', async (req) => {
        const { ID, poNumber, supplier_ID, items } = req.data;
        
        if (!poNumber) req.error(400, 'Purchase Order Number is required.', 'in/poNumber');
        if (!supplier_ID) req.error(400, 'Please select a Supplier.', 'in/supplier_ID');

        const poItems = items || await SELECT.from(PurchaseOrderItems).where({ parent_ID: ID });
        if (!poItems || poItems.length === 0) {
            req.error(400, 'A valid Purchase Order requires at least one item line.');
        }

        for (const item of poItems) {
            if (!item.product_ID) req.error(400, 'Product selection is required on items.');
            if (!item.quantity || item.quantity <= 0) req.error(400, 'Quantity must be greater than zero.', `in/items(ID='${item.ID}')/quantity`);
            if (!item.price || item.price <= 0) req.error(400, 'Price must be greater than zero.', `in/items(ID='${item.ID}')/price`);
        }
    });

    // 4. Compute Dynamic Status Text and Criticality for UI elements
    this.after('READ', 'PurchaseOrders', (each) => {
        if (!each) return;
        const records = Array.isArray(each) ? each : [each];
        records.forEach(po => {
            switch (po.lifecycleStatus) {
                case 'N': po.criticality = 2; po.statusText = 'New'; break;       // Yellow/Warning
                case 'S': po.criticality = 1; po.statusText = 'Submitted'; break; // Neutral/Blue
                case 'A': po.criticality = 3; po.statusText = 'Approved'; break;  // Green/Positive
                case 'R': po.criticality = 1; po.statusText = 'Rejected'; break;  // Red/Negative
                default:  po.criticality = 0; po.statusText = 'Draft';
            }
        });
    });

    // 5. Action Handlers
    this.on('submit', 'PurchaseOrders', async (req) => {
        const id = req.params[0].ID;
        const tx = cds.tx(req);
        const po = await tx.run(SELECT.one.from(PurchaseOrders).where({ ID: id }));
        if (!po || po.lifecycleStatus !== 'N') return req.error(400, 'Only New orders can be submitted.');
        await tx.run(UPDATE(PurchaseOrders).set({ lifecycleStatus: 'S' }).where({ ID: id }));
    });

    this.on('approve', 'PurchaseOrders', async (req) => {
        const id = req.params[0].ID;
        const tx = cds.tx(req);
        const po = await tx.run(SELECT.one.from(PurchaseOrders).where({ ID: id }));
        if (!po || po.lifecycleStatus !== 'S') return req.error(400, 'Only Submitted orders can be approved.');
        await tx.run(UPDATE(PurchaseOrders).set({ lifecycleStatus: 'A' }).where({ ID: id }));
    });

    this.on('reject', 'PurchaseOrders', async (req) => {
        const id = req.params[0].ID;
        const tx = cds.tx(req);
        const po = await tx.run(SELECT.one.from(PurchaseOrders).where({ ID: id }));
        if (!po || po.lifecycleStatus !== 'S') return req.error(400, 'Only Submitted orders can be rejected.');
        await tx.run(UPDATE(PurchaseOrders).set({ lifecycleStatus: 'R' }).where({ ID: id }));
    });
});