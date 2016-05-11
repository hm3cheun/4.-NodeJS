var express = require('express');
var promoRouter = express.Router();
var bodyParser = require('body-parser');
var Verify = require('./verify');
var Promo = require('../models/promotions');
promoRouter.use(bodyParser.json());
module.exports = promoRouter;

promoRouter.route('/') //index of promotiones


  .get(Verify.verifyOrdinaryUser, function (req, res, next) {
      Promo.find({}, function (err, promo) {
          if (err) throw err;
          res.json(promo);
      });
  })


  .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
      res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
  })

  .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin,function(req, res, next){
          res.end('Deleting all promotions');
  });

  promoRouter.route('/:id')
    .all(Verify.verifyOrdinaryUser,function(req,res,next) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        next();
      })

      .get(Verify.verifyOrdinaryUser, Verify.verifyAdmin,function(req,res,next){
          res.end('Will send details of the promotion: ' + req.params.id +' to you!');
      })

      .put(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function(req, res, next){
          res.write('Updating the promotion: ' + req.params.id + '\n');
          res.end('Will update the promotion: ' + req.body.name +
              ' with details: ' + req.body.description);
      })

      .delete(Verify.verifyOrdinaryUser,Verify.verifyAdmin,function(req, res, next){
          res.end('Deleting promotion: ' + req.params.id);
      });
