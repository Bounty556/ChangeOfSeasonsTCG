import React, { Component } from 'react';
//Will be used to go to card lists and deck builder ~possibly friends list if implimented
// import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';
import Card from '../../components/Card/index';
import socketIO from 'socket.io-client';

import axios from 'axios';

import './lobby.css';
import './gameboard.css';

const ENDPOINT = 'http://localhost:3001/';

// TODO: When 2 people are in a lobby, show the 'play game button'
// TODO: When in a lobby, show the 'Leave lobby' button

class Lobby extends Component {
  constructor() {
    super();
    this.state = {
      username1: 'User 1',
      username2: 'User 2',
      avatar1: '',
      avatar2: '',
      gameId: 0,
      joinedMatch: false,
      playGame: false
    };

    this.socket = null;
  }

  submitFunc = event => {
    event.preventDefault();
  };

  componentDidMount() {
    this.socket = socketIO(ENDPOINT);

    this.socket.on('connected', () => {
      const that = this;
      this.socket.on('userJoined', () => this.updateLobby(that));
      this.socket.on('userLeft', () => this.updateLobby(that));
    });
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  handleChangeJoinId = event => {
    this.setState({ gameId: parseInt(event.target.value || 0) });
  };

  createNewGame = () => {
    // Create a unique Socket.IO Room
    const room = Math.ceil(Math.random() * 100000);
    this.setState({ gameId: room }, () => {
      axios.post('/api/lobby/' + this.state.gameId + '/create').then(() => this.joinLobby())
    });
  };

  joinLobby = () => {
    axios
      .get('/api/lobby/' + this.state.gameId + '/checkLobby')
      .then(result => {
        // Make sure this lobby exists before joining
        if (result.data.found && localStorage.getItem('authentication')) {
          // Add the current player to the lobby
          axios
            .put('/api/lobby/' + this.state.gameId + '/addPlayer/' + JSON.parse(localStorage.getItem('authentication'))._id)
            .then(() => {
              // Return the Room ID (gameId) to the browser client to be joined
              this.socket.emit('joinRoom', this.state.gameId);
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  };

  updateLobby = self => {
    axios
      .get('/api/lobby/' + self.state.gameId + '/getPlayerInfo')
      .then(info => {
        if (info.data[0]) {
          self.setState({
            username1: info.data[0].username,
            avatar1: info.data[0].avatar
          });
        }

        if (info.data[1]) {
          self.setState({
            username2: info.data[1].username,
            avatar2: info.data[1].avatar
          });
        }

        self.setState({ joinedMatch: true });
      })
      .catch(err => console.log(err));
  };

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
                    <h1 className='vs'>VS</h1>
                    <div className='playerTwo'>
                      <h2>{this.state.username2}</h2>
                      <img
                        src={'./images/cardImg/' + this.state.avatar2}
                        alt='Player`s Chosen Avatar'
                        className='avatar'
                      ></img>
                    </div>
                  </div>

                  <div className='row'>
                    {!this.state.joinedMatch ? (
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
                    <div className='button-col'>
                      <br></br>
                      <br></br>
                      <button className='wood' onClick={this.joinLobby}>
                        Join Match
                      </button>
                      <button className='wood' onClick={this.createNewGame}>
                        Create Match
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        ) : (
          <div>
            <div className='wrapper'>
              <div id='opponentRow'>
                {/* Opponent's Graveyard*/}
                <Card id='opponentGrave'>
                  <h6>Opponent Graveyard</h6>
                </Card>

                {/* Opponent's Deck */}
                <Card id='opponentDeck'>
                  <h6>Opponent Deck</h6>
                </Card>

                {/* Opponent's Play area */}
                <Card id='opponentPlayArea'>
                  <h4>Opponent Play Area</h4>
                </Card>
              </div>

              {/* Defense Row */}
              <div id='opponentDefRow'>
                <Card id='opponentDef1'>
                  <h6>Opponent Defense 1</h6>
                </Card>
                <Card id='opponentDef2'>
                  <h6>Opponent Defense 2</h6>
                </Card>
              </div>

              {/* Attack Row */}
              <div id='opponentAttRow'>
                <Card id='opponentAtt1'>
                  <h6>Opponent Attack 1</h6>
                </Card>
                <Card id='opponentAtt2'>
                  <h6>Opponent Attack 2</h6>
                </Card>
                <Card id='opponentAtt3'>
                  <h6>Opponent Attack 3</h6>
                </Card>
              </div>
            </div>

            <hr />

            <div className='wrapper'>
              <div id='userAttRow'>
                <Card id='userAtt1'>
                  <h6>User Attack 1</h6>
                </Card>
                <Card id='userAtt2'>
                  <h6>User Attack 2</h6>
                </Card>
                <Card id='userAtt3'>
                  <h6>User Attack 3</h6>
                </Card>
              </div>

              <div id='userDefRow'>
                <Card id='userDef1'>
                  <h6>User Defense 1</h6>
                </Card>
                <Card id='userDef2'>
                  <h6>User Defense 2</h6>
                </Card>
              </div>

              <div id='userRow'>
                {/* User's Graveyard*/}
                <Card id='userGrave'>
                  <h6>User Graveyard</h6>
                </Card>

                {/* User's Deck */}
                <Card id='userDeck'>
                  <h6>User Deck</h6>
                </Card>

                {/* User's Play area */}
                <Card id='userPlayArea'>
                  <h4>User Play Area</h4>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Lobby;
