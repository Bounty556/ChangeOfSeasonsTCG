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

// TODO: Players should only be able to play one card per turn, but use every card on the field in the atk row

// TODO: Make cards cost resources
// TODO: Add limit to how many cards you can have in the play area

// TODO: Investigate error with dragging cards outside chrome
// TODO: Replace opponents grave with player to attack

// TODO: Sometimes effects get stuck

function GameBoard() {
  const { socket, gameId, deck, playerNumber } = useContext(GameContext);

  const [playerDeck, setPlayerDeck] = useState(
    deck.map(card => {
      card.position = '';
      card.baseAttack = card.attack;
      card.baseHealth = card.health;
      card.onPlayEffects = [];
      card.onDeathEffects = [];
      card.onAttackEffects = [];

      // Parse the effect on this card if applicable
      const tokens = Parser.tokenize(card.effectScript);

      for (let i = 0; i < tokens.length; i++) {
        switch (tokens[i].trigger) {
          case 'ONPLAY':
            card.onPlayEffects.push(tokens[i]);
            break;
          case 'ONDEATH':
            card.onDeathEffects.push(tokens[i]);
            break;
          case 'ONATK':
            card.onAttackEffects.push(tokens[i]);
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

  const [updateSwitch, setUpdateSwitch] = useState(false); // This swings between true and false every time we need to update

  const [effectData, setEffectData] = useState(null);

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
    socket.emit('room', gameId, 'updateBoard', {
      otherDeck: playerDeck,
      otherData: playerData,
      ourData: opponentBoardData,
      player: playerNumber
    });
  }, [updateSwitch]);

  useEffect(() => {
    socket.off('updateBoard');
    socket.on('updateBoard', ({ otherDeck, otherData, ourData, player }) => {
      if (player === playerNumber) {
        return;
      }

      // Update our opponent board data
      const boardData = { ...opponentBoardData };
      boardData.userDef1 = boardData.userDef2 = boardData.userAtt1 = boardData.userAtt2 = boardData.userAtt3 = null;
      boardData.userResource = otherData.currentResource;

      const opponentCards = GameLogic.getPlayedCards(otherDeck);
      for (let i = 0; i < opponentCards.length; i++) {
        boardData[opponentCards[i].position] = opponentCards[i];
      }

      let playAreaCount = 0;
      for (let i = 0; i < otherDeck.length; i++) {
        if (otherDeck[i].position === 'userPlayArea') {
          playAreaCount++;
        }
        if (otherDeck[i].position === '') {
          boardData.opponentHasDeck = true;
        }
      }
      boardData.opponentPlayAreaCount = playAreaCount;

      // Update our board data
      let ourDeck = GameLogic.copyDeck(playerDeck);
      let deadCards = [null, null, null, null, null];
      [deadCards[0], ourDeck] = GameLogic.compareCards('userDef1', ourData, ourDeck);
      [deadCards[1], ourDeck] = GameLogic.compareCards('userDef2', ourData, ourDeck);
      [deadCards[2], ourDeck] = GameLogic.compareCards('userAtt1', ourData, ourDeck);
      [deadCards[3], ourDeck] = GameLogic.compareCards('userAtt2', ourData, ourDeck);
      [deadCards[4], ourDeck] = GameLogic.compareCards('userAtt3', ourData, ourDeck);

      for (let i = 0; i < deadCards.length; i++) {
        if (deadCards[i]) {
          setPlayerData(prevState => ({
            ...prevState,
            recentCardDeath: deadCards[i]
          }));
          break;
        }
      }

      setOpponentBoardData(boardData);
      setPlayerDeck(ourDeck);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerDeck, playerData, opponentBoardData]);

  useEffect(() => {
    socket.off('ourTurn');
    socket.on('ourTurn', ({ fromPlayer }) => {
      if (fromPlayer !== playerNumber) {
        setPlayerData(prevState => ({ ...prevState, isPlayersTurn: true }));
      } else {
        const tempData = { ...playerData };
        tempData.isPlayersTurn = false;
        if (tempData.currentResource <= 8) {
          tempData.currentResource += 1;
        }
        setPlayerData(tempData);
        drawCards(1);
      }
    });
  }, [updateSwitch, playerData, playerDeck]);

  useEffect(() => {
    setPlayerData(prevState => ({
      ...prevState,
      isPlayersTurn: playerNumber === 1 ? true : false
    }));
    const copy = GameLogic.copyDeck(playerDeck);

    setPlayerDeck(GameLogic.assignHand(GameLogic.shuffleArray(GameLogic.deckChoice(copy))));
    setUpdateSwitch(!updateSwitch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardDraggedToPosition = (cardId, destinationPosition) => {
    const cardIndex = playerDeck.findIndex(card => card.uId === cardId);
    const cardVal = { ...playerDeck[cardIndex] }; // The card we're dragging

    if (!playerData.isPlayersTurn || !cardVal.isCreature) {
      return;
    }
    
    moveCard(destinationPosition, cardVal);
    // if (effectData) {
    //   castEffect(destinationPosition, cardVal);
    // } else {
    // }
  };

  const castEffect = (destinationPosition, cardVal) => {
    if (cardVal.uId !== effectData.cardUId || destinationPosition === 'userPlayArea') {
      return;
    }

    // Check to see if the destination position is in the effect target
    const effect = effectData.effects[effectData.currentEffect];
    const allowedDestinations = Parser.getScriptTargets(effect);
    if (allowedDestinations.includes(destinationPosition)) {
      // Do the effect and end the turn
      switch (effect.operations[0].op) {
        case 'HEAL':
          if (GameLogic.inOpponentRows(destinationPosition)) {
            console.log('enemy');
          } else {
            console.log('fren');
            const destinationCard = playerDeck.find(card => card.position === destinationPosition);
            destinationCard.health += parseInt(effect.operations[0].param2);
            setPlayerDeck([
              ...playerDeck.filter(card => card.position !== destinationCard.position),
              destinationCard
            ]);
            setEffectData(null);
            setUpdateSwitch(!updateSwitch);
          }
          break;
      }
    }
  };

  const moveCard = (destinationPosition, cardVal) => {
    if (destinationPosition !== 'userPlayArea') {
      // Make sure the given position doesn't have a card in it already
      if (
        GameLogic.isInDefenseRow(cardVal.position) ||
        GameLogic.isPositionFilled(destinationPosition, playerDeck)
      ) {
        return;
      }

      if (GameLogic.inOpponentRows(destinationPosition)) {
        if (
          GameLogic.isOpponentPositionFilled(destinationPosition, opponentBoardData) &&
          cardVal.position !== 'userPlayArea' &&
          cardVal.attack > 0
        ) {
          return attackCard(cardVal, destinationPosition);
        } else {
          return;
        }
      }

      if (cardVal.position === 'userPlayArea') {
        // Make sure we're moving from the play area to the field
        cardVal.position = destinationPosition;
        setPlayerDeck([...playerDeck.filter(card => card.uId !== cardVal.uId), cardVal]);

        setUpdateSwitch(!updateSwitch);

        // Set that we're now starting an effect if this card has one
        if (cardVal.onPlayEffects.length > 0) {
          setEffectData({
            cardUId: cardVal.uId,
            effects: cardVal.onPlayEffects,
            currentEffect: 0
          });
        }
      }
    }
  };

  const attackCard = (attackingCard, attackedPosition) => {
    // Need to replace opponent with user here to match the opponentBoardData object
    attackedPosition = attackedPosition.replace('opponent', 'user');
    const boardData = { ...opponentBoardData };
    boardData[attackedPosition].health -= attackingCard.attack;

    // Retaliation
    attackingCard.health -= boardData[attackedPosition].attack;
    if (attackingCard.health <= 0) {
      attackingCard.health = 0;
      attackingCard.position = 'userGrave';
      setPlayerData(prevState => ({
        ...prevState,
        recentCardDeath: attackingCard
      }));
    }
    setPlayerDeck([...playerDeck.filter(card => card.uId !== attackingCard.uId), attackingCard]);

    if (boardData[attackedPosition].health <= 0) {
      boardData[attackedPosition] = null;
    }

    setOpponentBoardData(boardData);
    setUpdateSwitch(!updateSwitch);
  };

  const sendTurnChange = () => {
    socket.emit('room', gameId, 'ourTurn', {
      fromPlayer: playerNumber
    });
  };

  const drawCards = cardCount => {
    const indices = GameLogic.findFirstAvailableCards(cardCount, playerDeck);

    for (let i = 0; i < indices.length; i++) {
      const cardVal = { ...playerDeck[indices[i]] };
      cardVal.position = 'userPlayArea';
      setPlayerDeck([...playerDeck.filter(card => card.uId !== cardVal.uId), cardVal]);
    }

    setUpdateSwitch(!updateSwitch);
  };

  return (
    <CardContext.Provider value={{ cardDraggedToPosition, playerDeck }}>
      <DndProvider backend={HTML5Backend}>
        <div className='wrapper'>
          <div className='userResourceRow'>
            {[...Array(opponentBoardData.userResource)].map((resource, i) => (
              <span className='resourceCircle activeResource' key={'resourceOpponent' + i}></span>
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
            <CardHolder id='opponentDef1' override={true} card={opponentBoardData.userDef1} />
            <CardHolder id='opponentDef2' override={true} card={opponentBoardData.userDef2} />
          </div>

          <div id='opponentAttRow'>
            <CardHolder id='opponentAtt1' override={true} card={opponentBoardData.userAtt1} />
            <CardHolder id='opponentAtt2' override={true} card={opponentBoardData.userAtt2} />
            <CardHolder id='opponentAtt3' override={true} card={opponentBoardData.userAtt3} />
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
              <span className='resourceCircle activeResource' key={'resourcePlayer' + i}></span>
            ))}
          </div>
        </div>
        {playerData.isPlayersTurn ? (
          <div className='endTurnRow'>
            <button className='woodEndButton' onClick={sendTurnChange}>
              End Turn
            </button>
          </div>
        ) : (
          <div></div>
        )}
      </DndProvider>
    </CardContext.Provider>
  );
}

export default GameBoard;
