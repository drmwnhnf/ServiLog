const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT,
  jwtKey: process.env.JWT_KEY,
  dbUrl: process.env.DATABASE_URL,
  frontendUrl: process.env.FRONTEND_URL,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
};