import React from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';

import Card from '../Card/index';
import ItemTypes from '../../utils/ItemTypes';

import './GameCard.css';

function GameCard(props) {
  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.CARD, uId: props.uId }
  });
  
  function effectFunc(text) {
    switch (text) {
      // Effects for Spring
      case 'Gain +1 resource':
        return <p className='effect gainOne'>{props.effect}</p>

      case 'Gain 2 resources':
        return <p className='effect gainTwo'>{props.effect}</p>

      case 'When played, gain +1 resource':
        return <p className='effect whenPlayed'>{props.effect}</p>

      case 'When played, give your attack row +3 ATK':
        return <p className='effect whenPlayedGive'>{props.effect}</p>
      
      case 'When this attacks, draw a card':
        return <p className='effect whenThis'>{props.effect}</p>

      case 'Draw a card':
        return <p className='effect drawCard'>{props.effect}</p>
      
        case 'Draw cards until your hand is full':
        return <p className='effect drawCardUntil'>{props.effect}</p>

      case 'Draw 3 cards':
        return <p className='effect drawThree'>{props.effect}</p>
      
        case 'While this is in play give all your creatures +2 ATK +4 health':
        return <p className='effect whileThis'>{props.effect}</p>

      default:
        return <p className='effect'>{props.effect}</p>
    }
  }

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
              src='./images/cardBack/lava_style/card_title/mana_point_lava.png'
              alt='placeholder'
              className='mana'
            />
            <p className='resource'>{props.resourceCost}</p>
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
            {effectFunc(props.effect)}
          </div>

          {props.isCreature ? (
            <div className='stats-box row'>
              <p className='attack'>{props.attack}</p>
              <p className='health'>{props.health}</p>
            </div>
          ) : (
            <></>
          )}
        </Card>
      </div>
    </>
  );
}

export default GameCard;
