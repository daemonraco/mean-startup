'use strict';

//
// Required libraries @{
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// @}

var ExamplesSchema = new Schema({
    name: {
        type: String,
        required: 'Item name'
    },
    description: {
        type: String,
        default: ''
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('examples', ExamplesSchema);
