import React from 'react';

import Card from '../Card';

function CardPlaceHolder(props) {
  return (
    <div id={props.id}>
      <Card bodyId='playAreaRow'>
        <div id='cardRow'>
          {[...Array(props.cardCount)].map((card, i) => (
            <Card id='opponentCard' key={i}>
              <img
                src='/images/cardBack/lava_style/back/back_lava.png'
                alt='Back of card'
                className='opponentCard'
              />
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default CardPlaceHolder;
