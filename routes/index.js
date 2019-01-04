var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('..//models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find(function(err, docs){
    var successMsg = req.flash('success')[0];
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { title: 'Shoping Cart', products: docs, successMsg: successMsg, noMessage: !successMsg});
  })
});

router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart? req.session.cart : {});

  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect('/');
    }
      cart.add(product, product.id);
      req.session.cart = cart;
      res.redirect('/');
  })
});

router.get('/shopping-cart', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/shopping-cart', {products: null});
  };
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', function(req, res, next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  };
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', function(req, res, next) {
  if(!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require('stripe')(
    "sk_test_DOW28UqifvgLZUPCim1R86KE"
  );
  
  
  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "idr",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge For fadlir93@gmail.com"
  }, function(err, charge) {
  // asynchronously called
    if(err) {
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id
    });
    order.save(function(err, result){
      if(err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
      }
      req.flash('success', 'successfully bought product!');
      req.session.cart = null;
      res.redirect('/');
    });
  });
})

module.exports = router;
