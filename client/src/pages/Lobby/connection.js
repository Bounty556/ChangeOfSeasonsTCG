export default {
  socket: null,
  roomId: null,
  connected: false,

  init: function(gameSocket) {
    this.socket = gameSocket;

    this.socket.on('userJoined', this.updateLobby);
  },
  
  createNewGame: function() {
    // Create a unique Socket.IO Room
    this.joinRoom(Math.ceil(Math.random() * 100000));
  },
  
  joinRoom: function(id) {
    this.roomId = id.toString();

    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.socket.emit('joinRoom' + this.socket.id.toString(), this.roomId);
  },

  updateLobby: function(room) {
    // TODO: Update lobby info?
    this.connected = true;
    console.log('Welcome to room ' + room);
  }
}