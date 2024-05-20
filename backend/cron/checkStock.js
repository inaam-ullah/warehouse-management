const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Item = require('../models/Item');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const createEmailContent = items => {
  return `The following items have low stock levels:\n${items.map(item => `${item.name}: ${item.quantity}`).join('\n')}`;
};

const checkStockLevels = () => {
  const recipientEmail = process.env.RECIPIENT_EMAIL || 'recipient-email@gmail.com';
  const stockThreshold = process.env.STOCK_THRESHOLD || 5;

  cron.schedule('0 0 * * *', async () => {
    try {
      const lowStockItems = await Item.find({ quantity: { $lt: stockThreshold } });
      if (lowStockItems.length > 0) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: recipientEmail,
          subject: 'Low Stock Alert',
          text: createEmailContent(lowStockItems),
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      } else {
        console.log('No low stock items found.');
      }
    } catch (error) {
      console.error('Error checking stock levels:', error);
    }
  });
};

module.exports = checkStockLevels;
