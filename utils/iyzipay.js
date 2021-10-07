const config = require("./config")
const Iyzipay = require('iyzipay');

var iyzipay = new Iyzipay({
    apiKey: config.IYZIPAY_APIKEY,
    secretKey: config.IYZIPAY_SECRETKEY,
    uri: 'https://sandbox-api.iyzipay.com'
});

module.exports = iyzipay