const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpellSchema = new Schema({
    season: {type: String, required: true},
    cardId: {type: Number, required: true},
    resourceCost: {type: Number, required: true},
    attack: {type: Number, required: true},
    effect: {type: String},
    name: {type: String, required: true},
    img: {type: String, required: true}
});

const Spell = mongoose.model("Spell", SpellSchema);

module.exports = Spell;