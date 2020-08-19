import React, { useState, useEffect, useContext } from 'react';
import { useDrop } from 'react-dnd';
import ItemTypes from '../../utils/ItemTypes';
import { CardContext } from '../GameBoard';


import Card from '../Card';
import './UserGameInformation.css';

const playerInfo = {
  username: localStorage.getItem('username'),
  avatar: localStorage.getItem('avatar'),
}


function UserGameInformation(props) {
  
  const { cardDraggedToPosition, } = useContext(CardContext);

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: item => cardDraggedToPosition(item.uId, props.id)
  });

  return (
    <div id={props.id} ref={drop}>
      <Card id='gameInfo'>
        <div id='cardRow'>
            <div className='col gameInfoCol'>
            <img
            src={'./images/cardImg/' + playerInfo.avatar}
            className='gameInfoAvatar'
            />
            {/* placeholder */}
            <p className='lifeTotal'>{props.lifeState}</p>
            </div>
        </div>
      </Card>
    </div>
  );
}

export default UserGameInformation;