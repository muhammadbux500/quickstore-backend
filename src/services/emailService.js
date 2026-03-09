const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = null;
    this.templates = new Map();
    this.initialize();
  }

  // Initialize email transporter
  initialize() {
    // Create transporter based on environment
    if (process.env.NODE_ENV === 'production') {
      // Production: Use real email service
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100
      });
    } else {
      // Development: Use ethereal for testing
      this.createTestAccount();
    }

    // Load email templates
    this.loadTemplates();
  }

  // Create test account for development
  async createTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('Ethereal email test account created');
    } catch (error) {
      console.error('Failed to create test account:', error);
    }
  }

  // Load email templates
  loadTemplates() {
    const templateDir = path.join(__dirname, '../templates/email');
    
    if (!fs.existsSync(templateDir)) {
      console.warn('Email templates directory not found');
      return;
    }

    const templates = fs.readdirSync(templateDir);
    
    templates.forEach(file => {
      if (file.endsWith('.hbs')) {
        const templateName = path.basename(file, '.hbs');
        const content = fs.readFileSync(path.join(templateDir, file), 'utf8');
        this.templates.set(templateName, handlebars.compile(content));
      }
    });

    console.log(`Loaded ${this.templates.size} email templates`);
  }

  // Send email
  async sendEmail(options) {
    try {
      const { to, subject, template, data, attachments, cc, bcc, replyTo } = options;

      // Get template
      let html = '';
      if (template && this.templates.has(template)) {
        html = this.templates.get(template)(data);
      } else {
        // Use default template or plain text
        html = this.getDefaultTemplate(data);
      }

      // Prepare email options
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'QuickStore'}" <${process.env.EMAIL_FROM || 'noreply@quickstore.com'}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
        attachments,
        cc: cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : undefined,
        bcc: bcc ? (Array.isArray(bcc) ? bcc.join(', ') : bcc) : undefined,
        replyTo: replyTo || process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM,
        headers: {
          'X-Priority': '3',
          'X-Mailer': 'QuickStore Mail Service'
        }
      };

      // Send email
      const info = await this.transporter.sendMail(mailOptions);

      // Log for development
      if (process.env.NODE_ENV !== 'production') {
        console.log('Email sent:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      return {
        success: true,
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info)
      };

    } catch (error) {
      console.error('Send email error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to QuickStore!',
      template: 'welcome',
      data: {
        name: user.name,
        email: user.email,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@quickstore.com'
      }
    });
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    return this.sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      data: {
        name: user.name,
        resetUrl,
        expiresIn: '1 hour',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@quickstore.com'
      }
    });
  }

  // Send email verification
  async sendVerificationEmail(user, verificationToken) {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    return this.sendEmail({
      to: user.email,
      subject: 'Verify Your Email Address',
      template: 'verify-email',
      data: {
        name: user.name,
        verifyUrl,
        expiresIn: '24 hours',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@quickstore.com'
      }
    });
  }

  // Send order confirmation
  async sendOrderConfirmation(order, store) {
    return this.sendEmail({
      to: order.customer.email,
      subject: `Order Confirmation #${order.orderNumber}`,
      template: 'order-confirmation',
      data: {
        customerName: order.customer.name,
        orderNumber: order.orderNumber,
        orderDate: new Date(order.createdAt).toLocaleDateString(),
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shippingCost,
        tax: order.tax,
        total: order.total,
        storeName: store.name,
        storeUrl: store.fullUrl,
        trackingUrl: order.trackingUrl,
        supportEmail: store.settings?.email || process.env.SUPPORT_EMAIL
      }
    });
  }

  // Send order status update
  async sendOrderStatusUpdate(order, store) {
    return this.sendEmail({
      to: order.customer.email,
      subject: `Order #${order.orderNumber} Status Update`,
      template: 'order-status',
      data: {
        customerName: order.customer.name,
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        trackingUrl: order.trackingUrl,
        estimatedDelivery: order.estimatedDelivery,
        storeName: store.name,
        storeUrl: store.fullUrl,
        supportEmail: store.settings?.email || process.env.SUPPORT_EMAIL
      }
    });
  }

  // Send store invitation
  async sendStoreInvitation(email, store, inviter) {
    const acceptUrl = `${process.env.FRONTEND_URL}/accept-invite/${store._id}`;

    return this.sendEmail({
      to: email,
      subject: `You're invited to join ${store.name}`,
      template: 'store-invitation',
      data: {
        inviterName: inviter.name,
        storeName: store.name,
        storeUrl: store.fullUrl,
        acceptUrl,
        expiresIn: '7 days',
        supportEmail: process.env.SUPPORT_EMAIL
      }
    });
  }

  // Send affiliate welcome
  async sendAffiliateWelcome(affiliate) {
    return this.sendEmail({
      to: affiliate.user.email,
      subject: 'Welcome to QuickStore Affiliate Program!',
      template: 'affiliate-welcome',
      data: {
        name: affiliate.user.name,
        referralCode: affiliate.referralCode,
        referralUrl: `${process.env.FRONTEND_URL}/ref/${affiliate.referralCode}`,
        commissionRate: affiliate.commissionRate,
        affiliateDashboardUrl: `${process.env.FRONTEND_URL}/affiliate`,
        supportEmail: process.env.SUPPORT_EMAIL
      }
    });
  }

  // Send payout notification
  async sendPayoutNotification(affiliate, payout) {
    return this.sendEmail({
      to: affiliate.user.email,
      subject: 'Payout Processed Successfully',
      template: 'payout-notification',
      data: {
        name: affiliate.user.name,
        amount: payout.amount,
        paymentMethod: payout.paymentMethod,
        transactionId: payout.transactionId,
        processedAt: new Date(payout.processedAt).toLocaleDateString(),
        affiliateDashboardUrl: `${process.env.FRONTEND_URL}/affiliate`,
        supportEmail: process.env.SUPPORT_EMAIL
      }
    });
  }

  // Send bulk emails
  async sendBulkEmails(emails) {
    const results = [];
    
    for (const email of emails) {
      try {
        const result = await this.sendEmail(email);
        results.push({ ...email, ...result });
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({ ...email, success: false, error: error.message });
      }
    }

    return results;
  }

  // Get default email template
  getDefaultTemplate(data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>QuickStore Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); }
          .header h1 { color: white; margin: 0; }
          .content { padding: 30px; background: #f9fafb; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
          .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>QuickStore</h1>
          </div>
          <div class="content">
            ${data.message || 'This is a system-generated email.'}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} QuickStore. All rights reserved.</p>
            <p>123 Business Ave, San Francisco, CA 94105</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Verify connection
  async verifyConnection() {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();