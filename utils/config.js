require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI || secrets.MONGODB_URI
const SESSION_SECRET = process.env.SESSION_SECRET || secrets.SESSION_SECRET
const EMAIL_NAME = process.env.EMAIL_NAME || secrets.EMAIL_NAME
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || secrets.EMAIL_PASSWORD


module.exports = {
  MONGODB_URI,
  SESSION_SECRET,
  EMAIL_NAME,
  EMAIL_PASSWORD,
}
