const EmailLog = require('./models/Email.Model');
const User = require('./models/user.model');
const uuid = require('uuid');
const formData = require('form-data');
const Mailgun = require('mailgun.js')
require('dotenv').config();
const DOMAIN = process.env.DOMAIN;
const PORT = process.env.PORT;
const functions = require('@google-cloud/functions-framework');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api',  key: process.env.MAILGUN_API_KEY });

functions.cloudEvent('sendVerificationEmail', async(cloudEvent) => {
    const eventData = cloudEvent.data.message.data;
    const payload = JSON.parse(Buffer.from(eventData, 'base64').toString());
    const { firstName, lastName, username } = payload;
    const verificationToken = uuid.v4();
    const verificationUrl = `http://${DOMAIN}:${PORT}/v1/user/verify-email?token=${verificationToken}`;
    let emailStatus = 'Pending';
    let errorMessage = '';
    let response;
    const msgdata = { 
        from: `<noreply@${DOMAIN}>`,
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

        response = await mg.messages.create(DOMAIN, msgdata);
        emailStatus='Sent';
        
    }
    catch(error)
    {
      emailStatus = 'Failed';
      errorMessage = error.message;
      console.error('Failed to send email: ', error);
      
    }
    if(emailStatus === 'Sent') {
        console.info(`Email sent to ${username}, and logged successfully`);
        const verificationTokenExpires = new Date(Date.now() + 120000);
        try{
        const user = await User.findOne({
           where: { username }
        })
        if (user) {
          user.verification_token = verificationToken;
          user.verification_token_expires = verificationTokenExpires;
          await user.save();
          console.info(`Updated user verification details for ${username}`);
      } else {
          console.error('User not found to update verification details');
      }
    }
      catch(dbError){
        console.error('Failed to update user verification details on DB:', dbError);
    }
  }
  try{
        await EmailLog.create({
          username: username,
          verificationLink: verificationUrl,
          status: emailStatus,
          errorMessage: errorMessage,
          sentDate: new Date(),
          messageId: response ? response.id : null
        });
        console.info(`Email event logged for ${username}`);
      } catch (logError) {

        console.error('Failed to insert email event to DB:', logError);
      }
})
