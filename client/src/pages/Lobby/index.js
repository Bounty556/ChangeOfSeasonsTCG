import React, { Component, createContext } from 'react';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';
import Gameboard from '../../components/GameBoard/index';

import socketIO from 'socket.io-client';
import axios from 'axios';

import Modal from 'react-bootstrap/Modal';

import './lobby.css';

const ENDPOINT = (process.env.NODE_ENV === 'development') ? 'http://localhost:3001' : '';

export const GameContext = createContext({
  socket: null,
  gameId: null,
  deck: null,
  playerNumber: null
});

// Socket io works via a back and forth of communication.
// 1. The user joins a lobby by telling the server to put it in the given room
// 2. The server then returns the playerNumber back to the client, and the client records this, as well as that it has successfully disconnected
// 3. The client sends a message to the server telling all clients in the room it has successfully connected, and that player info needs to be updated
// 4. All clients send back their player info to the room via the server, so all clients can update their local player information correctly

class Lobby extends Component {
  constructor() {
    super();
    this.state = {
      username1: localStorage.getItem('username'),
      username2: 'Waiting for player',
      avatar1: localStorage.getItem('avatar'),
      avatar2: 'blue_15.png',
      joined1: false,
      joined2: false,
      deck: [],
      gameId: 0,
      joinedLobby: false,
      showJoin: false,
      playGame: false,
      allJoined: false,
      playerNumber: -1,
      showModal: false
    };

    this.socket = null;
  }

  submitFunc = event => {
    event.preventDefault();
  };

  componentDidMount() {
    this.socket = socketIO(ENDPOINT);

    this.socket.on('requestPlayerInfo', this.sendPlayerInfo);
    this.socket.on('receivePlayerInfo', this.updatePlayerInfo);
    this.socket.on('playerLeft', this.cleanUpPlayer);
  }
  
  componentWillUnmount() {
    // Check if we're connected
    if (this.state.joinedLobby) {
      // Tell the server that we're disconnecting
      this.socket.emit(
        'room',
        this.state.gameId,
        'playerLeft',
        this.state.playerNumber
        );
        
        this.socket.disconnect();
      }
    }
    
    handleChangeJoinId = event => {
      const gameIdNumber = parseInt(event.target.value);

      if (gameIdNumber > 0) {
        this.setState({ 
          gameId: parseInt(event.target.value || 0),
          showJoin: true
        });
      } else {
        this.setState({
          gameId: 0,
          showJoin: false
        })
      }
    };
    
    createNewGame = () => {
      // Create a unique Socket.IO Room
      const room = Math.ceil(Math.random() * 100000);
      this.setState({ gameId: room }, () => this.joinLobby());
    };
    
    joinLobby = () => {
      // Make sure we're authenticated
      if (localStorage.getItem('authentication')) {
        this.socket.emit('joinRoom', this.state.gameId, this.setThisPlayersInfo);
      }
    };
    
    setThisPlayersInfo = playerNumber => {
      this.setState({ joinedLobby: true, playerNumber: playerNumber }, () => {
        if (playerNumber === 2) {
          this.socket.on('startGame', this.startMatch);
        }
        this.socket.emit('room', this.state.gameId, 'requestPlayerInfo')
      }
    );
  };

  sendPlayerInfo = () => {
    axios
      .get(
        '/api/user/' +
          JSON.parse(localStorage.getItem('authentication'))._id +
          '/deck'
      )
      .then(info => {
        // Make sure this user has a deck that isn't empty
        if (info.data && info.data.length === 0) {
          console.log('Error: you need to select a deck first.');
          return this.setState({
            showModal: true
          });
        }

        // set our deck
        this.setState({ deck: info.data });

        const playerInfo = {
          username: localStorage.getItem('username'),
          avatar: localStorage.getItem('avatar'),
          number: this.state.playerNumber
        };
        this.socket.emit(
          'room',
          this.state.gameId,
          'receivePlayerInfo',
          playerInfo
        );
      })
      .catch(() => {
        console.log('Error: could not find deck info');
        this.setState({
          showModal: true
        });
      });
  };

  updatePlayerInfo = playerInfo => {
    // Get player info
    if (playerInfo.number === 1) {
      this.setState(
        {
          username1: playerInfo.username,
          avatar1: playerInfo.avatar,
          joined1: true
        },
        () => {
          if (this.state.joined1 && this.state.joined2) {
            document.getElementById('loadingID').classList.remove('loading');
            this.setState({ allJoined: true });
          }
        }
      );
    } else if (playerInfo.number === 2) {
      this.setState(
        {
          username2: playerInfo.username,
          avatar2: playerInfo.avatar,
          joined2: true
        },
        () => {
          if (this.state.joined1 && this.state.joined2) {
            document.getElementById('loadingID').classList.remove('loading');
            this.setState({ allJoined: true });
          }
        }
      );
    }
  };

  startMatch = () => {
    if (process.env.NODE_ENV !== 'development') {
      this.checkUser();
    }

    // If we're hosting we need to let the other player's browser know to start the game too
    if (this.state.playerNumber === 1) {
      this.socket.emit('room', this.state.gameId, 'startGame');
    }

    const startBtnRow = document.getElementById('startRow');
    const gameIdRow = document.getElementById('gameIdRow');
    const mainCard = document.getElementById('profileCard');
    const avatar1 = document.getElementById('avatar1');
    const avatar2 = document.getElementById('loadingID');
    
    startBtnRow.classList.add('animate__animated', 'animate__bounceOut');
    gameIdRow.classList.add('animate__animated', 'animate__bounceOut');

    startBtnRow.addEventListener('animationend', () => {
      startBtnRow.style.display = 'none';
      gameIdRow.style.display = 'none';

      setTimeout(() => {
        avatar1.classList.add('animate__animated', 'animate__heartBeat');

        avatar1.addEventListener('animationend', () => {
          avatar2.classList.add('animate__animated', 'animate__heartBeat');

          avatar2.addEventListener('animationend', () => {
            mainCard.classList.replace('animate__slideInDown', 'animate__bounceOut');

            setTimeout(() => {
              this.setState({ playGame: true });
            }, 1000);
          });
        });
      }, 500);
    });
  };

  // Duplicate user check
  checkUser = () => {
    if (this.state.username1 === this.state.username2) {
      this.exitGame();
    }
  };

  // Exit game should just redirect the user to the lobby
  exitGame = () => {
    window.location = '/lobby';
  };

  cleanUpPlayer = () => {
    this.setState({
      username1: localStorage.getItem('username'),
      username2: 'Waiting for player',
      avatar1: localStorage.getItem('avatar'),
      avatar2: 'blue_15.png',
      deck: [],
      playerNumber: 1,
      joined1: true,
      joined2: false,
      allJoined: false
    });

    if (!this.state.playGame) {
      document.getElementById('loadingID').classList.add('loading');
    } else {
      axios.put(`/api/user/${JSON.parse(localStorage.getItem('authentication'))._id}/win`)
      .then(() => {
        window.location.reload();
      })
    }
    this.socket.off('startGame');
    this.sendPlayerInfo();
  };

  render() {
    return (
      <div>
        {!this.state.playGame ? (
          <div>
            <Navbar />
            <Container>
              <div className='card animate__animated animate__slideInDown profileCard' id='profileCard'>
                <div className='card-body'>
                  {/* row displaying users */}
                  <div className='players row'>
                    <div className='playerOne'>
                      <h2>{this.state.username1}</h2>
                      <img
                        src={'./images/cardImg/' + this.state.avatar1}
                        alt='Player`s Chosen Avatar'
                        className='avatar'
                        id='avatar1'
                      ></img>
                    </div>

                    {!this.state.joinedLobby ? (
                      <div></div>
                    ) : (
                      <div className='players'>
                        <h1 className='vs'>VS</h1>
                        <div className='playerTwo'>
                          <h2>{this.state.username2}</h2>
                          <img
                            src={'./images/cardImg/' + this.state.avatar2}
                            alt='Player`s Chosen Avatar'
                            className='avatar loading'
                            id='loadingID'
                          ></img>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='row' id='gameIdRow'>
                    {!this.state.joinedLobby ? (
                      <input
                        className='game-input hide'
                        type='number'
                        value={this.state.gameId}
                        onChange={this.handleChangeJoinId}
                      ></input>
                    ) : (
                      <p className='gameIdText'>{this.state.gameId}</p>
                    )}
                  </div>
                  <div className='row' id='startRow'>
                    {!this.state.joinedLobby ? (
                      <div className='button-col'>
                        {this.state.showJoin ? (
                          <button className='wood animate__animated animate__bounceIn' onClick={this.joinLobby}>
                            Join Match
                          </button>
                        ) : (
                          <></>
                        )}
                        <button className='wood' onClick={this.createNewGame}>
                          Create Match
                        </button>
                      </div>
                    ) : (
                      <div className='button-col'>
                        {this.state.playerNumber === 1 && this.state.allJoined ? (
                          <button className='wood animate__animated animate__bounceIn' onClick={this.startMatch}>
                            Start Match
                          </button>
                        ) : (this.state.playerNumber === 2 ? (
                          <p>Waiting on host to start match.</p>
                        ) : (
                          <></>
                        ))}
                        <button className='wood' onClick={this.exitGame}>
                          Exit Game
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Modal */}
              <Modal className='errorModal' show={this.state.showModal}>
                {/* Body */}
                <Modal.Body className='modalBody'>
                  <p>
                    Looks like you haven't choosen a deck yet. Head to your
                    profile and select "Choose Deck" to play!
                  </p>
                </Modal.Body>

                {/* Footer */}
                <Modal.Footer>
                  <button
                    className='btn btn-primary errorBtn'
                    onClick={() => (window.location = '/Profile')}
                  >
                    Head to Profile
                  </button>
                </Modal.Footer>
              </Modal>
            </Container>
          </div>
        ) : (
          <GameContext.Provider
            value={{
              socket: this.socket,
              gameId: this.state.gameId,
              deck: this.state.deck,
              playerNumber: this.state.playerNumber
            }}
          >
            <Gameboard />
          </GameContext.Provider>
        )}
      </div>
    );
  }
}

export default Lobby;
