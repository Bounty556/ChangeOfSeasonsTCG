import React, { useContext, useState, useEffect } from 'react';

import Card from '../Card';
import { CardContext } from '../GameBoard';
import EnemyCard from '../EnemyCard';

function Graveyard(props) {
  const { playerDeck } = useContext(CardContext);

  const [heldCards, setHeldCards] = useState(
    playerDeck.filter(card => card.position === props.id)
  );

  useEffect(() => {
    setHeldCards(playerDeck.filter(card => card.position === props.id));
  }, [playerDeck]);

  return (
    <div id={props.id}>
      <Card bodyId='playAreaRow'>
        <div id='cardRow'>
          {heldCards.map(card => (
            <EnemyCard {...card} />
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Graveyard;
