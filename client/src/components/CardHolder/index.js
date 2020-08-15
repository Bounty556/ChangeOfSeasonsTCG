import React, { useContext, useState, useEffect } from 'react';

import Card from '../Card';
import { CardContext } from '../GameBoard';
import { useDrop } from 'react-dnd';
import ItemTypes from '../../utils/ItemTypes';
import GameCard from '../GameCard';
import InfoCard from '../InfoCard';

import './style.css';

function CardHolder(props) {
  const { cardDraggedToPosition, playerDeck } = useContext(CardContext);

  const [heldCards, setHeldCards] = useState(
    playerDeck.filter(card => card.position === props.id)
  );

  useEffect(() => {
    if (!props.override) {
      setHeldCards(playerDeck.filter(card => card.position === props.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerDeck]);

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: item => cardDraggedToPosition(item.uId, props.id)
  });

  return (
    <div id={props.id} ref={drop} >
      <Card bodyId='playAreaRow' className='cardHolder'>
        <div id='cardRow'>
          {props.override ? (
            props.card ? (
              <InfoCard {...props.card} />
            ) : (
              <></>
            )
          ) : (
            heldCards.map(card => <GameCard {...card} />)
          )}
        </div>
      </Card>
    </div>
  );
}

export default CardHolder;
