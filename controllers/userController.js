const db = require('../models');

const Users = {
  getUser: (id) => {
    return new Promise((resolve, reject) => {
      db.User.findById(id, (err, result) => {
        if (err) reject(err);
        
        resolve(result);
      });
    });
  },

  createUser: (userData) => {
    return new Promise((resolve, reject) => {
      db.User.create(userData, (err, result) => {
        if (err) reject(err);

        resolve(result);
      });
    });
  },

  setUserAvatar: (id, avatar) => {
    return new Promise((resolve, reject) => {
      db.User.updateOne({id: id}, {avatar: avatar}, (err, result) => {
        if (err) reject(err);

        resolve(result);
      });
    });
  }
};

module.exports = Users;