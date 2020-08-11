import React, { useState, useEffect } from 'react';
//Will be used to go to card lists and deck builder ~possibly friends list if implimented
// import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';
import Card from '../../components/Card/index';
import socketIO from 'socket.io-client';

import axios from 'axios';
import useAsyncState from '../../components/Async/index';

import './lobby.css';
import './gameboard.css';

const ENDPOINT = 'http://localhost:3001/';

// TODO: When 2 people are in a lobby, show the 'play game button'
// TODO: When in a lobby, show the 'Leave lobby' button

// Socket io works via a back and forth of communication.
// 1. The user joins a lobby by telling the server to put it in the given room
// 2. The server then returns the playerNumber back to the client, and the client records this, as well as that it has successfully disconnected
// 3. The client sends a message to the server telling all clients in the room it has successfully connected, and that player info needs to be updated
// 4. All clients send back their player info to the room via the server, so all clients can update their local player information correctly

// class Lobby extends Component {
//   constructor() {
//     super();
//     this.state = {
//       username1: 'User 1',
//       username2: 'User 2',
//       avatar1: '',
//       avatar2: '',
//       gameId: 0,
//       joinedLobby: false,
//       playGame: false,
//       playerNumber: -1
//     };

//     this.socket = null;
//   }

//   submitFunc = event => {
//     event.preventDefault();
//   };

//   componentDidMount() {
//     this.socket = socketIO(ENDPOINT);

//     this.socket.on('requestPlayerInfo', this.sendPlayerInfo);
//     this.socket.on('receivePlayerInfo', this.updatePlayerInfo);
    
//     // Worry about this later: this.socket.on('userLeft', (playerNumber) => this.removePlayerInfo(that, playerNumber));
//   }

//   componentWillUnmount() {
//     this.socket.disconnect();
//   }

//   handleChangeJoinId = event => {
//     this.setState({ gameId: parseInt(event.target.value || 0) });
//   };

//   createNewGame = () => {
//     // Create a unique Socket.IO Room
//     const room = Math.ceil(Math.random() * 100000);
//     this.setState({ gameId: room }, () => this.joinLobby());
//   };

//   joinLobby = () => {
//     // Make sure we're authenticated
//     if (localStorage.getItem('authentication')) {
//       this.socket.emit('joinRoom', this.state.gameId, this.setThisPlayersInfo);
//     }
//   };
  
//   setThisPlayersInfo = playerNumber => {
//     this.setState({joinedLobby: true, playerNumber: playerNumber}, () => 
//       this.socket.emit('room', this.state.gameId, 'requestPlayerInfo')
//     );
//   };

//   sendPlayerInfo = () => {
//     // TODO: we shouldn't be returning the user password at all
//     axios.get('/api/user/' + JSON.parse(localStorage.getItem('authentication'))._id)
//       .then(info => {
//         const playerInfo = {
//           username: info.data.username,
//           avatar: info.data.avatar,
//           number: this.state.playerNumber
//         };
//         this.socket.emit('room', this.state.gameId, 'receivePlayerInfo', playerInfo);
//       })
//       .catch(err => console.log(err));
//   };

//   updatePlayerInfo = playerInfo => {
//     // Get player info
//     if (playerInfo.number === 1) {
//       this.setState({
//         username1: playerInfo.username,
//         avatar1: playerInfo.avatar
//       });
//     }

//     if (playerInfo.number === 2) {
//       this.setState({
//         username2: playerInfo.username,
//         avatar2: playerInfo.avatar
//       });
//     }
//   };

//   render() {
//     return (
//       <div>
//         {!this.state.playGame ? (
//           <div>
//             <Navbar />
//             <Container>
//               <div className='card animate__animated animate__slideInDown profileCard'>
//                 <div className='card-body'>
//                   {/* row displaying users */}
//                   <div className='players row'>
//                     <div className='playerOne'>
//                       <h2>{this.state.username1}</h2>
//                       <img
//                         src={'./images/cardImg/' + this.state.avatar1}
//                         alt='Player`s Chosen Avatar'
//                         className='avatar'
//                       ></img>
//                     </div>
//                     <h1 className='vs'>VS</h1>
//                     <div className='playerTwo'>
//                       <h2>{this.state.username2}</h2>
//                       <img
//                         src={'./images/cardImg/' + this.state.avatar2}
//                         alt='Player`s Chosen Avatar'
//                         className='avatar'
//                       ></img>
//                     </div>
//                   </div>

//                   <div className='row'>
//                     {!this.state.joinedLobby ? (
//                       <input
//                         className='game-input hide'
//                         type='number'
//                         value={this.state.gameId}
//                         onChange={this.handleChangeJoinId}
//                       ></input>
//                     ) : (
//                       <p className='gameIdText'>{this.state.gameId}</p>
//                     )}
//                   </div>

//                   <div className='row'>
//                     <div className='button-col'>
//                       <br></br>
//                       <br></br>
//                       <button className='wood' onClick={this.joinLobby}>
//                         Join Match
//                       </button>
//                       <button className='wood' onClick={this.createNewGame}>
//                         Create Match
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Container>
//           </div>
//         ) : (
//           <div>
//             <div className='wrapper'>
//               <div id='opponentRow'>
//                 {/* Opponent's Graveyard*/}
//                 <Card id='opponentGrave'>
//                   <h6>Opponent Graveyard</h6>
//                 </Card>

//                 {/* Opponent's Deck */}
//                 <Card id='opponentDeck'>
//                   <h6>Opponent Deck</h6>
//                 </Card>

//                 {/* Opponent's Play area */}
//                 <Card id='opponentPlayArea'>
//                   <h4>Opponent Play Area</h4>
//                 </Card>
//               </div>

//               {/* Defense Row */}
//               <div id='opponentDefRow'>
//                 <Card id='opponentDef1'>
//                   <h6>Opponent Defense 1</h6>
//                 </Card>
//                 <Card id='opponentDef2'>
//                   <h6>Opponent Defense 2</h6>
//                 </Card>
//               </div>

//               {/* Attack Row */}
//               <div id='opponentAttRow'>
//                 <Card id='opponentAtt1'>
//                   <h6>Opponent Attack 1</h6>
//                 </Card>
//                 <Card id='opponentAtt2'>
//                   <h6>Opponent Attack 2</h6>
//                 </Card>
//                 <Card id='opponentAtt3'>
//                   <h6>Opponent Attack 3</h6>
//                 </Card>
//               </div>
//             </div>

//             <hr />

//             <div className='wrapper'>
//               <div id='userAttRow'>
//                 <Card id='userAtt1'>
//                   <h6>User Attack 1</h6>
//                 </Card>
//                 <Card id='userAtt2'>
//                   <h6>User Attack 2</h6>
//                 </Card>
//                 <Card id='userAtt3'>
//                   <h6>User Attack 3</h6>
//                 </Card>
//               </div>

//               <div id='userDefRow'>
//                 <Card id='userDef1'>
//                   <h6>User Defense 1</h6>
//                 </Card>
//                 <Card id='userDef2'>
//                   <h6>User Defense 2</h6>
//                 </Card>
//               </div>

//               <div id='userRow'>
//                 {/* User's Graveyard*/}
//                 <Card id='userGrave'>
//                   <h6>User Graveyard</h6>
//                 </Card>

//                 {/* User's Deck */}
//                 <Card id='userDeck'>
//                   <h6>User Deck</h6>
//                 </Card>

//                 {/* User's Play area */}
//                 <Card id='userPlayArea'>
//                   <h4>User Play Area</h4>
//                 </Card>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
// }

function Lobby() {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');
  const [avatar1, setAvatar1] = useState('');
  const [avatar2, setAvatar2] = useState('');
  const [gameId, setGameId] = useState(0);
  const [joinedLobby, setJoinedLobby] = useState(false);
  const [playGame, setPlayGame] = useState(false);
  const [playerNumber, setPlayerNumber] = useState(-1);
  const [socket, setSocket] = useAsyncState(null);

  useEffect(() => { 
    setSocket(socketIO(ENDPOINT)).then(() => {
      socket.on('requestPlayerInfo', sendPlayerInfo);
      socket.on('receivePlayerInfo', updatePlayerInfo);
    });
  }, []);

  // function submitFunc(event) {
  //   event.preventDefault();
  // }

  function handleChangeJoinId(event) {
    setGameId(
      parseInt(event.target.value || 0)
    );
  }

  function createNewGame() {
    // Create a unique Socket.IO Room
    const room = Math.ceil(Math.random() * 100000);

    setGameId(room);

    joinLobby();
  }

  function joinLobby() {
    // Make sure we're authenticated
    if (localStorage.getItem('authentication')) {
      socket.emit('joinRoom', gameId, setThisPlayersInfo);
    }
  }

  function setThisPlayersInfo(playerNumber) {
    setJoinedLobby(true);
    setPlayerNumber(playerNumber);

    socket.emit('room', gameId, 'requestPlayerInfo');
  }
  
  function sendPlayerInfo() {
    // TODO: we shouldn't be returning the user password at all
    axios.get('/api/user/' + JSON.parse(localStorage.getItem('authentication'))._id)
      .then(info => {
        const playerInfo = {
          username: info.data.username,
          avatar: info.data.avatar,
          number: playerNumber
        };
        socket.emit('room', gameId, 'receivePlayerInfo', playerInfo);
      })
      .catch(err => console.log(err));
  }

  function updatePlayerInfo(playerInfo) {
    // Get player info
    if (playerInfo.number === 1) {
      setUsername1(playerInfo.username);
      setAvatar1(playerInfo.avatar);
    }

    if (playerInfo.number === 2) {
      setUsername2(playerInfo.username);
      setAvatar2(playerInfo.avatar);
    }
  }

  return (
    <div>
      {!playGame ? (
        <div>
          <Navbar />
          <Container>
            <div className='card animate__animated animate__slideInDown profileCard'>
              <div className='card-body'>
                {/* row displaying users */}
                <div className='players row'>
                  <div className='playerOne'>
                    <h2>{username1}</h2>
                    <img
                      src={'./images/cardImg/' + avatar1}
                      alt='Player`s Chosen Avatar'
                      className='avatar'
                    ></img>
                  </div>
                  <h1 className='vs'>VS</h1>
                  <div className='playerTwo'>
                    <h2>{username2}</h2>
                    <img
                      src={'./images/cardImg/' + avatar2}
                      alt='Player`s Chosen Avatar'
                      className='avatar'
                    ></img>
                  </div>
                </div>

                <div className='row'>
                  {!joinedLobby ? (
                    <input
                      className='game-input hide'
                      type='number'
                      value={gameId}
                      onChange={handleChangeJoinId}
                    ></input>
                  ) : (
                    <p className='gameIdText'>{gameId}</p>
                  )}
                </div>

                <div className='row'>
                  <div className='button-col'>
                    <br></br>
                    <br></br>
                    <button className='wood' onClick={joinLobby}>
                      Join Match
                    </button>
                    <button className='wood' onClick={createNewGame}>
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

export default Lobby;