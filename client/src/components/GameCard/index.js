import React from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';

import Card from '../Card/index';
import ItemTypes from '../../utils/ItemTypes';

import './GameCard.css';

function GameCard(props) {
  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.CARD, uId: props.uId }
  });

  return (
    <>
      <DragPreviewImage
        connect={preview}
        src={'/images/cardImg/' + props.img}
      />
      <div ref={drag}>
        <Card id='gameCard'>
          <div className='image-container'>
            <img
              src={'/images/cardImg/' + props.img}
              alt='placeholder'
              className='card-image'
            />
          </div>
          <img
            src='./images/cardBack/lava_style/card_title/frame_title_lava.png'
            alt='placeholder'
            className='card-frame'
          />
          <div className='name-container'>
          <h5 className='card-name'>{props.name.trim()}</h5>
          </div>
          <div className='effect-box'>
            <p className='effect'></p>
          </div>
          <div className='stats-box row'>
            <p className='attack'>{props.attack}</p>
            <p className='health'>{props.health}</p>
          </div>
        </Card>
      </div>
    </>
  );
}

export default GameCard;
