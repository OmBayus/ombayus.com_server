const router= require('express').Router()
const Order = require("../models/order")
const Product = require("../models/product")
const iyzipay = require("../utils/iyzipay")
const Iyzipay = require('iyzipay');

router.post("/pay",async(req,res)=>{
    const product = await Product.findById(req.body.product)

    const order = new Order({
        product:req.body.product,
        name:req.body.name,
        email:req.body.email,
        token:'',
        isPaid:false
    })

    order.save().then(item=>{
        var request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: '123456789',
            price: product.price,
            paidPrice: product.price,
            currency: Iyzipay.CURRENCY.TRY,
            basketId: 'B67832',
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: (process.env.NODE_ENV === "production"?("https://ombayuscom.herokuapp.com/api/order/checkout?order="+item.id):('http://localhost:4000/api/order/checkout?order='+item.id)),
            enabledInstallments: [2, 3, 6, 9],
            buyer: {
                id: 'BY789',
                name: 'John',
                surname: 'Doe',
                gsmNumber: '+905350000000',
                email: 'email@email.com',
                identityNumber: '74300864791',
                lastLoginDate: '2015-10-05 12:43:35',
                registrationDate: '2013-04-21 15:12:09',
                registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress ,
                city: 'Istanbul',
                country: 'Turkey',
                zipCode: '34732'
            },
            shippingAddress: {
                contactName: 'Jane Doe',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                zipCode: '34742'
            },
            billingAddress: {
                contactName: 'Jane Doe',
                city: 'Istanbul',
                country: 'Turkey',
                address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
                zipCode: '34742'
            },
            basketItems: [
                {
                    id: 'BI101',
                    name: 'Donate',
                    category1: 'Donate1',
                    category2: 'Donate2',
                    itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                    price: product.price
                }
            ]
        };

        iyzipay.checkoutFormInitialize.create(request, function (err, result) {
            if(result.status !== 'failure'){
                item.token = result.token
                item.save()
                res.json({paymentPageUrl:result.paymentPageUrl})
            }
            else{
                res.json({error:"error"})
            }
            
        });
    })
    .catch(err=>{
        res.json({error:err.message})
    })
})


router.post("/checkout",(req,res)=>{
    if(req.query.order){
        Order.findOne({_id:req.query.order},(err,order)=>{
            if(!err){
                if(order){
                    iyzipay.checkoutForm.retrieve({
                        locale: Iyzipay.LOCALE.TR,
                        conversationId: '123456789',
                        token: order.token
                    }, function (err, result) {
                        if(result.paymentStatus){
                            order.isPaid = true
                            order.save()
                            res.redirect(process.env.NODE_ENV === "production"?("https://www.ombayus.com/order/"+req.query.order):('http://localhost:3000/order/'+req.query.order));
                        }
                    });
                }
            }
        })
        
    }
    else if(req.body.order){
        Order.findOne({_id:req.body.order},(err,order)=>{
            if(!err){
                if(order){
                    iyzipay.checkoutForm.retrieve({
                        locale: Iyzipay.LOCALE.TR,
                        conversationId: '123456789',
                        token: order.token
                    }, async function (err, result) {
                        if(result.paymentStatus){
                            const product = await Product.findById(order.product)
                            order.isPaid = true
                            const data = Object.assign({}, order)._doc
                            data.success = true
                            data.product = product
                            order.save()
                            res.json(data);
                        }
                        else{
                            res.json({success:false})
                        }
                    });
                }
            }
        })
        
    }
    
    
})






module.exports = router