import React, { useContext } from 'react';

import Card from '../Card';
import { CardContext } from '../GameBoard';
import { useDrop } from 'react-dnd';
import ItemTypes from '../../utils/ItemTypes';
import GameCard from '../GameCard';

function CardHolder(props) {
  const { cardDraggedToPosition, cards } = useContext(CardContext);

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item) => cardDraggedToPosition(item.id, props.id)
  });

  return (
    <div id={props.id} ref={drop}>
      <Card>
        {cards
          .filter(card => card.position === props.id)
          .map(card => {
            return <GameCard {...card} />;
          })}
      </Card>
    </div>
  );
}

export default CardHolder;
