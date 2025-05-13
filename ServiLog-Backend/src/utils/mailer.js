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

async function verificationMailer(accountEmail, accountId, accountName) {
    const textContent = `
        Hello, ${accountName}
        
        Thank you for registering at ServiLog, the trusted vehicle maintenance tracking platform.
        
        To activate your account, please click the following link:
        ${frontendUrl}/verify/${accountId}
        
        If you did not register for an account, please ignore this email.
        
        © 2025 ServiLog. Smart Maintenance, Smooth Journey.
    `;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Verification - ServiLog</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #ffffff;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #e6e6e6;
                border-radius: 8px;
                overflow: hidden;
            }
            .header {
                background-color: #FECB00;
                color: #D52B1E;
                text-align: center;
                padding: 20px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .body {
                padding: 20px;
            }
            .body p {
                margin: 0 0 15px;
                font-size: 16px;
                line-height: 1.5;
            }
            .button-container {
                text-align: center;
                margin: 20px 0;
            }
            .button {
                display: inline-block;
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                background-color: #D52B1E;
                padding: 15px 30px;
                border-radius: 8px;
                color: #ffffff !important;
                text-decoration: none !important;
            }
            .footer {
                text-align: center;
                font-size: 14px;
                color: #888;
                padding: 10px 20px;
                background-color: #f8f9fa;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <h1>Welcome to ServiLog!</h1>
            </div>
            <!-- Body -->
            <div class="body">
                <p>Hello, <strong>${accountName}</strong>!</p>
                <p>Thank you for registering at <strong>ServiLog</strong>, the trusted vehicle maintenance tracking platform.</p>
                <p>To activate your account, please click the button below:</p>
                <div class="button-container">
                    <a href="${frontendUrl}/verify/${accountId}" class="button">
                        Verify Account
                    </a>
                </div>
                <p>If you did not register for an account, please ignore this email.</p>
                <p>Best regards,<br>The ServiLog Team</p>
            </div>
            <!-- Footer -->
            <div class="footer">
                <p>&copy; 2025 ServiLog. Smart Maintenance, Smooth Journey.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: emailUser,
        to: accountEmail,
        subject: 'Account Verification for ServiLog',
        text: textContent,
        html: htmlContent
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Verification email sent to ${accountEmail}: ${info.messageId}`);
    } catch (error) {
        logger.error(`Failed to send verification email to ${accountEmail}:`, error);
    }
}

module.exports = { verificationMailer };