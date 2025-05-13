const nodemailer = require('nodemailer');
const { emailUser, emailPass, frontendUrl } = require('../configs/env');
const logger = require('./logger');
const { log } = require('winston');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

async function sendEmail(to, subject, textContent, htmlContent) {
    const mailOptions = {
        from: emailUser,
        to: to,
        subject: subject,
        text: textContent,
        html: htmlContent
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Email for "${subject}" sent to ${to}: ${info.messageId}`);
        return true;
    } catch (error) {
        logger.error(`Failed to send email for "${subject}" to ${to}:`, error);
        return false;
    }
}

module.exports = { sendEmail };