const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    season: {type: String, required: true},
    cardId: {type: Number, required: true},
    cardType: {type: String, required: true},    // Should be 'Creature' or 'Spell'
    resourceCost: {type: Number, required: true},
    attack: {type: Number, required: true},
    health: {type: Number},                      // Health doesn't need to be required, since spells won't have health
    effect: {type: String},
    name: {type: String, required: true},
    img: {type: String, required: true}
});

const Card = mongoose.model('Card', CardSchema);

module.exports = Card;