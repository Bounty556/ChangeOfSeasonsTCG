import React from 'react';

import Container from '../components/Container/index';

import './page-styling/homepage.css';

function Homepage() {
    return (
        <div>
            <Container>
                <h1 className='animate__animated animate__slideInDown'>Change of Seasons</h1>
                
                <div className='card animate__animated animate__slideInDown'>
                    <div className='card-body'>
                        <img src='https://via.placeholder.com/500' alt='placeholder' className='homeImg'></img>

                        <div className='btnRow'>
                            <button className='btn btn-primary'>Sign up</button>
                            <button className='btn btn-primary'>Sign in</button>
                        </div>
                    </div>
               </div>
            </Container>
        </div>
    )
}

export default Homepage;