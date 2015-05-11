var config = require('config');
var querystring = require('querystring');
var rp = require('request-promise');
var Q = require('q');

module.exports = {
    /**
     * Calls out to external web services to create orders. Uses the Make to decide which vendor's web
     * service to use
     *
     * @param {string} make - Make of the automobile.
     * @param {string} model - Model of the automobile
     * @param {string} pkg - The trim package of the automobile
     *
     * @returns {Number} - The order ID number as placed with the vendor
     */
    createOrder: function(make, model, pkg) {
        switch(make.toUpperCase()){
            case 'ACME':
                return this.submitAcmeOrder(model, pkg);
                break;
            case 'RAINER':
                return this.submitRainerOrder(model, pkg);
                break;
            default:
                throw new Error('Unknown make');
        }
    },

    /**
     * Submits orders to the Rainer auto supplier
     *
     * @param {string} model - Model of the automobile
     * @param {string} pkg - The trim package of the automobile
     *
     * @returns {Promise} - the promise function will be sent an orderID of type Number
     */
    submitRainerOrder: function(model, pkg) {
        var deferred = Q.defer();
        //fetch the nonce token
        this.rainerGetNonce()
            .then(function(token) {
                var options = {
                    method: 'POST',
                    uri: config.get('suppliers.RAINER.url') + config.get('suppliers.RAINER.order_endpoint'),
                    form: querystring.stringify({'token': token, 'model': model, 'custom': pkg})
                };
                return options;
            })
            .then(function(options) {
                rp(options)
                    .then(function(response){
                        //console.log(response);
                        response = JSON.parse(response);
                        deferred.resolve(response.order_id);
                    })
                    .catch(function(err) {
                        console.error(err);
                        deferred.reject(err);
                    });
            });

        return deferred.promise;
    },

     /**
     * Retreives the nonce authentication token from the Rainer Auto group API
     *
     * @returns {Promise} - the promise function will be sent the nonce as a String
     */
    rainerGetNonce: function() {
        var deferred = Q.defer();
        var options = {
            method: 'GET',
            uri: config.get('suppliers.RAINER.url') + config.get('suppliers.RAINER.nonce_endpoint'),
            qs: {'storefront': config.get('suppliers.RAINER.storefront_id')}
        };
        rp(options)
            .then(function(response) {
                //console.log(response);
                response = JSON.parse(response);
                deferred.resolve(response.nonce_token);
            })
            .catch(function(err) {
                console.error(err);
                deferred.reject(err);
            });
        return deferred.promise;
    },

    /**
     * Submits orders to the ACME auto supplier
     *
     * @param {string} model - Model of the automobile
     * @param {string} pkg - The trim package of the automobile
     *
     * @returns {Promise} - the promise function will be sent an orderID of type Number
     */
    submitAcmeOrder: function(model, pkg) {
        var deferred = Q.defer();
        var options = {
            method: 'POST',
            uri: config.get('suppliers.ACME.url') + config.get('suppliers.ACME.order_endpoint'),
            form: querystring.stringify({'api_key': config.get('suppliers.ACME.api_key'), 'model': model, 'package': pkg})
        };
        rp(options)
            .then(function(response) {
                //console.log(response);
                response = JSON.parse(response);
                deferred.resolve(response.order);
            })
            .catch(function(err) {
                console.error(err);
                deferred.reject(err);
            });
        return deferred.promise;
    }
}