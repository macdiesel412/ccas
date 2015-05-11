var express = require('express');
var router = express.Router();
var _ = require('lodash');
var util = require("util");
var OrderSchema = require('../models/orderSchema');
var SuppliersInterface = require('../util/suppliers_http_client');
var config = require('config');

router.route('/order')
    .post(function(req, res, next) {
        // I would like to have a bit better validation here so we don't have to check twice
        // but I have left it off due to time constraints
        req.body.make = req.body.make.toUpperCase();
        var MAKES = Object.keys(config.get('suppliers'));
        var MODELS = config.get(util.format('suppliers.%s.models', req.body.make.toUpperCase()));
        var PACKAGES = config.get(util.format('suppliers.%s.packages', req.body.make.toUpperCase()));

        req.checkBody('make', util.format('Unknown Make %s Must be one of: %s', req.body.make, MAKES)).isIn(MAKES);

        // Ensure that the Make is set correctly
        var errors = req.validationErrors();
        if(errors) {
            respondBadParam(req, res, errors);
            return;
        }

        // Now we can validate the remainder
        req.checkBody('model', util.format('Model must be one of %s',  MODELS)).isIn(MODELS);
        req.checkBody('package', util.format('Custom must be one of %s', PACKAGES)).isIn(PACKAGES);
        req.checkBody('customer_id', 'Request must include a valid customer_id').notEmpty();
        var errors = req.validationErrors();
        if(errors) {
            respondBadParam(req, res, errors);
            return;
        }

        // Promises Promises...
        SuppliersInterface.createOrder(req.body.make, req.body.model, req.body.package)
            .then(function(orderID) {
                console.log("Successfully created order with manufacturer, saving data");
                var order = new OrderSchema({
                    customerID:     req.body.customer_id,
                    orderID:        orderID,
                    make:           req.body.make,
                    model:          req.body.model,
                    package:        req.body.package
                });
                return order;
            })
            .then(function(order) {
                return order.save();
            })
            .then(function(order){
                res.status(200).json({'order_id':order.orderID});
            })
            .catch(function(err) {
                console.log(err);
                res.status(500).json({'message':'something went really wrong'});
            });
    }

// Chaining together the verbs for this route to avoid typos
).get(function(req, res, next) {
        orders = OrderSchema.find().select("customerID orderID make model package createdDTTM updatedDTTM -_id")
            .exec(function(err, orders){
                if(err) res.status(500).json({'message':'something went wrong!'});
                else res.status(200).json(orders);
            });
    });


function respondBadParam(req, res, errors) {
    res.code = 400;
    res.json({"message":errors}, res.code);
}

module.exports = router;
