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

router.put('/user/:id/avatar/:avatar', userController.setUserAvatar);

router.get('/login/user', (req, res) => {
  res.json(req.session.passport.user);
});

router.get('/user/:id', (req, res) => {
  return userController.getUser(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(422).json(err));
});

module.exports = router;