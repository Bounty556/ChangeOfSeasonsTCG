const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeckSchema = new Schema({
    userid: {type: Number, required: true},
    cardId: {type: Number , required: true},
    date: { type: Date, default: Date.now }
});

const Deck = mongoose.model("Deck", DeckSchema);

module.exports = Deck