const router = require('express').Router();
const userRoutes = require('./user');
const lobbyRoutes = require('./lobby');

// API Routes
router.use('/api', userRoutes);
router.use('/api', lobbyRoutes);

module.exports = router;
