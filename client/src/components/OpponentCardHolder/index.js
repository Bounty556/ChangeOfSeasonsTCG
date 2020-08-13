import React from 'react';

import Card from '../Card';

function OpponentCardHolder(props) {
  return (
    <div id={props.id}>
      {[...Array(props.cardCount)].map((card, i) => (
        <Card key={i}>
          <img src='/images/cardBack/lava_style/back/back_lava.png' height='128px'/>
        </Card>
      ))}
    </div>
  );
}

export default OpponentCardHolder;