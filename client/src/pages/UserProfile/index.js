import React, { Component, useState, } from 'react';
//Will be used to go to card lists and deck builder ~possibly friends list if implimented
// import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';
import ModalColumn from '../../components/ModalColumn/index'
import './userProfile.css';
import phImg from './Images/cyclop_01.png';
// import button from './Images/woodsign.png';

//reactstrap 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function UserProfile() {
    const [username, setUsername] = useState('');
    //used to grab the current chosen avatar from the db 
    const [avatar, setAvatar] = useState('');
    //used for when a user is selecting a new avatar 
    const [selectAvatar, setSelectAvatar] = useState('');
    const [wins, setWins] = useState(0);
    const [losses, setLosses] = useState(0);

    //code for Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Array for avatar images 
    const avatarArr = ['bird_01', 'dark_knight_01', 'cyclop_01', 'ghost_01', 'joker_01', 'orc_05', 'living_armor_02', 'owl_01', 'ash_zombies', 'crystal_golem_01', 'dragon_08', 'dragon_09', 'dragon_07', 'phoenix_01', 'skeleton_06'];

    //Needs 
    //Write function for setUsername to get the get the users name 
    //Repeat for wins and losses
    //create function for setAvatar that actually usues that

    function someFunk(event) {
    const selectedAvatar = event.target.getAttribute('data');
    setSelectAvatar(selectedAvatar);
    console.log(selectAvatar);
    };


    return (
        <div>
            <Navbar />
            <Container>
                <div className='card animate__animated animate__slideInDown profileCard '>
                    <div className='card-body row'>

                        <div className='user-avatar col-4'>
                            <h2>{username}</h2>
                            <div>
                                <img src={phImg} alt='Player`s Chosen Avatar' className='avatar'></img>
                            </div>
                            {/* open the modal to select an Avatar */}
                            <a className='chooseAvatar' onClick={handleShow}>Change Avatar</a>
                            <div >
                                <p className='stats-div'>Wins: {wins} Losses: {losses} </p>
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
                <Modal className='avatarModal' show={show} onHide={handleClose}>
                    <Modal.Body className='modalBody'>
                            {
                            avatarArr.map((avatars, i) => (
                                <Container className ='modalContainer' 
                                key={i}> 
                                    <ModalColumn 
                                    imageString= {avatars}
                                    imgData={avatars}
                                    someFunk= {someFunk}
                                    />
                                </Container>
                            ))
                            }
                    </Modal.Body>
                    <Modal.Footer className='modalBody'>
                        <Button variant="danger" className='closeButtonModal'  onClick={handleClose}> Close </Button>
                        <Button variant="primary" className='saveButtonModal' onClick={handleClose}> Save Changes </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    )

}

export default UserProfile;