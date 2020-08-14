import React, { useContext, useState, useEffect } from 'react';

import Card from '../Card';
import { CardContext } from '../GameBoard';
import InfoCard from '../InfoCard';

function Graveyard(props) {
  const { playerDeck } = useContext(CardContext);

  const [graveStack, setGraveStack] = useState([]);

  useEffect(() => {
    if (props.recent) {
      if (graveStack.length > 0 && graveStack[graveStack.length - 1].uId != props.recent.uId) {
        setGraveStack([...graveStack, props.recent]);
      }
      else if (graveStack.length === 0) {
        setGraveStack([...graveStack, props.recent]);
      }
    }
  }, [props.recent]);

  return (
    <div id={props.id}>
      <Card bodyId='playAreaRow'>
        <div id='cardRow'>
          {graveStack.length > 0 ? (
            <InfoCard {...graveStack[graveStack.length - 1]} />
          ) : (
            <></>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Graveyard;