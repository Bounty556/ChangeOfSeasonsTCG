const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeckSchema = new Schema({
    cardId: [{type: Number , required: true}], // Stores an array of card Ids used in this deck, includes multiples
    date: {type: Date, default: Date.now}
});

const Deck = mongoose.model("Deck", DeckSchema);

module.exports = Deck;