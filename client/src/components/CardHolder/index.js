import React, { useContext, useState, useEffect } from 'react';

import Card from '../Card';
import { CardContext } from '../GameBoard';
import { useDrop } from 'react-dnd';
import ItemTypes from '../../utils/ItemTypes';
import GameCard from '../GameCard';

function CardHolder(props) {
  const { cardDraggedToPosition, playerDeck } = useContext(CardContext);

  const [heldCards, setHeldCards] = useState(
    playerDeck.filter(card => card.position === props.id)
  );

  useEffect(() => {
    if (!props.override) {
      setHeldCards(playerDeck.filter(card => card.position === props.id));
    }
  }, [playerDeck]);

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: item => cardDraggedToPosition(item.uId, props.id)
  });

  return (
    <div id={props.id} ref={drop}>
      <Card>
        {props.override ? (
          props.card ? (
            <GameCard {...props.card} />
          ) : (
            <></>
          )
        ) : (
          heldCards.map(card => <GameCard {...card} />)
        )}
      </Card>
    </div>
  );
}

export default CardHolder;
