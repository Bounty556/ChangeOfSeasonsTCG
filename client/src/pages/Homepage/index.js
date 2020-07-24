import React from 'react';
import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';

import './style.css';

function Homepage() {
    return (
        <div>
            <Container>
                <h1 className='animate__animated animate__slideInDown'>Change of Seasons</h1>
                
                <div className='card animate__animated animate__slideInDown'>
                    <div className='card-body'>
                        <img src='https://via.placeholder.com/300' alt='placeholder' className='homeImg'></img>

                        <div className='btnRow'>
                            <Link className='btn btn-primary' to='/Signup'>Sign up</Link>
                            <button className='btn btn-primary'>Sign in</button>
                        </div>
                    </div>
               </div>
            </Container>
        </div>
    )
}

export default Homepage;