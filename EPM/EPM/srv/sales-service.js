// srv/sales-service.js
const cds = require('@sap/cds');

module.exports = function () {

  const { SalesOrders } = cds.entities;

  // ═══════════════════════════════════════════════
  //  BOUND ACTION: confirm (on SalesOrders)
  // ═══════════════════════════════════════════════
  this.on('confirm', 'SalesOrders', async (req) => {
    // Get the specific order this action is called on
    const orderId = req.params[0]?.ID || req.params[0];

    // Read the current order
    const order = await SELECT.one.from(SalesOrders).where({ ID: orderId });

    if (!order) {
      req.reject(404, 'Order not found');
    }

    // Business rule: Can only confirm "New" orders
    if (order.status !== 'New') {
      req.reject(400, `Cannot confirm order in "${order.status}" status. Only "New" orders can be confirmed.`);
    }

    // Update the order status
    await UPDATE(SalesOrders).set({
      status: 'Confirmed',
      modifiedAt: new Date().toISOString()
    }).where({ ID: orderId });

    // Return success response
    return {
      status: 'Confirmed',
      message: `Order ${order.orderNumber} confirmed successfully`
    };
  });

  // ═══════════════════════════════════════════════
  //  BOUND ACTION: cancel (on SalesOrders)
  // ═══════════════════════════════════════════════
  this.on('cancel', 'SalesOrders', async (req) => {
    const orderId = req.params[0]?.ID || req.params[0];
    const { reason } = req.data;

    const order = await SELECT.one.from(SalesOrders).where({ ID: orderId });

    if (!order) {
      req.reject(404, 'Order not found');
    }

    // Business rule: Cannot cancel delivered orders
    if (order.status === 'Delivered') {
      req.reject(400, 'Cannot cancel a delivered order. Please initiate a return instead.');
    }

    if (order.status === 'Cancelled') {
      req.reject(400, 'Order is already cancelled');
    }

    // Cancel reason is required
    if (!reason || reason.trim() === '') {
      req.reject(400, 'Cancellation reason is required');
    }

    // Update order
    await UPDATE(SalesOrders).set({
      status: 'Cancelled',
      modifiedAt: new Date().toISOString()
    }).where({ ID: orderId });

    // Calculate refund (if already paid)
    const refundAmount = (order.status === 'Confirmed' || order.status === 'Shipped')
      ? order.grossAmount
      : 0;

    return {
      status: 'Cancelled',
      message: `Order ${order.orderNumber} cancelled. Reason: ${reason}`,
      refundAmount: refundAmount
    };
  });

  // ═══════════════════════════════════════════════
  //  BOUND ACTION: ship (on SalesOrders)
  // ═══════════════════════════════════════════════
  this.on('ship', 'SalesOrders', async (req) => {
    const orderId = req.params[0]?.ID || req.params[0];
    const { trackingNumber, carrier } = req.data;

    const order = await SELECT.one.from(SalesOrders).where({ ID: orderId });

    if (!order) req.reject(404, 'Order not found');

    if (order.status !== 'Confirmed') {
      req.reject(400, `Cannot ship order in "${order.status}" status. Order must be "Confirmed" first.`);
    }

    if (!trackingNumber) req.reject(400, 'Tracking number is required');
    if (!carrier) req.reject(400, 'Carrier name is required');

    await UPDATE(SalesOrders).set({
      status: 'Shipped',
      modifiedAt: new Date().toISOString()
    }).where({ ID: orderId });

    // Estimate delivery: 5 business days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    return {
      status: 'Shipped',
      message: `Order ${order.orderNumber} shipped via ${carrier}. Tracking: ${trackingNumber}`,
      estimatedDelivery: deliveryDate.toISOString().split('T')[0]
    };
  });

};