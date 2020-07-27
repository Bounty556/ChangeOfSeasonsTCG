const db = require('../models');

// TODO: There needs to be some sort of authentication to prevent normal users
// from being able to modify anything in this database. This should ever only
// be able to be updated by us as the developers

const Creatures = {
  addCreature: (creatureData) => {
    return new Promise((resolve, reject) => {
      db.Creature.create(creatureData, (err, result) => {
        if (err) reject(err);
        
        resolve(result);
      });
    });
  },

  removeCreatureByCardId: (cardId) => {
    return new Promise((resolve, reject) => {
      db.Creature.deleteOne({ cardId: cardId }, (err, result) => {
        if (err) reject(err);

        resolve(result);
      });
    });
  },

  getCreatureByCardId: (cardId) => {
    return new Promise((resolve, reject) => {
      db.Creature.findOne({ cardId: cardId }, (err, result) => {
        if (err) reject(err);

        resolve(result);
      });
    });
  },

  getCreaturesBySeason: (season) => {
    return new Promise((resolve, reject) => {
      db.Creature.find({ season: season }, (err, result) => {
        if (err) reject(err);

        resolve(result);
      });
    });
  }
};

module.exports = Creatures;