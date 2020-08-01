const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CreatureSchema = new Schema({
    season: {type: String, required: true},
    cardId: {type: Number, required: true},
    resourceCost: {type: Number, required: true},
    attack: {type: Number, required: true},
    health: {type: Number, required: true},
    effect: {type: String},
    name: {type: String, required: true},
    img: {type: String, required: true}
});

const Creature = mongoose.model('Creature', CreatureSchema);

module.exports = Creature;