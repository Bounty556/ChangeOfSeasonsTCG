const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');

router.get('/', (req, res, next) => res.json({ user: req.user || null }));

router.get('/login/user', (req, res) => {
  res.json(req.session.passport.user);
});

router.get('/user/:id', (req, res) => {
  return userController.getUser(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(422).json(err));
});

router.get('/user/:id/deck', userController.getDeck);

router.post('/register', userController.createUser);

router.post(
  '/login',
  (req, res, next) => next(),
  passport.authenticate('local'),
  (req, res) => res.json(req.session.passport.user)
);

router.post('/logout', (req, res) => {
  if (req.user) {
    req.logout();
    res.send({ msg: 'logging out' });
  } else {
    res.send({ msg: 'no user to log out' });
  }
});

router.put('/user/:id/avatar/:avatar', userController.setUserAvatar);

router.put('/user/:id/deck/:season', userController.setDeck);

router.put('/user/:id/win', userController.addWin);

router.put('/user/:id/loss', userController.addLoss);

module.exports = router;