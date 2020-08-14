import React, { useState, useEffect, useContext, createContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import OpponentCardHolder from '../OpponentCardHolder';
import CardHolder from '../CardHolder';
import { GameContext } from '../../pages/Lobby';

import GameLogic from './gameLogic';

import './gameboard.css';
import Graveyard from '../Graveyard';

// Give this function to the children of this component so they can tell us when
// A card was dropped on them
export const CardContext = createContext({
  cardDraggedToPosition: null,
  playerDeck: null
});

// TODO: We definitely need to redo the CSS for all of the cardholders and the cards themselves
//       So things don't look awful
// TODO: When we drag a card and hover it over a card slot, it should make the slot go grey or
//       something similar so the user has some kind of feedback

// TODO: Show resources for enemies and players
// TODO: Add in the concept of turns
// TODO: Draw a card and gain a resource each turn
// TODO: Make the card shuffling better, so users aren't getting top tier cards immediately
// TODO: Make cards only be able to target their intended minions
// TODO: Make effects work
// TODO: Be able to attack the opponent when his defense row is down
// TODO: Show the opponents health
// TODO: Be able to only attack with the attack row, and have defense units retaliate
// TODO: Implement defense

// TODO: Cleanup socket registering code
// TODO: Fix bug with cards moving between card areas on opponents board

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

  const [playerData, setPlayerData] = useState({
    isPlayersTurn: true,
    recentCardDeath: null,
    currentMana: 3
  });

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
    socket.off('updateOpponentGrave');
    socket.off('receiveAttack');
    socket.off('endOpponentsTurn');
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
    socket.on('updateOpponentGrave', ({ hasGrave, fromPlayer }) => {
      if (fromPlayer !== playerNumber) {
        const boardData = { ...opponentBoardData };
        boardData.opponentHasGrave = hasGrave;
        setOpponentBoardData(boardData);
      }
    });
    socket.on('receiveAttack', ({ position, damage, fromPlayer }) => {
      if (fromPlayer !== playerNumber) {
        const [deck, cardDied] = GameLogic.damageCard(
          position,
          damage,
          GameLogic.copyArray(playerDeck)
        );
        setPlayerDeck(deck);

        if (cardDied) {
          setPlayerData(prevState => ({
            ...prevState,
            recentCardDeath: cardDied
          }));
          socket.emit('room', gameId, 'updateOpponentGrave', {
            hasGrave: true,
            fromPlayer: playerNumber
          });
        }
      }
    });
    socket.on('endOpponentsTurn', ({ fromPlayer }) => {
      if (fromPlayer !== playerNumber) {
        // Set it to be our turn
        setPlayerData(prevState => ({ ...prevState, isPlayersTurn: true }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opponentBoardData, playerDeck, playerData]);

  useEffect(() => {
    setPlayerData(prevState => ({
      ...prevState,
      isPlayersTurn: playerNumber === 1 ? true : false
    }));
    const copy = GameLogic.copyArray(playerDeck);
    setPlayerDeck(GameLogic.assignHand(GameLogic.shuffleArray(copy)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardDraggedToPosition = (cardId, position) => {
    if (!playerData.isPlayersTurn) {
      return;
    }

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
      if (position === 'userPlayArea') {
        sendPlayAreaUpdate(1);
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

    sendTurnChange();
  };

  const sendPlayAreaUpdate = changeAmount => {
    socket.emit('room', gameId, 'updateOpponentPlayArea', {
      changeAmount: changeAmount,
      fromPlayer: playerNumber
    });
  };

  const sendAttack = (position, damage) => {
    // Need to replace opponent with user here to match the opponentBoardData object
    position = position.replace('opponent', 'user');
    const boardData = { ...opponentBoardData };
    boardData[position].health -= damage;
    if (boardData[position].health <= 0) {
      boardData[position] = null;
    }
    setOpponentBoardData(boardData);

    socket.emit('room', gameId, 'receiveAttack', {
      position: position,
      damage: damage,
      fromPlayer: playerNumber
    });

    sendTurnChange();
  };

  const sendTurnChange = () => {
    // End our turn
    setPlayerData(prevState => ({ ...prevState, isPlayersTurn: false }));

    socket.emit('room', gameId, 'endOpponentsTurn', {
      fromPlayer: playerNumber
    });
  };

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
            <Graveyard id='userGrave' recent={playerData.recentCardDeath} />
            <CardHolder id='userDeck' />
            <CardHolder id='userPlayArea' />
          </div>
        </div>
      </DndProvider>
    </CardContext.Provider>
  );
}

export default GameBoard;
