const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deck = new Schema({
    userid: {type: Number, required: true},
    cardId: {type: Number , required: true},
    date: { type: Date, default: Date.now }
});

const Book = mongoose.model("deck", deck);

module.exports = deck