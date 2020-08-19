import React, { useState, useEffect, useContext, createContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import CardPlaceHolder from '../CardPlaceHolder';
import CardHolder from '../CardHolder';
import UserGameInformation from '../UserGameInformation';
import { GameContext } from '../../pages/Lobby';

import HelperFunctions from './helperFunctions';
import GameLogic from './gameLogic';
import Parser from './cardScript';
import Effects from './effects';

import './gameboard.css';

// Give this function to the children of this component so they can tell us when
// A card was dropped on them
export const CardContext = createContext({
  cardDraggedToPosition: null,
  playerDeck: null
});

// TODO: When we drag a card and hover it over a card slot, it should make the slot go grey or
//       something similar so the user has some kind of feedback
// TODO: Make effects work
// TODO: Players should still be able to use cards if another card has an active effect
// TODO: Add endgame

// TODO: Make cards 69 and 70 have proactive effects
// TODO: Fix issue with ending turn before 2nd player loads in causing it to be no one's turn

// TODO: Reimplement card 15

function GameBoard() {
  const { socket, gameId, deck, playerNumber } = useContext(GameContext);

  const [playerDeck, setPlayerDeck] = useState(GameLogic.initiatePlayerDeck(deck));

  const [playerData, setPlayerData] = useState({
    isPlayersTurn: true,
    hasInitiated: false,
    currentResource: 2,
    lifeTotal: 25
  });

  const [updateSwitch, setUpdateSwitch] = useState(false); // This swings between true and false every time we need to update

  const [opponentBoardData, setOpponentBoardData] = useState({
    opponentPlayAreaCount: 5,
    opponentHasDeck: true,
    userDef1: null,
    userDef2: null,
    userAtt1: null,
    userAtt2: null,
    userAtt3: null,
    userGameInformation: null,
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
      const states = { playerDeck, playerData, updateSwitch, opponentBoardData };
      const functions = {
        setPlayerDeck,
        setPlayerData,
        setUpdateSwitch,
        setOpponentBoardData,
        instantCastOperation
      };
      GameLogic.updateBoard(otherDeck, otherData, ourData, playerNumber, player, states, functions);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerDeck, playerData, opponentBoardData]);

  useEffect(() => {
    socket.off('ourTurn');
    socket.on('ourTurn', ({ fromPlayer }) => {
      if (fromPlayer !== playerNumber) {
        setPlayerData(prevState => ({ ...prevState, isPlayersTurn: true }));
      } else {
        const states = { playerData, updateSwitch, playerDeck };
        const functions = { setPlayerData, setUpdateSwitch, setPlayerDeck, setEffectData };
        GameLogic.endTurn(states, functions);
      }
    });
  }, [updateSwitch, playerData, playerDeck]);

  useEffect(() => {
    const copy = HelperFunctions.copyDeck(playerDeck);
    setPlayerDeck(
      HelperFunctions.assignHand(HelperFunctions.shuffleArray(HelperFunctions.deckChoice(copy)))
    );
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

    if (!playerData.isPlayersTurn) {
      return;
    }

    if (!cardVal.isCreature) {
      castSpell(destinationPosition, cardId);
    } else if (effectData) {
      castEffect(destinationPosition, cardId);
    } else {
      moveCard(destinationPosition, cardVal);
    }
  };

  const castSpell = (destinationPosition, cardId) => {
    // Make sure we're targeting the right position
    const deck = HelperFunctions.copyDeck(playerDeck);
    const card = HelperFunctions.getCardWithId(cardId, deck);
    const effect = card.onPlayEffect;
    const positions = Parser.getScriptTargets(effect.operations[0]);
    const data = { ...playerData };

    if (positions.includes(destinationPosition) && data.currentResource >= card.resourceCost) {
      for (let i = 0; i < effect.operations.length; i++) {
        instantCastOperation(cardId, effect.operations[i], deck, data);
      }

      card.position = 'userGrave';
      data.currentResource -= card.resourceCost;

      setPlayerData(data);
      setPlayerDeck(deck);
      setUpdateSwitch(!updateSwitch);
    }
  };

  const castOperation = (casterId, target, operation, tempStates) => {
    switch (operation.op) {
      case 'RES':
        Effects.instantResEffect(operation, tempStates);
        break;

      case 'DRAW':
        Effects.instantDrawEffect(operation, tempStates);
        break;

      case 'HEAL':
        if (operation.param1 === 'SINGLE') {
          Effects.manualHealEffect(target, operation, tempStates);
        } else {
          Effects.instantHealEffect(casterId, operation, tempStates);
        }
        break;

      case 'RAISEATK':
        Effects.instantRaiseAtkEffect(operation, useDeck, states, functions);
        break;

      case 'TOPDECK':
        Effects.instantTopDeckEffect(casterId, tempStates);
        break;

      case 'DMG':
        if (operation.param1 === 'ALL') {
          Effects.instantDmgEffect(operation, tempStates, castOperation);
        } else {
          Effects.manualDmgEffect(target, tempStates, castOperation);
        }
        break;

      case 'KILL':
        if (operation.param1 === 'SELF') {
          Effects.manualKillEffect(target, operation, tempStates, castOperation);
        } else {
          Effects.instantKillEffect(tempStates);
        }
        break;

      default:
        break;
    }
  };

  const moveCard = (destinationPosition, cardVal) => {
    if (
      destinationPosition !== 'userPlayArea' ||
      HelperFunctions.isInDefenseRow(cardVal.position) ||
      HelperFunctions.isPositionFilled(destinationPosition, playerDeck)
    ) {
      if (HelperFunctions.inOpponentRows(destinationPosition)) {
        // Attack card
        if (cardVal.position !== 'userPlayArea' && cardVal.attack > 0 && !cardVal.hasAttacked) {
          const states = { opponentBoardData, playerDeck, updateSwitch };
          const functions = {
            instantCastOperation,
            setPlayerDeck,
            setOpponentBoardData,
            setUpdateSwitch
          };
          return GameLogic.attackCard(cardVal.position, destinationPosition, states, functions);
        } else {
          return;
        }
      }

      if (cardVal.position === 'userPlayArea') {
        const states = { playerDeck, playerData, updateSwitch };
        const functions = {
          increaseEffectOperation,
          setPlayerDeck,
          setPlayerData,
          setUpdateSwitch
        };
        GameLogic.playCard(cardVal, destinationPosition, states, functions);
      }
    }
  };

  const sendTurnChange = () => {
    socket.emit('room', gameId, 'ourTurn', {
      fromPlayer: playerNumber
    });
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
            <UserGameInformation
              id='opponentGameInformation'
              lifeState={opponentBoardData.opponentLifeTotal}
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
              cardCount={HelperFunctions.hasAvailableCards(playerDeck) ? 1 : 0}
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
