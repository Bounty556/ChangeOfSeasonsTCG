import React, { Component, useState, } from 'react';
//Will be used to go to card lists and deck builder ~possibly friends list if implimented
// import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';

import './userProfile.css';
import phImg from './Images/cyclop_01.png';
// import button from './Images/woodsign.png';

//reactstrap 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


function UserProfile() {
    const [username, setUsername] = useState('')
    const [avatar, setAvatar] = useState('')
    const [wins, setWins] = useState(0)
    const [losses, setLosses] = useState(0)

    //code for Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Needs 
    //Write function for setUsername to get the get the users name 
    //Repeat for wins and losses
    //create modal for the avatar selection 
    //create function for setAvatar that actually usues that

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
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton className='modalBody'>
                        <Modal.Title className='modalTitle'>Select an Avatar </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='modalBody'>
    
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