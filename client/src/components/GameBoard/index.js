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
// TODO: Make cards 69 and 70 have proactive effects
// TODO: Fix issue with ending turn before 2nd player loads in causing it to be no one's turn

// TODO: Test all effects

function GameBoard() {
  const { socket, gameId, deck, playerNumber } = useContext(GameContext);

  const [playerDeck, setPlayerDeck] = useState(GameLogic.initiatePlayerDeck(deck));

  const [playerData, setPlayerData] = useState({
    isPlayersTurn: true,
    hasInitiated: false,
    currentResource: 2,
    lifeTotal: 25
  });

  // This swings between true and false every time we need to update
  const [updateSwitch, setUpdateSwitch] = useState(false); 

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
    opponentLifeTotal: 25,
    opponentLost: false
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
        castEffect
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
        const functions = { setPlayerData, setUpdateSwitch, setPlayerDeck };
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
      castSpell(cardId, destinationPosition);
    } else if (cardVal.hasEffect) {
      const firstOp = cardVal.onPlayEffect.operations[0];
      // Make sure we're targetting a valid position
      if (Parser.getScriptTargets(firstOp).includes(destinationPosition)) {
        castEffect(cardId, destinationPosition, cardVal.onPlayEffect);
      }
    } else {
      moveCard(destinationPosition, cardVal);
    }
  };

  const castEffect = (cardId, target, effect, tempStates) => {
    let ourDeck;
    let ourData;
    let oppData;

    if (tempStates) {
      ourDeck = tempStates.ourDeck;
      ourData = tempStates.ourData;
      oppData = tempStates.oppData;
    } else {
      ourDeck = HelperFunctions.copyDeck(playerDeck);
      ourData = { ...playerData };
      oppData = { ...opponentBoardData };
    }

    const card = HelperFunctions.getCardWithId(cardId, ourDeck);
    const operations = effect.operations;

    for (let i = 0; i < operations.length; i++) {
      castOperation(cardId, target, operations[i], { ourDeck, ourData, oppData });
    }

    card.hasEffect = false;

    if (!tempStates) {
      setPlayerDeck(ourDeck);
      setPlayerData(ourData);
      setOpponentBoardData(oppData);
      setUpdateSwitch(!updateSwitch);
    }
  };

  const castSpell = (cardId, target) => {
    const ourDeck = HelperFunctions.copyDeck(playerDeck);
    const ourData = { ...playerData };
    const oppData = { ...opponentBoardData };

    const card = HelperFunctions.getCardWithId(cardId, ourDeck);
    const operations = card.onPlayEffect.operations;
    const positions = Parser.getScriptTargets(operations[0]);
    if (positions.includes(target) && ourData.currentResource >= card.resourceCost) {
      castEffect(cardId, target, card.onPlayEffect, { ourDeck, ourData, oppData });

      card.position = 'userGrave';
      ourData.currentResource -= card.resourceCost;

      setPlayerDeck(ourDeck);
      setPlayerData(ourData);
      setOpponentBoardData(oppData);
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
        Effects.instantRaiseAtkEffect(operation, tempStates);
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
          Effects.manualKillEffect(target, tempStates, castOperation);
        } else {
          Effects.instantKillEffect(tempStates);
        }
        break;

      default:
        break;
    }
  };

  const moveCard = (destinationPosition, cardVal) => {
    const states = { playerDeck, playerData, opponentBoardData, updateSwitch };
    const functions = {
      castEffect,
      setPlayerDeck,
      setPlayerData,
      setOpponentBoardData,
      setUpdateSwitch
    };

    if (
      destinationPosition !== 'userPlayArea' &&
      !HelperFunctions.isInDefenseRow(cardVal.position) &&
      !HelperFunctions.isPositionFilled(destinationPosition, playerDeck)
    ) {
      if (HelperFunctions.inOpponentRows(destinationPosition)) {
        // Attack card
        if (cardVal.position !== 'userPlayArea' && cardVal.attack > 0 && !cardVal.hasAttacked) {
          GameLogic.attackCard(cardVal.position, destinationPosition, states, functions);
        }
      } else if (cardVal.position === 'userPlayArea') {
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

  //Lose
  const [showModalLose, setShowModalLose] = useState(false);

  //redirect 
  const exitGameWin  = () => {
    window.location = '/profile';
    //need to update user db information 
  };
  const exitGameLose  = () => {
    window.location = '/profile';
        //need to update user db information 
  };

   
  // if(opponentBoardData.opponentLost === true) { 
  // setShowModalWin(true);
  // }

  //TESTING 
  // if(playerData.lifeTotal <= 24) { 
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
      <Modal className='avatarModal' show={opponentBoardData.opponentLost === true}>
        <Modal.Body className='modalBody'>
          <Container className='modalContainer'>
            <p>YOU WIN</p>
          </Container>
        </Modal.Body>
        <Modal.Footer className='modalFooter'>
          <Button variant='danger' className='closeButtonModal' onClick={exitGameWin}> Return To Profile </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL FOR LOSING  */}
      <Modal className='avatarModal' show={showModalLose}>
        <Modal.Body className='modalBody'>
          <Container className='modalContainer'>
            <p>YOU LOOSE</p>
          </Container>
        </Modal.Body>
        <Modal.Footer className='modalFooter'>
          <Button variant='danger' className='closeButtonModal' onClick={exitGameLose}> Return To Profile </Button>
        </Modal.Footer>
      </Modal>
    </CardContext.Provider>
  );
}

export default GameBoard;
