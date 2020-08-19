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

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from '../../components/Container/index';


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
// TODO: Be able to attack the opponent when his defense row is down
// TODO: Replace opponents grave with player to attack
// TODO: Spell cards should only trigger their effect
// TODO: Players should still be able to use cards if another card has an active effect

// TODO: Make cards 69 and 70 have proactive effects
// TODO: Fix issue with ending turn before 2nd player loads in causing it to be no one's turn

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

  const [effectData, setEffectData] = useState(null);

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
      instantCastOperation
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

  const instantCastOperation = (cardId, operation, useDeck, useData) => {
    const states = { playerDeck, playerData, opponentBoardData };
    const functions = { setPlayerDeck, setPlayerData, setOpponentBoardData };
    switch (operation.op) {
      case 'RES':
        Effects.instantResEffect(operation, useData, states, functions);
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

  const increaseEffectOperation = (effectParam, deck, data) => {
    if (!effectParam) {
      effectParam = { ...effectData };
    }

    for (let i = effectParam.currentOperation + 1; i < effectParam.effect.operations.length; i++) {
      if (Parser.canInstaCast(effectParam.effect.operations[i])) {
        instantCastOperation(effectParam.cardId, effectParam.effect.operations[i], deck, data);
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

  //modal code 
  //WIN
  const [showModalWin, setShowModalWin] = useState(false);

  const handleCloseModalWin = () => {
    setShowModalWin(false);
  }
  //Lose
  const [showModalLose, setShowModalLose] = useState(false);

  const handleCloseModalLose = () => {
    setShowModalLose(false);
  }

  //TESTING 
  // if(opponentBoardData.opponentLifeTotal <= 24) { 
  //   setShowModal(true)
  // }


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
            <p style={{textAlign: 'center'}}>Waiting for Opponent to Finish their turn.</p>
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
      {/* MODAL FOR WINNING  */}
      <Modal className='avatarModal' show={showModalWin} onHide={handleCloseModalWin}>
        <Modal.Body className='modalBody'>
          <Container className='modalContainer'>
            <p>YOU WIN</p>
          </Container>
        </Modal.Body>
        <Modal.Footer className='modalFooter'>
          <Button variant='danger' className='closeButtonModal' onClick={handleCloseModalWin}> Return To Profile </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL FOR LOSING  */}
      <Modal className='avatarModal' show={showModalLose} onHide={handleCloseModalLose}>
        <Modal.Body className='modalBody'>
          <Container className='modalContainer'>
            <p>YOU LOOSE</p>
          </Container>
        </Modal.Body>
        <Modal.Footer className='modalFooter'>
          <Button variant='danger' className='closeButtonModal' onClick={handleCloseModalLose}> Return To Profile </Button>
        </Modal.Footer>
      </Modal>
    </CardContext.Provider>
  );
}

export default GameBoard;
