const formData = require('form-data');
const Mailgun = require('mailgun.js')
require('dotenv').config();
const DOMAIN = process.env.DOMAIN;
const PORT = process.env.PORT;
const functions = require('@google-cloud/functions-framework')
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api',  key: process.env.MAILGUN_API_KEY });

functions.cloudEvent('sendVerificationEmail', async(cloudEvent) => {
    const eventData = cloudEvent.data.message.data;
    const payload = JSON.parse(Buffer.from(eventData, 'base64').toString());
    const { firstName, lastName, username, verificationToken } = payload;
    const verificationUrl = `http://${DOMAIN}:${PORT}/v1/user/verify-email?token=${verificationToken}`;
    const msgdata = {
        from: '<noreply@nitesh-more.me>',
        to: username,
        subject: 'Verify Your Email Address',
        template: "verify_email",
        'h:X-Mailgun-Variables': JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          verification_url: verificationUrl
        })
    };
    try {
        const response = await mg.messages.create(DOMAIN, msgdata);
        console.log(response);
      } catch (error) {
        console.error('Error sending email:', error);
      }

})
