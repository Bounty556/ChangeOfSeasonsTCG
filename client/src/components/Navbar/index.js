import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {useAuthContext} from '../../utils/GlobalState'

import './navbar.css';

function Navbar() {
    const [auth, setAuth] = useAuthContext();

    function logoutFunc() {
        // Placeholder for when we have the logout API call
        console.log('Hello there!');
    }
    
    return (
        <nav>
            <Link to='/'>
                <h3>Change of Seasons</h3>
            </Link>
            <div className='dropleft'>
                <button className='btn dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                    <i className='fas fa-user'></i>
                </button>
                {auth ? (
                    <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                        <Link className='dropdown-item' to='/Profile'>Profile</Link>
                        <button className='dropdown-item' onClick={logoutFunc}>Logout</button>
                    </div>
                ) : (
                    <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                        <Link className='dropdown-item' to='/Signup'>Sign Up</Link>
                        <Link className='dropdown-item' to='/Signin'>Sign In</Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar;