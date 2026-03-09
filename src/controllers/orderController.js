const Order = require('../models/Order');
const Product = require('../models/Product');
const Store = require('../models/Store');
const { validationResult } = require('express-validator');
const { sendEmail } = require('../services/emailService');
const { generateInvoice } = require('../services/invoiceService');

// @desc    Create order
// @route   POST /api/stores/:storeId/orders
// @access  Public/Private
exports.createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { storeId } = req.params;
    const {
      items,
      customer,
      shippingAddress,
      billingAddress,
      shippingMethod,
      paymentMethod,
      notes
    } = req.body;

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      // Check stock
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal,
        variant: item.variant
      });

      // Update stock
      product.quantity -= item.quantity;
      await product.save();
    }

    // Calculate tax and shipping
    const taxRate = store.settings?.taxRate || 0;
    const tax = (subtotal * taxRate) / 100;
    
    const shippingCost = store.settings?.shippingRates?.[shippingMethod] || 0;
    const total = subtotal + tax + shippingCost;

    // Create order
    const order = await Order.create({
      store: storeId,
      orderNumber: await generateOrderNumber(storeId),
      items: orderItems,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        userId: req.user?.id
      },
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      shippingMethod,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      total,
      notes,
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Send confirmation email
    await sendEmail({
      to: customer.email,
      subject: `Order Confirmation #${order.orderNumber}`,
      template: 'order-confirmation',
      data: {
        orderNumber: order.orderNumber,
        customerName: customer.name,
        items: orderItems,
        total,
        storeName: store.name
      }
    });

    // Send notification to store owner
    const owner = await User.findById(store.owner);
    await sendEmail({
      to: owner.email,
      subject: `New Order #${order.orderNumber}`,
      template: 'new-order-notification',
      data: {
        orderNumber: order.orderNumber,
        customerName: customer.name,
        total,
        storeName: store.name
      }
    });

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all orders for store
// @route   GET /api/stores/:storeId/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const { storeId } = req.params;
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      search,
      startDate,
      endDate,
      sort = '-createdAt'
    } = req.query;

    // Check if user owns the store
    const store = await Store.findById(storeId);
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Build query
    const query = { store: storeId };
    
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const orders = await Order.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('items.product', 'name images');

    const total = await Order.countDocuments(query);

    // Calculate summary
    const summary = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]);

    res.json({
      success: true,
      data: orders,
      summary: summary[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single order
// @route   GET /api/stores/:storeId/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const { storeId, id } = req.params;

    const order = await Order.findOne({
      _id: id,
      store: storeId
    }).populate('items.product', 'name images sku');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/stores/:storeId/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    const { storeId, id } = req.params;
    const { status, trackingNumber, carrier } = req.body;

    const order = await Order.findOne({
      _id: id,
      store: storeId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the store
    const store = await Store.findById(storeId);
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update status
    order.status = status;
    order.statusHistory.push({
      status,
      note: req.body.note,
      updatedBy: req.user.id
    });

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
      order.carrier = carrier;
    }

    await order.save();

    // Send status update email to customer
    await sendEmail({
      to: order.customer.email,
      subject: `Order #${order.orderNumber} Status Update`,
      template: 'order-status-update',
      data: {
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        status,
        trackingNumber,
        carrier,
        storeName: store.name
      }
    });

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/stores/:storeId/orders/:id/payment
// @access  Private
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { storeId, id } = req.params;
    const { paymentStatus, transactionId } = req.body;

    const order = await Order.findOne({
      _id: id,
      store: storeId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the store
    const store = await Store.findById(storeId);
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Update payment status
    order.paymentStatus = paymentStatus;
    if (transactionId) {
      order.transactionId = transactionId;
    }

    await order.save();

    res.json({
      success: true,
      data: order,
      message: 'Payment status updated successfully'
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get order invoice
// @route   GET /api/stores/:storeId/orders/:id/invoice
// @access  Private
exports.getOrderInvoice = async (req, res) => {
  try {
    const { storeId, id } = req.params;

    const order = await Order.findOne({
      _id: id,
      store: storeId
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Generate PDF invoice
    const invoice = await generateInvoice(order);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);

    res.send(invoice);

  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create refund
// @route   POST /api/stores/:storeId/orders/:id/refund
// @access  Private
exports.createRefund = async (req, res) => {
  try {
    const { storeId, id } = req.params;
    const { items, amount, reason } = req.body;

    const order = await Order.findOne({
      _id: id,
      store: storeId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the store
    const store = await Store.findById(storeId);
    if (store.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Process refund (integrate with payment gateway)
    const refund = {
      amount: amount || order.total,
      items: items || order.items,
      reason,
      status: 'processed',
      refundedAt: new Date()
    };

    order.refunds.push(refund);
    order.paymentStatus = 'refunded';
    await order.save();

    // Update product quantities if items are returned
    if (items) {
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: item.quantity }
        });
      }
    }

    res.json({
      success: true,
      data: refund,
      message: 'Refund processed successfully'
    });

  } catch (error) {
    console.error('Create refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper function to generate order number
const generateOrderNumber = async (storeId) => {
  const count = await Order.countDocuments({ store: storeId });
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const sequence = (count + 1).toString().padStart(4, '0');
  
  return `ORD-${year}${month}-${sequence}`;
};