import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../utils/GlobalState';
import axios from 'axios';

import './navbar.css';

function Navbar() {
    const [auth,] = useAuthContext();
    const [avatar, setAvatar] = useState(localStorage.getItem('avatar'));

    let userId = null;

    if (localStorage.getItem('authentication') != null) {
        userId = JSON.parse(localStorage.getItem('authentication'))._id;
    }

    useEffect(() => {
        if (userId != null && avatar == null) {
            axios.get(`/api/user/${userId}`)
            .then(res => {
                localStorage.setItem('avatar', res.data.avatar);
                setAvatar(localStorage.getItem('avatar'));
            })
            .catch(err => console.log(err));
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    function logoutFunc() {
        axios.post('/api/logout').then(res => {
            localStorage.removeItem('authentication');
            localStorage.removeItem('avatar');
            window.location = '/';
        })
        .catch(err => console.log(err));
    }
    
    return (
        <nav>
            <Link to='/'>
                <h3>Change of Seasons</h3>
            </Link>
                {auth ? (
                    <div className='dropleft'>
                        <button className='btn' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                            {avatar == null ? (
                                <img src='https://via.placeholder.com/40' alt='Profile Icon' id='userProfileIcon' />
                            ) : (
                                <img src={`./images/cardImg/${avatar}`} alt='Profile Icon' id='userProfileIcon' />
                            )}
                        </button>
                        <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                            <Link className='dropdown-item' to='/Profile'>Profile</Link>
                            <button className='dropdown-item' onClick={logoutFunc}>Logout</button>
                        </div>
                    </div>
                ) : (
                    <div className='dropleft'>
                        <button className='btn dropdownBtn' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                            <i className='fas fa-user'></i>
                        </button>
                        <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                            <Link className='dropdown-item' to='/Signup'>Sign Up</Link>
                            <Link className='dropdown-item' to='/Signin'>Sign In</Link>
                        </div>
                    </div>
                )}
        </nav>
    )
}

export default Navbar;
