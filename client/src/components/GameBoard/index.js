import React, { useState, useEffect, createContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import CardHolder from '../CardHolder';

import Parser from './scriptParser';

import './gameboard.css';

// Give this function to the children of this component so they can tell us when
// A card was dropped on them
export const CardContext = createContext({
  cardDraggedToPosition: null,
  cards: null
});

// TODO: We definitely need to redo the CSS for all of the cardholders and the cards themselves
//       So things don't look awful

function GameBoard(props) {
  useEffect(() => {
    const test = Parser.parseScript(
      'ONPLAY RAISEATK ATKROW 1 RAISEDEF ATKROW 1 ONDEATH RAISEATK ATKROW -1 RAISEDEF ATKROW -1'
    );
    console.log(test);
  }, []);

  const [cards, setCards] = useState([
    {
      id: 0,
      key: 0,
      position: 'userPlayArea',
      name: 'Gudrun',
      img: 'buddy.png',
      attack: 2,
      resourceCost: 2,
      health: 3
    }
  ]);

  const cardDraggedToPosition = (cardId, position) => {
    // Look for the card with the given cardkey
    const cardIndex = cards.findIndex(card => card.id === cardId);
    const cardVal = cards[cardIndex];
    cardVal.position = position;
    setCards([...cards.filter(card => card.id !== cardId), cardVal]);
  };

  return (
    <CardContext.Provider value={{ cardDraggedToPosition, cards }}>
      <DndProvider backend={HTML5Backend}>
        <div className='wrapper'>
          <div id='opponentRow'>
            <CardHolder id='opponentGrave' />
            <CardHolder id='opponentDeck' />
            <CardHolder id='opponentPlayArea' />
          </div>

          <div id='opponentDefRow'>
            <CardHolder id='opponentDef1' />
            <CardHolder id='opponentDef2' />
          </div>

          <div id='opponentAttRow'>
            <CardHolder id='opponentAtt1' />
            <CardHolder id='opponentAtt2' />
            <CardHolder id='opponentAtt3' />
          </div>
        </div>

        <hr />

        <div className='wrapper'>
          <div id='userAttRow'>
            <CardHolder id='userAtt1' />
            <CardHolder id='userAtt2' />
            <CardHolder id='userAtt3' />
          </div>

          <div id='userDefRow'>
            <CardHolder id='userDef1' />
            <CardHolder id='userDef2' />
          </div>

          <div id='userRow'>
            <CardHolder id='userGrave' />
            <CardHolder id='userDeck' />
            <CardHolder id='userPlayArea' />
          </div>
        </div>
      </DndProvider>
    </CardContext.Provider>
  );
}

export default GameBoard;
