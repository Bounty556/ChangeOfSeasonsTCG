import React, { useState, useEffect } from 'react';
import axios from 'axios';
//Will be used to go to card lists and deck builder ~possibly friends list if implimented
// import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';
import ModalColumn from '../../components/ModalColumn/index'
// import button from './Images/woodsign.png';

//reactstrap 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import './userProfile.css';

function UserProfile() {
    const [username, ] = useState('');
    //used to grab the current chosen avatar from the db 

    const [avatar, setAvatar] = useState('');

    //used for when a user is selecting a new avatar 
    const [selectAvatar, setSelectAvatar] = useState('');
    const [wins, ] = useState(0);
    const [losses, ] = useState(0);
    const history = useHistory();
  
    //code for Modal
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setSelectAvatar('');
    }

    const handleShow = () => setShow(true);

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem('authentication'))._id;

        axios.get(`/api/user/${userId}`)
        .then(res => {
            localStorage.setItem('avatar', res.data.avatar);
            setAvatar(localStorage.getItem('avatar'));
        });
    }, []);

    //Array for avatar images 
    const avatarArr = ['bird_01', 'dark_knight_01', 'cyclop_01', 'ghost_01', 'joker_01', 'orc_05', 'living_armor_02', 'owl_01', 'ash_zombies', 'crystal_golem_01', 'dragon_08', 'dragon_09', 'dragon_07', 'phoenix_01', 'skeleton_06'];

    //Needs 
    //Write function for setUsername to get the get the users name 
    //Repeat for wins and losses
    //create function for setAvatar that actually usues that

    function changeFunc(event) {
        setSelectAvatar(event.target.getAttribute('data'));
    };

    function saveFunc() {
        const userId = JSON.parse(localStorage.getItem('authentication'))._id;

        axios.put(`/api/user/${userId}/avatar/${selectAvatar}.png`)
            .then(() => {
                localStorage.setItem('avatar', selectAvatar + '.png');
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    function goToLobby() {
        history.push('/Lobby'); 
    }

    return (
        <div>
            <Navbar />
            <Container>
                <div className='card animate__animated animate__slideInDown profileCard '>
                    <div className='card-body row'>

                        <div className='user-avatar col-4'>
                            <h2>{username}</h2>
                            <div>
                                <img src={`./images/cardImg/${avatar}`} alt="Player's Chosen Avatar" className='avatar' />
                            </div>
                            {/* open the modal to select an Avatar */}
                            <button className='chooseAvatar' onClick={handleShow}>Change Avatar</button>
                            <div >
                                <p className='stats-div'>Wins: {wins} Losses: {losses} </p>
                            </div>
                        </div>

                        <div className='user-links col-4 my-auto'>
                            <div className='button-col'>
                                <button className='wood'>Choose Deck</button>
                                <br></br>
                                <br></br>
                                <button className='wood' onClick={goToLobby}>Play Match</button>
                            </div>
                        </div>

                    </div>
                </div>
                <Modal className='avatarModal' show={show} onHide={handleClose}>

                    <Modal.Body className='modalBody'>
                        <Container className ='modalContainer'>
                            <div className='row'>
                                {selectAvatar === '' ? (
                                    avatarArr.map((avatars, i) => (
                                        <div className='col-lg-3' key={i}>
                                            <ModalColumn 
                                                imageString={avatars}
                                                imgData={avatars}
                                                changeFunc={changeFunc}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    avatarArr.map((avatars, i) => {
                                        if (avatars !== selectAvatar) {
                                            return (
                                                <div className='col-lg-3 faded' key={i}>
                                                    <ModalColumn 
                                                        imageString={avatars}
                                                        imgData={avatars}
                                                        changeFunc={changeFunc}
                                                    />
                                                </div>
                                            )
                                        } 

                                        else {
                                            return (
                                                <div className='col-lg-3' key={i}>
                                                    <ModalColumn 
                                                        imageString={avatars}
                                                        imgData={avatars}
                                                        changeFunc={changeFunc}
                                                    />
                                                </div>
                                            )
                                        }
                                    })
                                )}
                                </div>
                        </Container>
                    </Modal.Body>

                    <Modal.Footer className='modalFooter'>
                        <Button variant='danger' className='closeButtonModal'  onClick={handleClose}> Close </Button>
                        <Button variant='primary' className='saveButtonModal' onClick={saveFunc}> Save Changes </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    )

}

export default UserProfile;