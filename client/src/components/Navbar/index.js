import React from 'react';
import { Link } from 'react-router-dom';

import './navbar.css';

function Navbar() {
    return (
        <nav>
            <Link to='/'>
                <h3>Change of Seasons</h3>
            </Link>
        </nav>
    )
}

export default Navbar;