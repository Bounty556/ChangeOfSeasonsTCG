import React from 'react';
// import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
// import Navbar from '../../components/Navbar/index';

import './about.css';

function About() {
    return (
        <div>
            <Container>
                <div className="card gameCard">
                    <div className="card-body">
                        <h5 className="card-name">Yōsei</h5>
                            <div className = "image-container">
                                <img src='./images/buddy.png' alt='placeholder' className='card-image'></img>
                            </div>
                            <div className = "effect-box">
                                <p className = "effect"></p>
                            </div>
                                <div className = "stats-box row">  
                                <p className = "attack">3</p>
                                <p className = "resourse">3</p>
                                <p className = "health">3</p>
                            </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default About;