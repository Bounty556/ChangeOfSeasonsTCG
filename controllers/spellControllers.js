const db = require('../models');

// TODO: There needs to be some sort of authentication to prevent normal users
// from being able to modify anything in this database. This should ever only
// be able to be updated by us as the developers

const Spells = {
  addSpell: (spellData) => {
    return new Promise((resolve, reject) => {
      db.Spell.create(spellData, (err, result) => {
        if (err) reject(err);
        
        resolve(result);
      });
    });
  },

  removeSpellByCardId: (cardId) => {
    return new Promise((resolve, reject) => {
      db.Spell.deleteOne({ cardId: cardId }, (err, result) => {
        if (err) reject(err);

        resolve(result);
      });
    });
  },

  getSpellByCardId: (cardId) => {
    return new Promise((resolve, reject) => {
      db.Spell.findOne({ cardId: cardId }, (err, result) => {
        if (err) reject(err);

        resolve(result);
      });
    });
  },

  getSpellsBySeason: (season) => {
    return new Promise((resolve, reject) => {
      db.Spell.find({ season: season }, (err, result) => {
        if (err) reject(err);

        resolve(result);
      });
    });
  }
};

module.exports = Spells;