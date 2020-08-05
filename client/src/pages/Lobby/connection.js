import axios from 'axios';

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
    const room = Math.ceil(Math.random() * 100000); 

    axios.post('/api/lobby/' + room.toString() + '/create')
      .then(() => {
        this.joinRoom(room);
      });
  },
  
  joinRoom: function(id) {
    this.roomId = id.toString();

    // Make sure this lobby exists before joining
    axios.get('/api/lobby/' + this.roomId + '/checkLobby')
      .then(result => {
        if (result.found) {
          // Add the current player to the lobby
          axios.put('/api/lobby/' + this.roomId + '/addPlayer')
            .then(() => {
              // Return the Room ID (gameId) to the browser client to be created
              this.socket.emit('joinRoom' + this.socket.id.toString(), this.roomId);
            })
        }
        else {
          this.roomId = null;
        }
      });
  },

  updateLobby: function() {
    // TODO: Update lobby info?
    axios.get('/api/lobby/' + this.roomId + '/getPlayerInfo')
      .then(info => {
        console.log(info);
        this.connected = true;
        // Let the front end know it needs to update
        this.socket.to(this.state.gameID.toString()).emit('updateFrontEnd', info);
      })
  }
}