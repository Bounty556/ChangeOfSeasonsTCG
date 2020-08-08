const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const passport = require('passport');

router.post('/register', userController.createUser);

router.post(
  '/login',
  (req, res, next) => next(),
  passport.authenticate('local'),
  (req, res) => res.json(req.session.passport.user)
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

router.get('/login/user', (req, res) => {
  res.json(req.session.passport.user);
});

router.get('/user/:id', (req, res) => userController.getUser(req.params.id));

module.exports = router;