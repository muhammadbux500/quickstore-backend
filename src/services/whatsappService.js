const twilio = require('twilio');
const axios = require('axios');
const qrcode = require('qrcode');

class WhatsAppService {
  constructor() {
    this.twilioClient = null;
    this.whatsappBusiness = null;
    this.initTwilio();
  }

  // Initialize Twilio
  initTwilio() {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }
  }

  // Send WhatsApp message via Twilio
  async sendTwilioMessage(to, message, mediaUrl = null) {
    try {
      const from = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;
      const toNumber = `whatsapp:${to}`;

      const options = {
        from,
        to: toNumber,
        body: message
      };

      if (mediaUrl) {
        options.mediaUrl = mediaUrl;
      }

      const result = await this.twilioClient.messages.create(options);

      return {
        success: true,
        messageId: result.sid,
        status: result.status,
        provider: 'twilio'
      };

    } catch (error) {
      console.error('Twilio WhatsApp error:', error);
      return {
        success: false,
        error: error.message,
        provider: 'twilio'
      };
    }
  }

  // Send WhatsApp message via WhatsApp Business API
  async sendBusinessMessage(to, message, mediaUrl = null) {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: mediaUrl ? 'media' : 'text',
          [mediaUrl ? 'media' : 'text']: mediaUrl ? {
            link: mediaUrl
          } : {
            body: message
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id,
        provider: 'business'
      };

    } catch (error) {
      console.error('WhatsApp Business API error:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        provider: 'business'
      };
    }
  }

  // Send order confirmation
  async sendOrderConfirmation(order, store) {
    const message = this.formatOrderMessage(order, store);
    
    if (order.customer.phone) {
      return await this.sendMessage(order.customer.phone, message);
    }

    return {
      success: false,
      error: 'Customer phone number not provided'
    };
  }

  // Send order status update
  async sendOrderStatusUpdate(order, store) {
    const message = `*Order Update #${order.orderNumber}*\n\n` +
      `Your order status has been updated to: *${order.status}*\n\n` +
      `Order Details:\n` +
      `• Total: $${order.total}\n` +
      `• Items: ${order.items.length}\n\n`;

    if (order.trackingNumber) {
      message += `Tracking Number: ${order.trackingNumber}\n`;
      message += `Carrier: ${order.carrier}\n`;
      if (order.trackingUrl) {
        message += `Track: ${order.trackingUrl}\n`;
      }
    }

    message += `\nThank you for shopping with ${store.name}!`;

    return await this.sendMessage(order.customer.phone, message);
  }

  // Send product inquiry
  async sendProductInquiry(product, customer, question) {
    const message = `*Product Inquiry*\n\n` +
      `Customer: ${customer.name}\n` +
      `Email: ${customer.email || 'Not provided'}\n` +
      `Phone: ${customer.phone}\n\n` +
      `Product: ${product.name}\n` +
      `SKU: ${product.sku}\n` +
      `Price: $${product.price}\n\n` +
      `Question: ${question}\n\n` +
      `Please respond to this inquiry as soon as possible.`;

    return await this.sendMessage(product.store.phone, message);
  }

  // Send abandoned cart reminder
  async sendAbandonedCartReminder(cart, store) {
    const itemsList = cart.items.map(item => 
      `• ${item.name} x${item.quantity} - $${item.total}`
    ).join('\n');

    const message = `*Complete Your Purchase*\n\n` +
      `Hi ${cart.customer.name},\n\n` +
      `You left some items in your cart:\n\n` +
      `${itemsList}\n\n` +
      `Total: $${cart.total}\n\n` +
      `Complete your order now: ${store.fullUrl}/cart\n\n` +
      `Don't miss out on these great items!`;

    return await this.sendMessage(cart.customer.phone, message);
  }

  // Send promotional message
  async sendPromotion(store, customer, promotion) {
    const message = `*${store.name} Special Offer*\n\n` +
      `${promotion.title}\n\n` +
      `${promotion.description}\n\n` +
      `Offer: ${promotion.discount}% OFF\n` +
      `Code: ${promotion.code}\n` +
      `Valid until: ${new Date(promotion.validUntil).toLocaleDateString()}\n\n` +
      `Shop now: ${store.fullUrl}`;

    return await this.sendMessage(customer.phone, message);
  }

  // Send delivery update
  async sendDeliveryUpdate(order, location) {
    const message = `*Delivery Update #${order.orderNumber}*\n\n` +
      `Your delivery is on the way!\n\n` +
      `Current Location: ${location.address}\n` +
      `Estimated Arrival: ${location.estimatedTime}\n\n`;

    if (location.mapLink) {
      message += `Track live: ${location.mapLink}\n`;
    }

    if (order.trackingNumber) {
      message += `\nTracking Number: ${order.trackingNumber}`;
    }

    return await this.sendMessage(order.customer.phone, message);
  }

  // Send welcome message
  async sendWelcomeMessage(customer, store) {
    const message = `Welcome to ${store.name}! 🎉\n\n` +
      `Hi ${customer.name},\n\n` +
      `Thank you for choosing ${store.name}. We're excited to have you!\n\n` +
      `You can now:\n` +
      `• Browse our products: ${store.fullUrl}/products\n` +
      `• Track your orders: ${store.fullUrl}/orders\n` +
      `• Contact us: ${store.settings?.phone || 'Reply to this message'}\n\n` +
      `Need help? Just reply to this message and we'll assist you!`;

    return await this.sendMessage(customer.phone, message);
  }

  // Send verification code
  async sendVerificationCode(phone, code) {
    const message = `Your QuickStore verification code is: *${code}*\n\n` +
      `This code will expire in 10 minutes. Never share this code with anyone.`;

    return await this.sendMessage(phone, message);
  }

  // Generate WhatsApp link
  generateWhatsAppLink(phone, message = '') {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`;
  }

  // Generate QR code for WhatsApp
  async generateQRCode(phone, message = '') {
    try {
      const link = this.generateWhatsAppLink(phone, message);
      const qrCode = await qrcode.toDataURL(link);
      
      return {
        success: true,
        qrCode,
        link
      };

    } catch (error) {
      console.error('Generate QR code error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send message (auto-select provider)
  async sendMessage(to, message, mediaUrl = null) {
    // Determine which provider to use
    if (this.twilioClient && process.env.TWILIO_WHATSAPP_NUMBER) {
      return await this.sendTwilioMessage(to, message, mediaUrl);
    } else if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_ID) {
      return await this.sendBusinessMessage(to, message, mediaUrl);
    } else {
      // Fallback to generating a WhatsApp link
      const link = this.generateWhatsAppLink(to, message);
      return {
        success: true,
        link,
        provider: 'link'
      };
    }
  }

  // Send bulk messages
  async sendBulkMessages(recipients, message, mediaUrl = null) {
    const results = [];

    for (const recipient of recipients) {
      try {
        const result = await this.sendMessage(recipient.phone, message, mediaUrl);
        results.push({ ...recipient, ...result });

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({ ...recipient, success: false, error: error.message });
      }
    }

    return results;
  }

  // Parse incoming webhook
  parseWebhook(provider, body) {
    switch (provider) {
      case 'twilio':
        return this.parseTwilioWebhook(body);
      case 'business':
        return this.parseBusinessWebhook(body);
      default:
        return body;
    }
  }

  // Parse Twilio webhook
  parseTwilioWebhook(body) {
    return {
      messageId: body.MessageSid,
      from: body.From.replace('whatsapp:', ''),
      to: body.To.replace('whatsapp:', ''),
      body: body.Body,
      mediaUrl: body.MediaUrl0,
      numMedia: body.NumMedia,
      timestamp: new Date()
    };
  }

  // Parse Business API webhook
  parseBusinessWebhook(body) {
    if (body.entry && body.entry[0] && body.entry[0].changes) {
      const change = body.entry[0].changes[0];
      const message = change.value.messages?.[0];

      if (message) {
        return {
          messageId: message.id,
          from: message.from,
          to: change.value.metadata.phone_number_id,
          type: message.type,
          body: message.text?.body,
          mediaUrl: message.image?.link || message.video?.link || message.document?.link,
          timestamp: new Date(message.timestamp * 1000)
        };
      }
    }

    return body;
  }

  // Format order message
  formatOrderMessage(order, store) {
    const itemsList = order.items.map(item => 
      `• ${item.name} x${item.quantity} - $${item.total}`
    ).join('\n');

    return `*Order Confirmation #${order.orderNumber}*\n\n` +
      `Thank you for your order, ${order.customer.name}!\n\n` +
      `*Order Details:*\n` +
      `${itemsList}\n\n` +
      `*Summary:*\n` +
      `• Subtotal: $${order.subtotal}\n` +
      `• Shipping: $${order.shippingCost}\n` +
      `• Tax: $${order.tax}\n` +
      `• Total: $${order.total}\n\n` +
      `*Shipping Address:*\n` +
      `${order.shippingAddress.street}\n` +
      `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}\n` +
      `${order.shippingAddress.country}\n\n` +
      `*Payment Method:* ${order.paymentMethod}\n` +
      `*Order Status:* ${order.status}\n\n` +
      `You can track your order here: ${store.fullUrl}/orders/${order._id}\n\n` +
      `Thank you for shopping with ${store.name}!`;
  }
}

module.exports = new WhatsAppService();