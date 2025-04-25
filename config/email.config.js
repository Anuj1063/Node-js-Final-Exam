require('dotenv').config()
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || 'ajyadav107@gmail.com', // Admin Gmail ID
      pass: process.env.EMAIL_PASS || 'eapa lvzs iiog eoaa', // Admin Gmail Password
    },
  })
  
  module.exports= transporter