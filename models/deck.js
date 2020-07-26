const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeckSchema = new Schema({
    creatureIds: [{type: Number, required: true}], // Stores an array of creature Ids used in this deck, includes multiples
    spellIds: [{type: Number, required: true}],    // TODO: These may be strings... not sure how foreign keys work in MongoDB just yet
    date: {type: Date, default: Date.now}
});

const Deck = mongoose.model('Deck', DeckSchema);

module.exports = Deck;