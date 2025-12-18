/**
 * Email Service
 * Handles sending emails for order confirmations and notifications
 */

const nodemailer = require('nodemailer');

// Email configuration from environment variables
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || EMAIL_USER; // Email to receive order notifications

/**
 * Create email transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    }
  });
}

/**
 * Send order confirmation email to customer
 * @param {Object} orderData - Order information
 * @returns {Promise<Object>} Email send result
 */
async function sendOrderConfirmationEmail(orderData) {
  try {
    const { order, user } = orderData;

    if (!EMAIL_USER || !EMAIL_PASSWORD) {
      console.warn('Email credentials not configured. Skipping email send.');
      return { success: false, error: 'Email not configured' };
    }

    if (!user.email) {
      console.warn('Customer email not found. Skipping email send.');
      return { success: false, error: 'Customer email not found' };
    }

    const transporter = createTransporter();

    // Format order items for email
    const itemsList = order.items.map(item => {
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .order-info { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background-color: #4CAF50; color: white; padding: 10px; text-align: left; }
          .total { font-size: 18px; font-weight: bold; text-align: right; padding: 15px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
          </div>
          <div class="content">
            <p>Dear ${user.name},</p>
            <p>Thank you for your order! We have received your order and it is being processed.</p>
            
            <div class="order-info">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
            </div>

            <div class="order-info">
              <h3>Shipping Information</h3>
              <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
              <p><strong>Phone:</strong> ${order.phone}</p>
            </div>

            <div class="order-info">
              <h3>Order Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
              <div class="total">
                <strong>Total: $${order.total.toFixed(2)}</strong>
              </div>
            </div>

            <p>We will send you another email once your order has been shipped.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
          </div>
          <div class="footer">
            <p>Thank you for shopping with us!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Fabritech" <${EMAIL_FROM}>`,
      to: user.email,
      subject: `Order Confirmation - Order #${order.id}`,
      html: emailHTML,
      text: `Dear ${user.name},\n\nThank you for your order!\n\nOrder ID: ${order.id}\nOrder Date: ${new Date(order.createdAt).toLocaleDateString()}\nTotal: $${order.total.toFixed(2)}\n\nWe will process your order shortly.\n\nThank you for shopping with us!`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send order notification email to admin/company
 * @param {Object} orderData - Order information
 * @returns {Promise<Object>} Email send result
 */
async function sendOrderNotificationEmail(orderData) {
  try {
    const { order, user } = orderData;

    if (!EMAIL_USER || !EMAIL_PASSWORD) {
      console.warn('Email credentials not configured. Skipping email send.');
      return { success: false, error: 'Email not configured' };
    }

    if (!ADMIN_EMAIL) {
      console.warn('Admin email not configured. Skipping email send.');
      return { success: false, error: 'Admin email not configured' };
    }

    const transporter = createTransporter();

    // Format order items for email
    const itemsList = order.items.map(item => {
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .order-info { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { background-color: #2196F3; color: white; padding: 10px; text-align: left; }
          .total { font-size: 18px; font-weight: bold; text-align: right; padding: 15px; }
          .alert { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Order Received</h1>
          </div>
          <div class="content">
            <div class="alert">
              <strong>New Order Notification</strong><br>
              A customer has placed a new order. Please process it as soon as possible.
            </div>

            <div class="order-info">
              <h3>Order Information</h3>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()} ${new Date(order.createdAt).toLocaleTimeString()}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
              ${order.dpoTransactionId ? `<p><strong>DPO Transaction ID:</strong> ${order.dpoTransactionId}</p>` : ''}
            </div>

            <div class="order-info">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> ${user.name}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Phone:</strong> ${order.phone}</p>
              <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
            </div>

            <div class="order-info">
              <h3>Order Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
              <div class="total">
                <strong>Total Amount: $${order.total.toFixed(2)}</strong>
              </div>
            </div>

            <p><strong>Action Required:</strong> Please process this order and update the order status accordingly.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Fabritech Order System" <${EMAIL_FROM}>`,
      to: ADMIN_EMAIL,
      subject: `New Order Received - Order #${order.id} - $${order.total.toFixed(2)}`,
      html: emailHTML,
      text: `New Order Received\n\nOrder ID: ${order.id}\nCustomer: ${user.name} (${user.email})\nTotal: $${order.total.toFixed(2)}\n\nPlease process this order.\n\nOrder Details:\n${order.items.map(item => `- ${item.title} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order notification email sent to admin:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order notification email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send both customer confirmation and admin notification emails
 * @param {Object} orderData - Order information with populated user and items
 * @returns {Promise<Object>} Email send results
 */
async function sendOrderEmails(orderData) {
  try {
    const results = {
      customerEmail: await sendOrderConfirmationEmail(orderData),
      adminEmail: await sendOrderNotificationEmail(orderData)
    };

    return {
      success: results.customerEmail.success || results.adminEmail.success,
      results: results
    };
  } catch (error) {
    console.error('Error sending order emails:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send contact form notification email to admin/company
 * @param {Object} contact - Contact form submission information
 * @returns {Promise<Object>} Email send result
 */
async function sendContactNotificationEmail(contact) {
  try {
    if (!EMAIL_USER || !EMAIL_PASSWORD) {
      console.warn('Email credentials not configured. Skipping email send.');
      return { success: false, error: 'Email not configured' };
    }

    if (!ADMIN_EMAIL) {
      console.warn('Admin email not configured. Skipping email send.');
      return { success: false, error: 'Admin email not configured' };
    }

    const transporter = createTransporter();

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #9C27B0; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .contact-info { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .alert { background-color: #e3f2fd; border-left: 4px solid #2196F3; padding: 10px; margin: 15px 0; }
          .message-box { background-color: #f5f5f5; padding: 15px; border-left: 4px solid #9C27B0; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="alert">
              <strong>New Contact Form Notification</strong><br>
              Someone has submitted a contact form on your website. Please respond as soon as possible.
            </div>

            <div class="contact-info">
              <h3>Contact Information</h3>
              <p><strong>Name:</strong> ${contact.fullName}</p>
              <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
              ${contact.phone ? `<p><strong>Phone:</strong> <a href="tel:${contact.phone}">${contact.phone}</a></p>` : ''}
              <p><strong>Subject:</strong> ${contact.subject}</p>
              <p><strong>Service Interest:</strong> ${contact.serviceInterest}</p>
              <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleDateString()} ${new Date(contact.createdAt).toLocaleTimeString()}</p>
            </div>

            <div class="message-box">
              <h3>Message</h3>
              <p style="white-space: pre-wrap;">${contact.message}</p>
            </div>

            <p><strong>Action Required:</strong> Please respond to this inquiry at your earliest convenience.</p>
            <p>You can reply directly to: <a href="mailto:${contact.email}">${contact.email}</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"Fabritech Contact Form" <${EMAIL_FROM}>`,
      to: ADMIN_EMAIL,
      replyTo: contact.email,
      subject: `New Contact Form Submission: ${contact.subject}`,
      html: emailHTML,
      text: `New Contact Form Submission\n\nName: ${contact.fullName}\nEmail: ${contact.email}\n${contact.phone ? `Phone: ${contact.phone}\n` : ''}Subject: ${contact.subject}\nService Interest: ${contact.serviceInterest}\nSubmitted: ${new Date(contact.createdAt).toLocaleString()}\n\nMessage:\n${contact.message}\n\nPlease respond to: ${contact.email}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent to admin:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendOrderConfirmationEmail,
  sendOrderNotificationEmail,
  sendOrderEmails,
  sendContactNotificationEmail
};

