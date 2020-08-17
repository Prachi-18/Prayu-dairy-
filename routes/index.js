var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var csurf = require('csurf');
var passport = require('passport');
var Cart = require('../models/cart');
const { Router } = require('express');
const Razorpay = require('razorpay');
var shortid = require('shortid');
var cors = require('cors');
const { app } = require('firebase');
const bodyParser = require('body-parser');
const fetch  = require('node-fetch');

router.use(bodyParser.json());

const razorpay = new  Razorpay({
  key_id:'rzp_test_2eJE3rP3gEWqze',
  key_secret:'CnLAonoJKeJDVKyoNn9jWrD0'
});

var csrfProtection = csurf();
router.use(csrfProtection);

router.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  var products = Product.find(function(err,docs){
    res.render('shop/index', { title: 'Modi\'s Dairy', products: docs});  
  });
  
});



router.get('/user/signup', function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0});
});



router.post('/user/signup', passport.authenticate('local.signup',{
  successRedirect: '/user/profile',
  failureRedirect:'/user/signup',
  failureFlash: true
  
}));



router.get('/user/profile', function(req,res,next){
  res.render('user/profile');
});

router.get('/user/signin', function(req,res,next){
  var messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0}); 
});

router.post('/user/signin', passport.authenticate('local.signin',{
  successRedirect: '/user/profile',
  failureRedirect:'/user/signin',
  failureFlash: true
  
}));



router.get('/add-to-cart/:id', function(req,res,next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart? req.session.cart : {});

  Product.findById(productId, function(err,product){
    if (err){
        console.log('Error!!!!!!!\n');
        return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });

});

router.get('/shopping-cart', function(req,res,next){
  if(! req.session.cart){
    return res.render('shop/shopping-cart', {products:null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
  
});

router.get('/checkout', function(req,res,next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', {csrfToken: req.csrfToken(), total:cart.totalPrice});
});

router.post('razorpay', async function(req,res,next){
  /*if(!req.session.cart){
    return res.redirect('/shopping-cart');
  } */
  var cart = new Cart(req.session.cart);
  
  const payment_capture = 1;
  const amount = cart.totalPrice;
  const currency = 'INR';

    const options = {
      amount: amount * 100,
      currency,
      receipt: shortid.generate(),
      payment_capture,
      
    }
  
    try {
      const response = await razorpay.orders.create(options);
     
      
      res.json({
        id: response.id,
        currency: response.currency,
        amount: response.amount
      }); s
     

      
    } catch (error) {
      console.log(error);
    }		
		
}); 




  
module.exports = router;

