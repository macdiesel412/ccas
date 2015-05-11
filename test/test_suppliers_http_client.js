var assert = require('chai').assert;
var SuppliersHTTP = require('../util/suppliers_http_client');


describe('Suppliers_HTTP', function() {
    describe('get Nonce', function() {
        it('Should return a nonce token equal to ff6bfd673ab6ae03d8911', function(done) {
            SuppliersHTTP.rainerGetNonce()
                .then( function(token){
                    assert.equal(token, "ff6bfd673ab6ae03d8911");
                    done();
                });
        }),
            it('Should return a nonce of type String', function(done) {
                SuppliersHTTP.rainerGetNonce()
                    .then( function(token){
                        assert.typeOf(token, 'string');
                        done();
                    });
            })

    })

    describe('submit Rainer order', function() {
        it('Should return an order number', function(done) {
            SuppliersHTTP.submitRainerOrder('olympic','mtn').then( function(orderID){
                assert.typeOf(orderID, 'number')
                done();
            });
        })
    })

    describe('submit ACME order', function() {
        it('Should return an order number', function(done) {
            SuppliersHTTP.submitAcmeOrder('wile','std').then( function(orderID){
                assert.typeOf(orderID, 'number')
                done();
            });
        })
    })

    describe('create Rainer order', function() {
        it('Should return an order number', function(done) {
            SuppliersHTTP.createOrder('Rainer','olympic','mtn').then( function(orderID){
                assert.typeOf(orderID, 'number')
                done();
            });
        })
    })

    describe('create ACME order', function() {
        it('Should return an order number', function(done) {
            SuppliersHTTP.createOrder('ACME','wile','super').then( function(orderID){
                assert.typeOf(orderID, 'number')
                done();
            });
        })
    })

});