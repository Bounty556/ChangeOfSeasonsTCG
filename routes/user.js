const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('../passport');

router.post('/register', userController.createUser);

// TODO: I'm not sure how to validate passwords just yet because we need to save the passwords as hashed strings

router.post(
  '/login',
  (req, res, next) => next(),
  passport.authenticate('local'),
  (req, res) => res.send({ username: req.user.username })
);

router.get('/', (req, res, next) => res.json({ user: req.user || null }));

router.post('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.send({ msg: 'logging out' });
  } else {
    res.send({ msg: 'no user to log out' });
  }
});

module.exports = router;