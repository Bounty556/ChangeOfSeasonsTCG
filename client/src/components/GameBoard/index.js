import React, { useState, useEffect, useContext, createContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import CardPlaceHolder from '../CardPlaceHolder';
import CardHolder from '../CardHolder';
import Graveyard from '../Graveyard';
import { GameContext } from '../../pages/Lobby';

import GameLogic from './gameLogic';
import Parser from './cardScript';

import './gameboard.css';

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

// TODO: Make effects work
// TODO: Be able to attack the opponent when his defense row is down
// TODO: Show the opponents health
// TODO: Implement defense

// TODO: Spell cards should only trigger their effect

// TODO: Make 'end turn' button. Turns shouldn't end on one action
// TODO: Players should only be able to play one card per turn, but use every card on the field in the atk row

// TODO: Make cards cost resources
// TODO: Add limit to how many cards you can have in the play area
// TODO: update player deck on opponents side

// TODO: Investigate error with dragging cards outside chrome
// TODO: Replace opponents grave with player to attack

function GameBoard() {
  const { socket, gameId, deck, playerNumber } = useContext(GameContext);

  const [playerDeck, setPlayerDeck] = useState(
    deck.map(card => {
      card.position = '';
      card.defense = 0;
      card.baseAttack = card.attack;
      card.baseHealth = card.health;
      card.onPlayEffect = [];
      card.onDeathEffect = [];
      card.onAttackEffect = [];

      // Parse the effect on this card if applicable
      const tokens = Parser.tokenize(card.effectScript);

      for (let i = 0; i < tokens.length; i++) {
        switch (tokens[i].trigger) {
          case 'ONPLAY':
            card.onPlayEffect.push(tokens[i]);
            break;
          case 'ONDEATH':
            card.onDeathEffect.push(tokens[i]);
            break;
          case 'ONATK':
            card.onAttackEffect.push(tokens[i]);
            break;
        }
      }

      return card;
    })
  );

  const [playerData, setPlayerData] = useState({
    isPlayersTurn: true,
    recentCardDeath: null,
    currentResource: 2
  });

  const [opponentBoardData, setOpponentBoardData] = useState({
    opponentPlayAreaCount: 5,
    opponentHasDeck: true,
    userDef1: null,
    userDef2: null,
    userAtt1: null,
    userAtt2: null,
    userAtt3: null,
    userResource: 2
  });

  useEffect(() => {
    socket.emit('room', gameId, 'updateOpponentResource', {
      resourceUpdate: playerData.currentResource,
      fromPlayer: playerNumber
    });
  }, [playerData.currentResource]);

  useEffect(() => {
    socket.off('updateOpponentPlayArea');
    socket.off('updateOpponentCardPlacement');
    socket.off('receiveAttack');
    socket.off('opponentTurnEnded');
    socket.off('updateOpponentResource');
    socket.on('updateOpponentPlayArea', ({ changeAmount, fromPlayer }) => {
      if (fromPlayer !== playerNumber) {
        const boardData = { ...opponentBoardData };
        boardData.opponentPlayAreaCount += changeAmount;
        setOpponentBoardData(boardData);
      }
    });
    //updates resources
    socket.on('updateOpponentResource', ({ resourceUpdate, fromPlayer }) => {
      if (fromPlayer !== playerNumber) {
        const boardData = { ...opponentBoardData };
        boardData.userResource = resourceUpdate;
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
    socket.on('receiveAttack', ({ position, damage, fromPlayer }) => {
      if (fromPlayer !== playerNumber) {
        receiveAttack(position, damage);
      }
    });
    socket.on('opponentTurnEnded', ({ fromPlayer }) => {
      if (fromPlayer !== playerNumber) {
        // Set it to be our turn
        const tempData = { ...playerData };
        tempData.isPlayersTurn = true;
        if (playerData.currentResource <= 8) {
          tempData.currentResource += 1;
        }
        setPlayerData(tempData);

        // Also draw a card for this turn
        drawCards(1);
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

    setPlayerDeck(
      GameLogic.assignHand(GameLogic.shuffleArray(GameLogic.deckChoice(copy)))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardDraggedToPosition = (cardId, destinationPosition) => {
    const cardIndex = playerDeck.findIndex(card => card.uId === cardId);
    const cardVal = { ...playerDeck[cardIndex] }; // The card we're dragging

    // TODO: Behave differently if we're casting an effect or spell

    if (
      !playerData.isPlayersTurn ||
      GameLogic.isInDefenseRow(cardVal.position) ||
      !cardVal.isCreature
    ) {
      return;
    }

    if (destinationPosition !== 'userPlayArea') {
      // Make sure the given position doesn't have a card in it already
      if (GameLogic.isPositionFilled(destinationPosition, playerDeck)) {
        return;
      }

      if (GameLogic.inOpponentRows(destinationPosition)) {
        if (
          GameLogic.isOpponentPositionFilled(
            destinationPosition,
            opponentBoardData
          ) &&
          cardVal.position !== 'userPlayArea' &&
          cardVal.attack > 0
        ) {
          return sendAttack(
            cardVal.position,
            destinationPosition,
            cardVal.attack
          );
        } else {
          return;
        }
      }

      if (cardVal.position === 'userPlayArea') {
        // Make sure we're moving from the play area to the field
        sendPlayAreaUpdate(-1);
        sendCardPlacement(cardVal, destinationPosition);
        cardVal.position = destinationPosition;
        setPlayerDeck([
          ...playerDeck.filter(card => card.uId !== cardId),
          cardVal
        ]);
      }
    }
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

  const sendAttack = (attackingFromPosition, attackedPosition, damage) => {
    // Need to replace opponent with user here to match the opponentBoardData object
    attackedPosition = attackedPosition.replace('opponent', 'user');
    const boardData = { ...opponentBoardData };
    boardData[attackedPosition].health -= damage;
    
     // Get retaliated on
    const attackingFromCard = {...GameLogic.getCardInPosition(attackingFromPosition, playerDeck)};
    attackingFromCard.health -= boardData[attackedPosition].attack
    receiveAttack(attackingFromPosition, boardData[attackedPosition].attack);

    if (boardData[attackedPosition].health <= 0) {
      boardData[attackedPosition] = null;
    }
    setOpponentBoardData(boardData);

    socket.emit('room', gameId, 'receiveAttack', {
      position: attackedPosition,
      damage: damage,
      fromPlayer: playerNumber
    });

    if (attackingFromCard.health <= 0) {
      sendCardPlacement(
        null,
        attackingFromPosition
      );
    } else {
      sendCardPlacement(
        attackingFromCard,
        attackingFromPosition
      );
    }
  };

  const sendTurnChange = () => {
    // End our turn
    setPlayerData(prevState => ({ ...prevState, isPlayersTurn: false }));
    socket.emit('room', gameId, 'opponentTurnEnded', {
      fromPlayer: playerNumber
    });
  };

  const drawCards = cardCount => {
    const indices = GameLogic.findFirstAvailableCards(cardCount, playerDeck);

    for (let i = 0; i < indices.length; i++) {
      const cardVal = { ...playerDeck[indices[i]] };
      cardVal.position = 'userPlayArea';
      setPlayerDeck([
        ...playerDeck.filter(card => card.uId !== cardVal.uId),
        cardVal
      ]);
    }

    socket.emit('room', gameId, 'updateOpponentPlayArea', {
      changeAmount: indices.length,
      fromPlayer: playerNumber
    });
  };

  const receiveAttack = (position, damage) => {
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
    }
  };

  return (
    <CardContext.Provider value={{ cardDraggedToPosition, playerDeck }}>
      <DndProvider backend={HTML5Backend}>
        <div className='wrapper'>
          <div className='userResourceRow'>
            {[...Array(opponentBoardData.userResource)].map((resource, i) => (
              <span
                className='resourceCircle activeResource'
                key={'resourceOpponent' + i}
              ></span>
            ))}
          </div>

          <div id='opponentRow'>
            <CardPlaceHolder
              id='opponentDeck'
              cardCount={opponentBoardData.opponentHasDeck ? 1 : 0}
            />
            <CardPlaceHolder
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
            <CardPlaceHolder
              id='userDeck'
              cardCount={GameLogic.hasAvailableCards(playerDeck) ? 1 : 0}
            />
            <CardHolder id='userPlayArea' />
          </div>
          <div className='userResourceRow'>
            {[...Array(playerData.currentResource)].map((resource, i) => (
              <span
                className='resourceCircle activeResource'
                key={'resourcePlayer' + i}
              ></span>
            ))}
          </div>
        </div>
      </DndProvider>
    </CardContext.Provider>
  );
}

export default GameBoard;
