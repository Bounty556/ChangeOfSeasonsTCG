const db = require('../models');

// TODO: There needs to be some sort of authentication to prevent normal users
// from being able to modify anything in this database. This should ever only
// be able to be updated by us as the developers

const Cards = {
  addCard: (cardData) => {
    return new Promise((resolve, reject) => {
      db.Card.create(cardData, (err, result) => {
        if (err) reject(err);
        
        resolve(result);
      });
    });
  },

  removeCardByCardId: (cardId) => {
    return new Promise((resolve, reject) => {
      db.Card.deleteOne({ cardId: cardId }, (err, result) => {
        if (err) reject(err);

        resolve(result);
      });
    });
  },

  getCardByCardId: (cardId) => {
    return new Promise((resolve, reject) => {
      db.Card.findOne({ cardId: cardId }, (err, result) => {
        if (err) reject(err);

        resolve(result);
      });
    });
  },

  getCardsBySeason: (season) => {
    return new Promise((resolve, reject) => {
      db.Card.find({ season: season }, (err, result) => {
        if (err) reject(err);

        resolve(result);
      });
    });
  }
};

module.exports = Cards;