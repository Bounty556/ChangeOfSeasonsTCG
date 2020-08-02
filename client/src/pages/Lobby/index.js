import React, { Component } from 'react';
//Will be used to go to card lists and deck builder ~possibly friends list if implimented
// import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';

import './lobby.css';

class Lobby extends Component {

    state = {
        username_1: 'User 1',
        username_2: 'User 2',
        avatar1: '',
        avatar2: '',
        gameID: 0
    }
    submitFunc = event => {
        event.preventDefault();
    }
    //creates a 5 digit game lobby when players choose to create a game
    //not currently working / do not know if we will be using a randomly generated code for socket.io or assigment a code that we have predefined 
    // gameIDFunc = event => { 
    //  const iD =  Math.floor(Math.random()*90000) + 10000;
    //  this.setState({ [this.state.gameID]: iD });
    //  console.log(iD)

    }

    render() {
        return (
            <div>
                <Navbar />
                <Container>
                    <div className='card animate__animated animate__slideInDown profileCard '>
                        <div className='card-body'>
                            {/* row displaying users */}
                            <div className='players row'>
                                <div>
                                <h2>{this.state.username_1}</h2>
                                    <img src='https://via.placeholder.com/250
                                    'alt='Player`s Chosen Avatar' className='avatar'></img>
                                </div>
                                <h1 className='vs'>VS</h1>
                                <div>
                                <h2>{this.state.username_2}</h2>
                                    <img src='https://via.placeholder.com/250
                                    'alt='Player`s Chosen Avatar' className='avatar'></img>
                                </div>
                            </div>

                            <div className='row'>
                                <input className = 'game-input' type= 'number' min = '5' max='5' value = {this.state.gameID}></input>
                            </div>

                            <div className='row'>
                                <div className='button-col'>
                                    <br></br>
                                    <br></br>
                                    <button className='wood'>Join Match</button>
                                    <button className='wood' >Create Match</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </Container>
            </div>
        )
    }

}

export default Lobby;