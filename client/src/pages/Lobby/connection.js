import axios from 'axios';

export default {
  socket: null,
  roomId: null,
  connected: false,

  init: function(gameSocket) {
    this.socket = gameSocket;

    const that = this;
    this.socket.on('userJoined', () => this.updateLobby(that));
  },
  
  createNewGame: function() {
    // Create a unique Socket.IO Room
    const room = Math.ceil(Math.random() * 100000); 
    this.roomId = room.toString();

    axios.post('/api/lobby/' + room.toString() + '/create')
      .then(() => {
        this.joinRoom(room);
      });
  },
  
  joinRoom: function(id) {
    this.roomId = id;
    return axios.get('/api/lobby/' + id + '/checkLobby')
      .then(result => {
        // Make sure this lobby exists before joining
        if (result.data.found) {
          // Add the current player to the lobby
          axios.put('/api/lobby/' + id + '/addPlayer')
            .then(() => {
              // Return the Room ID (gameId) to the browser client to be created
              this.socket.emit('joinRoom', id);
            })
            .catch((err) => {
              console.log(err);
              this.roomId = null;
            });
        } else {
          this.roomId = null;
        }
      })
      .catch(err => {
        console.log(err);
      });
  },

  updateLobby: function(self) {
    axios.get('/api/lobby/' + self.roomId + '/getPlayerInfo')
      .then(info => {
        self.connected = true;
        // Let the front end know it needs to update
        self.socket.emit('room', { room: self.roomId, msg: 'updateFrontEnd', info: info });
      })
      .catch(err => {
        console.log(err);
      });
  }
}