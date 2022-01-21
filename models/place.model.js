const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId,
        ref: 'User', required: true }
});

module.exports = mongoose.model('Place', PlaceSchema);