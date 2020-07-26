import React, { Component } from 'react';
//Will be used to go to card lists and deck builder ~possibly friends list if implimented
import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';

import './userProfile.css';
import phImg from './Images/cyclop_01.png';

class UserProfile extends Component {

    state = {
        username: 'User Name State',
        //this will be used to let a palyer chose an avatar at one point
        avatar: '',
        wins: 0,
        losses: 0
    }


    render() {
        return (
            <div>
                <Navbar />
                <Container>
                    <div className='card animate__animated animate__slideInDown'>
                        <div className='card-body row'>
                            <div className='user-avatar' className="col-4">
                                <h2>{this.state.username}</h2>
                                <div>
                                    <img src={phImg} alt='Player`s Chosen Avatar' className='avatar'></img>
                                </div>
                                <p>Chose your Avatar (PH)</p>
                            </div>
                            <div className='user-stats' className="col-4 my-auto">
                                <div className='stats-div'>
                                    <p>Wins: {this.state.wins} </p>
                                    <p>Losses: {this.state.losses}</p>
                                </div>
                            </div>
                            <div className='user-links' className="col-4 my-auto">
                                <div className='button-col'>
                               <button>Veiw Card Collection</button>
                               <br></br>
                               <br></br>
                               <button>Edit Deck</button>
                               </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

}

export default UserProfile;