'use strict';

//
// Required libraries @{
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// @}

const ExamplesSchema = new Schema({
    name: {
        type: String,
        required: 'Item name'
    },
    description: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: 'tall'
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

const model = mongoose.model('examples', ExamplesSchema);
model.collection.createIndex({ '$**': 'text' }, { name: 'text' });

module.exports = model;