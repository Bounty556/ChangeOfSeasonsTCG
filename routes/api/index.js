const router = require('express').Router();
const userRoutes = require('./user');
const lobbyRoutes = require('./lobby');

// API Routes
router.use('/', userRoutes);
router.use('/', lobbyRoutes);

module.exports = router;
