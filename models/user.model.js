const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true},
    image: { type: String, required: true},
    places: [ { type: mongoose.Types.ObjectId,
        ref: 'Place', required: true } ]
});

module.exports = mongoose.model('User', UserSchema);