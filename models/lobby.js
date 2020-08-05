const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LobbySchema = new Schema({
  roomId: {type: Number, required: true},
  isPlaying: {type: Boolean, default: false},
  players: [{type: Schema.Types.ObjectId}]
});

const Lobby = mongoose.model('Lobby', LobbySchema);

module.exports = Lobby;