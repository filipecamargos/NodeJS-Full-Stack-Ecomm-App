//Get Mongoose
const mongoose = require('mongoose');

//Intantiate a schema
const Schema = mongoose.Schema;


//set up a product schema
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Product', productSchema);