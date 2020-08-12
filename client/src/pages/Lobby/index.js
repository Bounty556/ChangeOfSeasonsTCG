import React, { Component } from 'react';
//Will be used to go to card lists and deck builder ~possibly friends list if implemented
// import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';
import socketIO from 'socket.io-client';

import Gameboard from '../../components/GameBoard/index';

import axios from 'axios';

import './lobby.css';

const ENDPOINT = 'http://localhost:3001/';

// TODO: When in a lobby, show the 'Leave lobby' button
// TODO: Make leaving a lobby work
// TODO: Make sure both users have decks

// Socket io works via a back and forth of communication.
// 1. The user joins a lobby by telling the server to put it in the given room
// 2. The server then returns the playerNumber back to the client, and the client records this, as well as that it has successfully disconnected
// 3. The client sends a message to the server telling all clients in the room it has successfully connected, and that player info needs to be updated
// 4. All clients send back their player info to the room via the server, so all clients can update their local player information correctly

class Lobby extends Component {
  constructor() {
    super();
    this.state = {
      username1: (localStorage.getItem('username')),
      username2: 'Waiting for player',
      avatar1: (localStorage.getItem('avatar')),
      avatar2: 'blue_15.png',
      gameId: 0,
      joinedLobby: false,
      playGame: false,
      allJoined: false,
      playerNumber: -1
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
      this.socket.emit('room', this.state.gameId, 'playerLeft', this.state.playerNumber);

      this.socket.disconnect();
    }
  }

  handleChangeJoinId = event => {
    this.setState({ gameId: parseInt(event.target.value || 0) });
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
    this.setState({ joinedLobby: true, playerNumber: playerNumber }, () =>
      this.socket.emit('room', this.state.gameId, 'requestPlayerInfo')
    );
  };

  sendPlayerInfo = () => {
    // TODO: we shouldn't be returning the user password at all
    axios
      .get(
        '/api/user/' + JSON.parse(localStorage.getItem('authentication'))._id
      )
      .then(info => {
        const playerInfo = {
          username: info.data.username,
          avatar: info.data.avatar,
          number: this.state.playerNumber
        };
        this.socket.emit(
          'room',
          this.state.gameId,
          'receivePlayerInfo',
          playerInfo
        );
      })
      .catch(err => console.log(err));
  };

  updatePlayerInfo = playerInfo => {
    // Get player info
    if (playerInfo.number === 1) {
      this.setState(
        {
          username1: playerInfo.username,
          avatar1: playerInfo.avatar
        },
        () => {
          if (this.state.deck1.length > 0 && this.state.deck2.length > 0) {
            document.getElementById('loadingID').classList.remove('loading')
           this.setState({ allJoined: true });
          }
        }
      );
    } else if (playerInfo.number === 2) {
      this.setState(
        {
          username2: playerInfo.username,
          avatar2: playerInfo.avatar
        },
        () => {
          if (this.state.deck1.length > 0 && this.state.deck2.length > 0) {
            this.setState({ allJoined: true });
          }
        }
      );
    }
  };

  startMatch = () => {
    this.checkUser();

    this.setState({ playGame: true });
  };

  // Duplicate user check

  checkUser = () => {
    if (this.username1 === this.username2) {
      console.log('DUPLICATE USER DETECTED');
      this.exitGame();
    }

  };

  // Exit game should just redirect the user to the lobby
  exitGame = () => {
    window.location = '/lobby';
  };

  cleanUpPlayer = () => {
    this.setState({
      username1: 'User 1',
      username2: 'User 2',
      avatar1: '',
      avatar2: '',
      playerNumber: 1
    });

    this.sendPlayerInfo();

  }

  render() {
    return (
      <div>
        {!this.state.playGame ? (
          <div>
            <Navbar />
            <Container>
              <div className='card animate__animated animate__slideInDown profileCard'>
                <div className='card-body'>
                  {/* row displaying users */}
                  <div className='players row'>
                    <div className='playerOne'>
                      <h2>{this.state.username1}</h2>
                      <img
                        src={'./images/cardImg/' + this.state.avatar1}
                        alt='Player`s Chosen Avatar'
                        className='avatar'
                      ></img>
                    </div>

                    {!this.state.joinedLobby ? (<div></div>) : (
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

                  <div className='row'>
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

                  <div className='row'>
                    {!this.state.allJoined ? (
                      <div className='button-col'>
                        <button className='wood' onClick={this.joinLobby}>
                          Join Match
                        </button>
                        <button className='wood' onClick={this.createNewGame}>
                          Create Match
                        </button>
                      </div>
                    ) : (
                        <div className='button-col'>
                          <button className='wood' onClick={this.startMatch}>
                            Start Match
                        </button>
                          <button className='wood' onClick={this.exitGame}>
                            Exit Game
                        </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </Container>
          </div >
        ) : (

            <Gameboard />
          )}

      </div>
    );
  }
}

export default Lobby;
