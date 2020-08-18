import React, { useState, useEffect, useContext, createContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import CardPlaceHolder from '../CardPlaceHolder';
import CardHolder from '../CardHolder';
import UserGameInformation from '../UserGameInformation';
import { GameContext } from '../../pages/Lobby';

import GameLogic from './gameLogic';
import Parser from './cardScript';
import Effects from './effects';

import './gameboard.css';
import { STATES } from 'mongoose';

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
// TODO: Spell cards should only trigger their effect
// TODO: Players should be able to use every card on the field in the atk row once
// TODO: Make cards cost resources
// TODO: Replace opponents grave with player to attack
// TODO: Make cards 69 and 70 have proactive effects

function GameBoard() {
  const { socket, gameId, deck, playerNumber } = useContext(GameContext);

  const [playerDeck, setPlayerDeck] = useState(
    deck.map(card => {
      card.position = '';
      card.baseAttack = card.attack;
      card.baseHealth = card.health;
      card.onPlayEffect = null;
      card.onDeathEffect = null;
      card.onAttackEffect = null;

      // Parse the effect on this card if applicable
      const tokens = Parser.tokenize(card.effectScript);

      for (let i = 0; i < tokens.length; i++) {
        switch (tokens[i].trigger) {
          case 'ONPLAY':
            card.onPlayEffect = tokens[i];
            break;
          case 'ONDEATH':
            card.onDeathEffect = tokens[i];
            break;
          case 'ONATK':
            card.onAttackEffect = tokens[i];
            break;
        }
      }
      return card;
    })
  );

  const [playerData, setPlayerData] = useState({
    isPlayersTurn: true,
    hasInitiated: false,
    currentResource: 2,
    lifeTotal: 25
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
    currentResource: 2,
    opponentLifeTotal: 25
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
      boardData.currentResource = otherData.currentResource;

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

      setOpponentBoardData(boardData);

      if (playerData.hasInitiated) {
        // Update our board data
        const newPlayerData = { ...playerData };
        newPlayerData.currentResource = ourData.currentResource;

        let ourDeck = GameLogic.copyDeck(playerDeck);
        let deadCards = [null, null, null, null, null];
        [deadCards[0], ourDeck] = GameLogic.compareCards('userDef1', ourData, ourDeck);
        [deadCards[1], ourDeck] = GameLogic.compareCards('userDef2', ourData, ourDeck);
        [deadCards[2], ourDeck] = GameLogic.compareCards('userAtt1', ourData, ourDeck);
        [deadCards[3], ourDeck] = GameLogic.compareCards('userAtt2', ourData, ourDeck);
        [deadCards[4], ourDeck] = GameLogic.compareCards('userAtt3', ourData, ourDeck);

        let deadCard = null;
        for (let i = 0; i < deadCards.length; i++) {
          if (deadCards[i]) {
            deadCard = deadCards[i];
            break;
          }
        }

        if (deadCard) {
          // Trigger that card's on death effect
          const effect = deadCard.onDeathEffect;
          if (effect) {
            for (let i = 0; i < effect.operations.length; i++) {
              instantCastOperation(deadCard.uId, effect.operations[i], ourDeck);
            }
          }
          setPlayerData(newPlayerData);
          setPlayerDeck(ourDeck);
          setUpdateSwitch(!updateSwitch);
        } else {
          setPlayerData(newPlayerData);
          setPlayerDeck(ourDeck);
        }
      }
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
        // Check to see the amount of cards in the players hands and draws a card if able
        const handCount = GameLogic.countAllCardsInPosition('userPlayArea', playerDeck);
        if (handCount < 5) {
          drawCards(1);
        }

        setEffectData(null); // They may have wasted any spells they could've cast

        setUpdateSwitch(!updateSwitch);
      }
    });
  }, [updateSwitch, playerData, playerDeck]);

  useEffect(() => {
    const copy = GameLogic.copyDeck(playerDeck);
    setPlayerDeck(GameLogic.assignHand(GameLogic.shuffleArray(GameLogic.deckChoice(copy))));
    setPlayerData(prevState => ({
      ...prevState,
      isPlayersTurn: playerNumber === 1 ? true : false,
      hasInitiated: true
    }));
    setUpdateSwitch(!updateSwitch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Called by CardHolder components whenever a card is dragged on to one of them
  const cardDraggedToPosition = (cardId, destinationPosition) => {
    const cardIndex = playerDeck.findIndex(card => card.uId === cardId);
    const cardVal = { ...playerDeck[cardIndex] }; // The card we're dragging

    if (!playerData.isPlayersTurn || !cardVal.isCreature) {
      return;
    }

    if (effectData) {
      castEffect(destinationPosition, cardId);
    } else {
      moveCard(destinationPosition, cardVal);
    }
  };

  const castEffect = (destinationPosition, cardId) => {
    if (cardId !== effectData.cardId || destinationPosition === 'userPlayArea') {
      return;
    }

    // Check to make sure our destination is a possible target for this effect
    const operation = effectData.effect.operations[effectData.currentOperation];
    const availablePositions = Parser.getScriptTargets(operation);
    const states = { effectData, opponentBoardData, playerDeck, updateSwitch };
    const functions = {
      setOpponentBoardData,
      setPlayerDeck,
      increaseEffectOperation,
      setUpdateSwitch,
      handleCardDeath
    };
    if (availablePositions.includes(destinationPosition)) {
      switch (operation.op) {
        case 'HEAL':
          Effects.manualHealEffect(destinationPosition, states, functions);
          break;

        case 'DMG':
          Effects.manualDmgEffect(destinationPosition, states, functions);
          break;

        default:
          break;
      }
    }
  };

  const increaseEffectOperation = (effectParam, deck) => {
    if (!effectParam) {
      effectParam = { ...effectData };
    }

    for (let i = effectParam.currentOperation + 1; i < effectParam.effect.operations.length; i++) {
      if (Parser.canInstaCast(effectParam.effect.operations[i])) {
        if (deck) {
          instantCastOperation(effectParam.cardId, effectParam.effect.operations[i], deck);
        } else {
          instantCastOperation(effectParam.cardId, effectParam.effect.operations[i]);
        }
      } else {
        setEffectData({
          cardId: effectParam.cardId,
          effect: effectParam.effect,
          currentOperation: i
        });
        return;
      }
    }

    setEffectData(null);
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
          return attackCard(cardVal.position, destinationPosition);
        } else {
          return;
        }
      }

      if (cardVal.position === 'userPlayArea') {
        const deck = GameLogic.copyDeck(playerDeck);
        const cardCopy = GameLogic.getCardWithId(cardVal.uId, deck);
        // Make sure we're moving from the play area to the field
        cardCopy.position = destinationPosition;

        // Set that we're now starting an effect if this card has one
        const effect = cardCopy.onPlayEffect;
        if (effect) {
          increaseEffectOperation(
            { cardId: cardVal.uId, effect: effect, currentOperation: -1 },
            deck
          );
        }

        setPlayerDeck(deck);
        setUpdateSwitch(!updateSwitch);
      }
    }
  };

  const instantCastOperation = (cardId, operation, useDeck) => {
    const states = { playerDeck, playerData, opponentBoardData };
    const functions = { setPlayerDeck, setPlayerData, setOpponentBoardData };
    switch (operation.op) {
      case 'RES':
        Effects.instantResEffect(operation, states, functions);
        break;

      case 'DRAW':
        Effects.instantDrawEffect(operation, useDeck, states, functions);
        break;

      case 'HEAL':
        Effects.instantHealEffect(cardId, operation, useDeck, states, functions);
        break;

      case 'RAISEATK':
        Effects.instantRaiseAtkEffect(operation, useDeck, states, functions);
        break;

      case 'TOPDECK':
        Effects.instantTopDeckEffect(cardId, useDeck, states, functions);
        break;

      case 'DMG':
        Effects.instantDmgEffect(operation, useDeck, states, functions);
        break;

      default:
        break;
    }
  };

  const attackCard = (attackingCardPosition, attackedPosition) => {
    const ourDeck = GameLogic.copyDeck(playerDeck);
    let attackingCard;
    for (let i = 0; i < ourDeck.length; i++) {
      if (ourDeck[i].position === attackingCardPosition) {
        attackingCard = ourDeck[i];
      }
    }

    // Need to replace opponent with user here to match the opponentBoardData object
    attackedPosition = attackedPosition.replace('opponent', 'user');
    const boardData = { ...opponentBoardData };
    boardData[attackedPosition].health -= attackingCard.attack;

    // Start the on attack effect
    const attackEffect = attackingCard.onAttackEffect;
    if (attackEffect) {
      for (let i = 0; i < attackEffect.operations.length; i++) {
        instantCastOperation(attackingCard.uId, attackEffect.operations[i], ourDeck);
      }
    }

    // Retaliation
    attackingCard.health -= boardData[attackedPosition].attack;
    if (attackingCard.health <= 0) {
      handleCardDeath(attackingCard, ourDeck);
    }
    setPlayerDeck(ourDeck);

    if (boardData[attackedPosition].health <= 0) {
      boardData[attackedPosition] = null;
    }

    setOpponentBoardData(boardData);
    setUpdateSwitch(!updateSwitch);
  };

  const handleCardDeath = (deadCard, ourDeck) => {
    deadCard.health = 0;
    deadCard.position = 'userGrave';

    // Trigger that card's on death effect
    const effect = deadCard.onDeathEffect;
    if (effect) {
      for (let i = 0; i < effect.operations.length; i++) {
        instantCastOperation(deadCard.uId, effect.operations[i], ourDeck);
      }
    }
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
  };

  return (
    <CardContext.Provider value={{ cardDraggedToPosition, playerDeck }}>
      <DndProvider backend={HTML5Backend}>
        <div className='wrapper animate__animated animate__bounceIn'>
          <div className='userResourceRow'>
            {[...Array(opponentBoardData.currentResource)].map((resource, i) => (
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

        <div className='wrapper animate__animated animate__bounceIn'>
          {playerData.isPlayersTurn ? (
            <div className='endTurnRow'>
              <button className='woodEndButton' onClick={sendTurnChange}>
                End Turn
              </button>
            </div>
          ) : (
            <div></div>
          )}
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
            <UserGameInformation
              id='userInfo'
              lifeState={playerData.lifeTotal}
              lifeStateSet={setPlayerData}
            />
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
      </DndProvider>
    </CardContext.Provider>
  );
}

export default GameBoard;
