import React from 'react';

import Card from '../Card/index';

import './EnemyCard.css';

function EnemyCard(props) {
  return (
    <div>
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
          <p className='effect'>{props.effect}</p>
        </div>
        <div className='stats-box row'>
          <p className='attack'>{props.attack}</p>
          <p className='health'>{props.health}</p>
        </div>
      </Card>
    </div>
  );
}

export default EnemyCard;
