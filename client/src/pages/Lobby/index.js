import React, { Component } from 'react';
//Will be used to go to card lists and deck builder ~possibly friends list if implimented
// import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';
import socketIO from 'socket.io-client';
import Connection from './connection'; // The 'backend' for the lobby

import './lobby.css';

const ENDPOINT = 'http://localhost:3001/';

class Lobby extends Component {
  constructor() {
    super();
    this.state = {
      username1: 'User 1',
      username2: 'User 2',
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
      if (info.data[0]) {
        this.setState({
          username1: info.data[0].username,
          avatar1: info.data[0].avatar
        });
      }

      if (info.data[1]) {
        this.setState({
          username2: info.data[1].username,
          avatar2: info.data[1].avatar
        });
      }

      this.setState({
        gameId: parseInt(Connection.roomId),
        joinedMatch: Connection.connected
      });
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
                {!this.state.joinedMatch ? (<input
                  className='game-input hide'
                  type='number'
                  value={this.state.gameId}
                  onChange={this.handleChangeJoinId}
                ></input>) : (<p
                  className='gameIdText'
                >
                  {this.state.gameId}
                </p>)}


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
