const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const lobbyController = require('../../controllers/lobbyController');

router.post('/lobby/:roomId/create', lobbyController.createLobby);

router.put('/lobby/:roomId/addPlayer', lobbyController.addPlayer);

router.put('/lobby/:roomId/removePlayer/:playerId', lobbyController.removePlayer);

router.get('/lobby/:roomId/getPlayerInfo', (req, res) => {
  lobbyController.getLobby(req.params.roomId)
    .then(lobby => {
      // Get the info from the players listed in the lobby
      const players = [];
      for (let i = 0; i < lobby.players.length; i++) {
        userController.getUser(lobby.players[i])
          .then(user => {
            players.push({ username: user.username, avatar: user.avatar, deck: user.cardIds });
            if (players.length === lobby.players.length) {
              res.json(players);
            }
          });
      }
    });
});

router.get('/lobby/:roomId/checkLobby', (req, res) => {
  lobbyController.getLobby(req.params.roomId)
    .then(lobby => {
      if (lobby) {
        res.json({ found: true });
      }
      else {
        res.json({ found: false });
      }
    });
});

module.exports = router;
