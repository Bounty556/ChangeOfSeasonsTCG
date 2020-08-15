import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../utils/GlobalState';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';


import './homepage.css';

function Homepage() {
    const [auth, ] = useAuthContext();

    return (
        <div>
            <Navbar />
            <h1 className=' cosHome animate__animated animate__slideInDown'>Change of Seasons</h1>

            <Container>
                <div className='card animate__animated animate__slideInDown home-card'>
                    <div className='card-body'>
                        {/* <img src='./images/buddy.png' alt='placeholder' className='homeImg'></img> */}

                        {!auth ? (    
                            <div className='btnRow'>
                                <Link  to='/Signup'> <button className='wood'>Sign up</button></Link>
                                <Link to='/Signin'><button className='wood'>Sign in</button></Link>
                            </div>
                        ) : (
                            <div className='btnRow'>
                                <Link  to='/Profile'> <button className='wood'>Profile</button></Link>
                                <Link to='/Lobby'><button className='wood'>Play!</button></Link>
                            </div>
                        )}
                    </div>
               </div>
            </Container>
        </div>
    )
}

export default Homepage;