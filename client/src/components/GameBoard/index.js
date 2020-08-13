import React, { useState, useEffect, useContext, createContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import OpponentCardHolder from '../OpponentCardHolder';
import CardHolder from '../CardHolder';
import { GameContext } from '../../pages/Lobby';

import Parser from './cardScript';
import GameLogic from './gameLogic';

import './gameboard.css';

// Give this function to the children of this component so they can tell us when
// A card was dropped on them
export const CardContext = createContext({
  cardDraggedToPosition: null,
  playerDeck: null
});

// FRONTEND:
// TODO: We definitely need to redo the CSS for all of the cardholders and the cards themselves
//       So things don't look awful
// TODO: When we drag a card and hover it over a card slot, it should make the slot go grey or
//       something similar so the user has some kind of feedback

// BACKEND:
// TODO: Show backs of cards in place of enemy's face down cards
// TODO: Clean up code!!!!!

// useEffect(() => {
//   const test = Parser.parseScript(
//     'ONPLAY RAISEATK ATKROW 1 RAISEDEF ATKROW 1 ONDEATH RAISEATK ATKROW -1 RAISEDEF ATKROW -1'
//   );
//   console.log(test);
// }, []);

function GameBoard(props) {
  const { socket, gameId, deck, playerNumber } = useContext(GameContext);

  const [playerDeck, setPlayerDeck] = useState(
    deck.map((card, i) => {
      card.key = i;
      card.uId = i;
      card.position = '';
      return card;
    })
  );

  const [opponentBoardData, setOpponentBoardData] = useState({
    opponentPlayAreaCount: 5,
    opponentHasGrave: false,
    opponentHasDeck: true,
    userDef1: null,
    userDef2: null,
    userAtt1: null,
    userAtt2: null,
    userAtt3: null
  });

  useEffect(() => {
    // If we had previous listeners, remove those
    socket.off('updateOpponentPlayArea');
    socket.off('updateOpponentCardPlacement');
    // Set up our socket
    socket.on('updateOpponentPlayArea', ({ changeAmount, player }) => {
      if (player !== playerNumber) {
        const boardData = { ...opponentBoardData };
        boardData.opponentPlayAreaCount += changeAmount;
        setOpponentBoardData(prevState => ({ ...prevState, ...boardData }));
      }
    });
    socket.on(
      'updateOpponentCardPlacement',
      ({ cardData, position, player }) => {
        if (player !== playerNumber) {
          const boardData = { ...opponentBoardData };
          boardData[position] = cardData;
          setOpponentBoardData(prevState => ({ ...prevState, ...boardData }));
        }
      }
    );
  }, [opponentBoardData]);

  useEffect(() => {
    // Shuffle player deck
    const copy = playerDeck.map(card => {
      return { ...card };
    });
    setPlayerDeck(GameLogic.assignHand(GameLogic.shuffleArray(copy)));
  }, []);

  const cardDraggedToPosition = (cardId, position) => {
    // Check to see if this is a position that can't hold multiple cards
    if (position !== 'userPlayArea') {
      // Check to see if the position already has a card
      const cardIndex = playerDeck.findIndex(
        card => card.position === position
      );
      if (cardIndex !== -1) {
        return;
      }
    }

    // Look for the card with the given cardkey
    const cardIndex = playerDeck.findIndex(card => card.uId === cardId);
    const cardVal = playerDeck[cardIndex];

    if (position !== 'userPlayArea') {
      // Send info to enemy saying we moved a card into a position
      socket.emit('room', gameId, 'updateOpponentCardPlacement', {
        cardData: cardVal,
        position: position,
        player: playerNumber
      });
    } else if (cardVal.position !== 'userPlayArea') {
      // Send info to enemy saying we moved a card away from a position
      socket.emit('room', gameId, 'updateOpponentCardPlacement', {
        cardData: null,
        position: cardVal.position,
        player: playerNumber
      });
    }

    cardVal.position = position;
    setPlayerDeck([...playerDeck.filter(card => card.uId !== cardId), cardVal]);
  };

  return (
    <CardContext.Provider value={{ cardDraggedToPosition, playerDeck }}>
      <DndProvider backend={HTML5Backend}>
        <div className='wrapper'>
          <div id='opponentRow'>
            <OpponentCardHolder id='opponentGrave' cardCount={1} />
            <OpponentCardHolder id='opponentDeck' cardCount={1} />
            <OpponentCardHolder id='opponentPlayArea' cardCount={1} />
          </div>

          <div id='opponentDefRow'>
            <CardHolder
              id='opponentDef1'
              override={true}
              card={opponentBoardData.userDef1}
            />
            <CardHolder
              id='opponentDef2'
              override={true}
              card={opponentBoardData.userDef2}
            />
          </div>

          <div id='opponentAttRow'>
            <CardHolder
              id='opponentAtt1'
              override={true}
              card={opponentBoardData.userAtt1}
            />
            <CardHolder
              id='opponentAtt2'
              override={true}
              card={opponentBoardData.userAtt2}
            />
            <CardHolder
              id='opponentAtt3'
              override={true}
              card={opponentBoardData.userAtt3}
            />
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
