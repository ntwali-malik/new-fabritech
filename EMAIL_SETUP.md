# Email Configuration Guide

This guide explains how to configure email functionality for order confirmations and notifications.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com          # SMTP server host (default: smtp.gmail.com)
EMAIL_PORT=587                      # SMTP port (default: 587, use 465 for SSL)
EMAIL_USER=your-email@gmail.com     # Your email address
EMAIL_PASSWORD=your-app-password    # Your email password or app-specific password
EMAIL_FROM=your-email@gmail.com    # From address (defaults to EMAIL_USER)
ADMIN_EMAIL=admin@yourcompany.com  # Email address to receive order notifications
```

## Gmail Setup

If you're using Gmail, you'll need to:

1. **Enable 2-Step Verification** on your Google account
2. **Generate an App Password**:
   - Go to your Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail" and "Other (Custom name)"
   - Use this app password as `EMAIL_PASSWORD`

## Other Email Providers

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
```

### Custom SMTP Server
Use your email provider's SMTP settings:
```env
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-password
```

## How It Works

When an order is created or payment is verified:

1. **Customer Confirmation Email**: Sent to the customer's email address with:
   - Order confirmation details
   - Order ID and date
   - List of items ordered
   - Total amount
   - Shipping information

2. **Admin Notification Email**: Sent to the `ADMIN_EMAIL` address with:
   - New order notification
   - Customer information
   - Order details
   - Items ordered
   - Total amount

## Testing

The email service will gracefully handle errors - if email sending fails, the order will still be created successfully. Check your server logs for email-related errors.

## Troubleshooting

- **Emails not sending**: Check that all environment variables are set correctly
- **Gmail authentication errors**: Make sure you're using an App Password, not your regular password
- **Connection timeout**: Verify EMAIL_HOST and EMAIL_PORT are correct for your provider
- **Check server logs**: Email errors are logged to the console without blocking order creation

