const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    season: {type: String, required: true},
    cardId: {type: Number, required: true, unique: true},
    isCreature: {type: Boolean, required: true},      // True if this is a creature, false if this is a spell
    resourceCost: {type: Number, required: true},
    attack: {type: Number, required: true},
    health: {type: Number},                           // Health doesn't need to be required, since spells won't have health
    effect: {type: String, default: ''},
    effectScript: {type: String, default: ''},
    name: {type: String, required: true},
    img: {type: String, required: true}
});

const Card = mongoose.model('Card', CardSchema);

module.exports = Card;