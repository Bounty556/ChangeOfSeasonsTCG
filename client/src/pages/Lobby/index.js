import React, { Component } from 'react';
//Will be used to go to card lists and deck builder ~possibly friends list if implimented
// import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';
import socketIO from 'socket.io-client';
import Connection from './connection'; // The 'backend' for the lobby

import './lobby.css';

const ENDPOINT = 'http://localhost:3001/';

// TODO: when joinedMatch is true, that means we are currently in a room, and we should disable the ability to edit the gameId
// TODO: display the info of any users connected to the room

class Lobby extends Component {
  constructor() {
    super();
    this.state = {
      username_1: 'User 1',
      username_2: 'User 2',
      avatar1: '',
      avatar2: '',
      gameId: 0,
      joinedMatch: false
    };

    this.socket = null;
  }

  submitFunc = event => {
    event.preventDefault();
  };

  componentDidMount() {
    this.socket = socketIO(ENDPOINT);

    this.socket.on('connected', () => {
      Connection.init(this.socket);
    });

    this.socket.on('updateFrontEnd', info => {
      console.log(info);
      this.setState({ gameId: parseInt(Connection.roomId) });
      this.setState({ joinedMatch: Connection.connected });
    });
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  handleCreate = () => {
    Connection.createNewGame();
  };

  handleJoin = () => {
    Connection.joinRoom(this.state.gameId);
  };

  handleChangeJoinId = event => {
    this.setState({ gameId: parseInt(event.target.value || 0) });
  };

  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <div className='card animate__animated animate__slideInDown profileCard '>
            <div className='card-body'>
              {/* row displaying users */}
              <div className='players row'>
                <div className='playerOne'>
                  <h2>{this.state.username_1}</h2>
                  <img
                    src='https://via.placeholder.com/250
                                    '
                    alt='Player`s Chosen Avatar'
                    className='avatar'
                  ></img>
                </div>
                <h1 className='vs'>VS</h1>
                <div className='playerTwo'>
                  <h2>{this.state.username_2}</h2>
                  <img
                    src='https://via.placeholder.com/250
                                    '
                    alt='Player`s Chosen Avatar'
                    className='avatar'
                  ></img>
                </div>
              </div>

              <div className='row'>
                <input
                  className='game-input'
                  type='number'
                  value={this.state.gameId}
                  onChange={this.handleChangeJoinId}
                ></input>
              </div>

              <div className='row'>
                <div className='button-col'>
                  <br></br>
                  <br></br>
                  <button className='wood' onClick={this.handleJoin}>
                    Join Match
                  </button>
                  <button className='wood' onClick={this.handleCreate}>
                    Create Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

export default Lobby;
