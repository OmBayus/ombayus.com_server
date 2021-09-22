require('dotenv').config()

const PORT = process.env.PORT || 4000
const MONGODB_URI = process.env.MONGODB_URI
const SESSION_SECRET = process.env.SESSION_SECRET
const EMAIL_NAME = process.env.EMAIL_NAME
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD


module.exports = {
  MONGODB_URI,
  PORT,
  SESSION_SECRET,
  EMAIL_NAME,
  EMAIL_PASSWORD,
}