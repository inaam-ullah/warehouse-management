const cron = require('node-cron');
const Item = require('../models/Item');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const checkStockLevels = () => {
  cron.schedule('0 0 * * *', async () => {
    const lowStockItems = await Item.find({ quantity: { $lt: 5 } });
    if (lowStockItems.length > 0) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'recipient-email@gmail.com',
        subject: 'Low Stock Alert',
        text: `The following items have low stock levels:\n${lowStockItems.map(item => `${item.name}: ${item.quantity}`).join('\n')}`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }
  });
};

module.exports = checkStockLevels;
