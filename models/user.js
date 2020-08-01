const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    avatar: {type: String, default: 'cyclop_01.png'},
    wins: {type: Number, default: 0},
    losses: {type: Number, default: 0},
    cardIds: [{type: Number, required: false}]                // User's deck
});

const User = mongoose.model('User', UserSchema);

module.exports = User;