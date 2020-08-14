import React from 'react';
import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';


import './homepage.css';

function Homepage() {
    return (
        <div>
            <Navbar />
            <Container>
                <h1 className=' cosHome animate__animated animate__slideInDown'>Change of Seasons</h1>
                
                <div className='card animate__animated animate__slideInDown home-card'>
                    <div className='card-body'>
                        <img src='./images/buddy.png' alt='placeholder' className='homeImg'></img>

                        <div className='btnRow'>
                            <Link  to='/Signup'> <button className='wood'>Sign up</button></Link>
                            <Link to='/Signin'><button className='wood'>Sign in</button></Link>
                        </div>
                    </div>
               </div>
            </Container>
        </div>
    )
}

export default Homepage;