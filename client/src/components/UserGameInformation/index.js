import React, { useState, useEffect } from 'react';

import Card from '../Card';
import './UserGameInformation.css';


const playerInfo = {
    username: localStorage.getItem('username'),
    avatar: localStorage.getItem('avatar'),
}

function UserGameInformation(props) {
  return (
    <div id={props.id}>
      <Card bodyId='playAreaRow'>
        <div id='cardRow'>
            <div className='col gameInfoCol'>
            <img
            src={'./images/cardImg/' + playerInfo.avatar}
            className='avatar'
            />
            {/* placeholder */}
            <p className='lifeTotal'>25</p>
            </div>
        </div>
      </Card>
    </div>
  );
}

export default UserGameInformation;