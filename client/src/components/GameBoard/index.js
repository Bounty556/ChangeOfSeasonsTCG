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
// TODO: Show resources for enemies and players

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
    socket.off('updateOpponentPlayArea');
    socket.off('updateOpponentCardPlacement');
    socket.on('updateOpponentPlayArea', ({ changeAmount, fromPlayer }) => {
      if (fromPlayer !== playerNumber) {
        const boardData = { ...opponentBoardData };
        boardData.opponentPlayAreaCount += changeAmount;
        setOpponentBoardData(boardData);
      }
    });
    socket.on(
      'updateOpponentCardPlacement',
      ({ cardData, position, fromPlayer }) => {
        if (fromPlayer !== playerNumber) {
          const boardData = { ...opponentBoardData };
          boardData[position] = cardData;
          setOpponentBoardData(boardData);
        }
      }
    );
  }, [opponentBoardData]);

  useEffect(() => {
    socket.off('receiveAttack');
    socket.on('receiveAttack', ({ position, damage, fromPlayer }) => {
      if (fromPlayer !== playerNumber) {
        const deck = GameLogic.damageCard(position, damage, GameLogic.copyArray(playerDeck));
        setPlayerDeck(deck);
      }
    });
  });

  useEffect(() => {
    const copy = GameLogic.copyArray(playerDeck);
    setPlayerDeck(GameLogic.assignHand(GameLogic.shuffleArray(copy)));
  }, []);

  const cardDraggedToPosition = (cardId, position) => {
    const cardIndex = playerDeck.findIndex(card => card.uId === cardId);
    const cardVal = playerDeck[cardIndex];
    
    if (position !== 'userPlayArea') {
      // Make sure the given position doesn't have a card in it already
      if (GameLogic.isPositionFilled(position, playerDeck)) {
        return;
      }

      if (GameLogic.inOpponentRows(position)) {
        if (GameLogic.isOpponentPositionFilled(position, opponentBoardData)) {
          return sendAttack(position, cardVal.attack);
        } else {
          return;
        }
      }

      sendCardPlacement(cardVal, position);
      if (cardVal.position === 'userPlayArea') {
        sendPlayAreaUpdate(-1);
      }
    } else if (cardVal.position !== 'userPlayArea') {
      sendCardPlacement(null, cardVal.position);
      if (cardVal.position === 'userPlayArea') {
        sendPlayAreaUpdate(1);
        position = '';
      }
    }

    cardVal.position = position;
    setPlayerDeck([...playerDeck.filter(card => card.uId !== cardId), cardVal]);
  };

  const sendCardPlacement = (card, position) => {
    socket.emit('room', gameId, 'updateOpponentCardPlacement', {
      cardData: card,
      position: position,
      fromPlayer: playerNumber
    });
  };

  const sendPlayAreaUpdate = changeAmount => {
    socket.emit('room', gameId, 'updateOpponentPlayArea', {
      changeAmount: changeAmount,
      fromPlayer: playerNumber
    });
  };

  const sendAttack = (position, damage) => {
    position = position.replace('opponent', 'user');
    const boardData = { ...opponentBoardData };
    boardData[position].health -= damage;
    setOpponentBoardData(boardData);

    socket.emit('room', gameId, 'receiveAttack', {
      position: position,
      damage: damage,
      fromPlayer: playerNumber
    });
  }

  return (
    <CardContext.Provider value={{ cardDraggedToPosition, playerDeck }}>
      <DndProvider backend={HTML5Backend}>
        <div className='wrapper'>
          <div id='opponentRow'>
            <OpponentCardHolder
              id='opponentGrave'
              cardCount={opponentBoardData.opponentHasGrave ? 1 : 0}
            />
            <OpponentCardHolder
              id='opponentDeck'
              cardCount={opponentBoardData.opponentHasDeck ? 1 : 0}
            />
            <OpponentCardHolder
              id='opponentPlayArea'
              cardCount={opponentBoardData.opponentPlayAreaCount}
            />
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
