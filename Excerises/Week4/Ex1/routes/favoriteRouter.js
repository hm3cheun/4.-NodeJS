var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Dish = require('../models/dishes');
var Verify = require('./verify');
var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .all(Verify.verifyOrdinaryUser)
    .get(function (req, res, next) {

        Favorites.find({'postedBy': req.decoded._doc._id})
            .populate('postedBy')
            .populate('dishes')
            .exec(function (err, favorites) {
                if (err) return err;
                res.json(favorites);
            });
    })

.delete(function (req, res, next) {
          Favorites.remove({'postedBy': req.decoded._doc._id}, function (err, favorites) {
              if (err) throw err;
              res.json(favorites);
          })
})


.post(function (req, res, next) {

  Favorites.find({'postedBy': req.decoded._doc._id})
      .exec(function (err, favorites) {
          if (err) throw err;
          req.body.postedBy = req.decoded._doc._id;
          //res.json(favorites);
          if ( favorites.length > 0)
          {    var favorites_length = favorites[0].dishes.length;
               var duplicate = isduplicate(favorites[0], req.body._id);
               if( duplicate != -1){
                  favorites[0].dishes.push(req.body._id);
                  favorites[0].save(function (err, favorites) {
                  if (err) throw err;
                  console.log('adding to the list failed!');
                  res.json(favorites);
                  })
                }
                else
                {
                  console.log('duplicate');
                  res.json(favorites);
                }
        }
        else {
          Favorites.create({postedBy: req.body.postedBy}, function (err, favorites) {
                        if (err) throw err;
                        favorites.dishes.push(req.body._id);
                        favorites.save(function (err, favorites) {
                            if (err) throw err;
                            console.log('...somethin not right!');
                            res.json(favorites);
                        });
                    })
        }
  })
})


favoriteRouter.route('/:dishId')
    .all(Verify.verifyOrdinaryUser)
    .delete(function (req, res, next) {
        Favorites.find({'postedBy': req.decoded._doc._id}, function (err, favorites) {
            if (err) return err;
            //var favorite = favorites ? favorites[0] : null;

            if ( favorites.length >0 ){
                var index = isduplicate (favorites[0], req.params.dishId);
                if (index != -1){
                    favorites[0].dishes.remove(req.params.dishId);
                }
                favorites[0].save(function (err, favorites) {
                    if (err) throw err;
                    res.json(favorites);
                });
            }else {
              console.log('No dish in list!');
              res.json(favorites);
            }
          })
        })

/*
favoriteRouter.route('/:dishId')
    .all(Verify.verifyOrdinaryUser)
    .delete(function (req, res, next) {

        Favorites.find({'postedBy': req.decoded._doc._id}, function (err, favorites) {
            if (err) return err;
            var favorite = favorites ? favorites[0] : null;

            if (favorite) {
                for (var i = (favorite.dishes.length - 1); i >= 0; i--) {
                    if (favorite.dishes[i] == req.params.dishId) {
                        favorite.dishes.remove(req.params.dishId);
                    }
                }
                favorite.save(function (err, favorite) {
                    if (err) throw err;
                    console.log('Here you go!');
                    res.json(favorite);
                });
            } else {
                console.log('No favourites!');
                res.json(favorite);
            }

        });
    })
*/
function isduplicate(favorites_list, new_dish_id){
          for ( var i = 0 ;i < favorites_list.dishes.length;i++)
            {
                if (favorites_list.dishes[i] == new_dish_id)
                    return i;
            }
        return -1;
};


module.exports = favoriteRouter;
