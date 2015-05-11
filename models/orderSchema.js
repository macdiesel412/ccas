var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Model that represents an order sent to CCAS
 *
 * @constructor
 *
 */
var orderSchema = new Schema({
    customerID:     {type: Number, index: true, required: true},
    orderID:        {type: Number, index: true, required: true},
    make:           {type: String, required: true},
    model:          {type: String, required: true},
    package:        {type: String, required: true},
    createdDTTM:    {type: Date, default: Date.now},
    updatedDTTM:    {type: Date, default: Date.now}
});

var OrderSchema = mongoose.model('Order', orderSchema);

module.exports = OrderSchema;