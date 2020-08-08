import React, { Component } from 'react';
//Will be used to go to card lists and deck builder ~possibly friends list if implimented
// import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';

import './userProfile.css';
import phImg from './Images/cyclop_01.png';
import button from './Images/woodsign.png';

class UserProfile extends Component {

    state = {
        username: 'Username State',
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
                    <div className='card animate__animated animate__slideInDown profileCard '>
                        <div className='card-body row'>
                            
                            <div className='user-avatar col-4'>
                                <h2>{this.state.username}</h2>
                                <div>
                                    <img src={phImg} alt='Player`s Chosen Avatar' className='avatar'></img>
                                </div>
                                <a className='chooseAvatar'>Change Avatar (PH)</a>
                                <div >
                                    <p className='stats-div'>Wins: {this.state.wins} Losses: {this.state.losses} </p>
                                </div>
                            </div>

                            <div className='user-links col-4 my-auto'>
                                <div className='button-col'>
                                    <button className='wood'>Choose Deck</button>
                                    <br></br>
                                    <br></br>
                                    <button className='wood'>Play Match</button>
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