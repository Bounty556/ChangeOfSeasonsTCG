import GameLogic from './gameLogic';

export default {
  manualHealEffect: (destinationPosition, states, functions) => {
    const { effectData, opponentBoardData, playerDeck, updateSwitch } = states;
    const {
      setOpponentBoardData,
      setPlayerDeck,
      increaseEffectOperation,
      setUpdateSwitch
    } = functions;
    const operation = effectData.effect.operations[effectData.currentOperation];
    // We need different behavior for if we're healing an enemy
    if (GameLogic.inOpponentRows(destinationPosition)) {
      destinationPosition = destinationPosition.replace('opponent', 'user');
      const boardData = { ...opponentBoardData };
      const destinationCard = boardData[destinationPosition];
      if (!destinationCard) {
        return;
      }
      destinationCard.health += parseInt(operation.param2);
      setOpponentBoardData(boardData);
    } else {
      // We're healing one of our own
      const deck = GameLogic.copyDeck(playerDeck);
      const destinationCard = GameLogic.getCardInPosition(destinationPosition, deck);
      if (!destinationCard) {
        return;
      }
      destinationCard.health += parseInt(operation.param2);
      setPlayerDeck(deck);
    }
    increaseEffectOperation();
    setUpdateSwitch(!updateSwitch);
  },

  manualDmgEffect: (destinationPosition, states, functions) => {
    const { effectData, opponentBoardData, playerDeck, updateSwitch } = states;
    const {
      setOpponentBoardData,
      setPlayerDeck,
      increaseEffectOperation,
      setUpdateSwitch,
      handleCardDeath
    } = functions;
    const operation = effectData.effect.operations[effectData.currentOperation];

    // We need different behavior for if we're hurting an enemy
    if (GameLogic.inOpponentRows(destinationPosition)) {
      destinationPosition = destinationPosition.replace('opponent', 'user');
      const boardData = { ...opponentBoardData };
      const destinationCard = boardData[destinationPosition];
      if (!destinationCard) {
        return;
      }
      destinationCard.health -= parseInt(operation.param1);
      if (destinationCard.health <= 0) {
        boardData[destinationPosition] = null;
      }
      setOpponentBoardData(boardData);
    } else {
      // We're hurting one of our own
      const ourDeck = GameLogic.copyDeck(playerDeck);
      const destinationCard = GameLogic.getCardInPosition(destinationPosition, ourDeck);
      if (!destinationCard) {
        return;
      }
      destinationCard.health -= parseInt(operation.param1);
      if (destinationCard.health <= 0) {
        handleCardDeath(destinationCard, ourDeck);
      }
      setPlayerDeck(ourDeck);
    }
    increaseEffectOperation();
    setUpdateSwitch(!updateSwitch);
  },

  instantResEffect: (operation, states, functions) => {
    const { param1, param2 } = operation;
    const { playerData, opponentBoardData } = states;
    const { setPlayerData, setOpponentBoardData } = functions;

    if (param1 === 'SELF') {
      let currentResources = playerData.currentResource;
      currentResources = GameLogic.clamp(currentResources + parseInt(param2), 0, 9);
      setPlayerData(prevState => ({ ...prevState, currentResource: currentResources }));
    } else if (param1 === 'OPP') {
      let currentResources = opponentBoardData.currentResource;
      currentResources = GameLogic.clamp(currentResources + parseInt(param2), 0, 9);
      setOpponentBoardData(prevState => ({ ...prevState, currentResource: currentResources }));
    }
  },

  instantDrawEffect: (operation, useDeck, states, functions) => {
    const { param1 } = operation;
    const { playerDeck } = states;
    const { setPlayerDeck } = functions;

    const deck = useDeck || GameLogic.copyDeck(playerDeck);
    const handCount = GameLogic.countAllCardsInPosition('userPlayArea', deck);
    let canDraw;
    if (param1 === 'FULL') {
      canDraw = GameLogic.clamp(5, 0, 5 - handCount);
    } else {
      canDraw = GameLogic.clamp(parseInt(param1), 0, 5 - handCount);
    }
    const indices = GameLogic.findFirstAvailableCards(canDraw, deck);
    for (let i = 0; i < indices.length; i++) {
      deck[indices[i]].position = 'userPlayArea';
    }
    if (!useDeck) {
      setPlayerDeck(deck);
    }
  },

  instantHealEffect: (cardId, operation, useDeck, states, functions) => {
    const { param1, param2 } = operation;
    const { playerDeck } = states;
    const { setPlayerDeck } = functions;

    let deck = useDeck || GameLogic.copyDeck(playerDeck);
    let positions;
    if (param1 === 'ALL') {
      positions = [...GameLogic.userAtkRows, ...GameLogic.userDefRows];
    } else if (param1 === 'DEFROW') {
      positions = GameLogic.userDefRows;
    } else if (param1 === 'ATKROW') {
      positions = GameLogic.userAtkRows;
    } else if (param1 === 'DEALT') {
      const card = GameLogic.getCardWithId(cardId, deck);
      card.health += card.attack;
      return;
    }

    // Increase the health of the chosen cards
    for (let i = 0; i < positions.length; i++) {
      const card = GameLogic.getCardInPosition(positions[i], deck);
      if (card) {
        card.health += parseInt(param2);
      }
    }

    if (!useDeck) {
      setPlayerDeck(deck);
    }
  },

  instantRaiseAtkEffect: (operation, useDeck, states, functions) => {
    const { param1, param2 } = operation;
    const { playerDeck } = states;
    const { setPlayerDeck } = functions;

    let deck = useDeck || GameLogic.copyDeck(playerDeck);
    let positions;
    if (param1 === 'ALL') {
      positions = [...GameLogic.userAtkRows, ...GameLogic.userDefRows];
    } else if (param1 === 'ATKROW') {
      positions = GameLogic.userAtkRows;
    } else if (param1 === 'DEFROW') {
      positions = GameLogic.userDefRows;
    }

    // Increase the attack of all of our cards
    for (let i = 0; i < positions.length; i++) {
      const card = GameLogic.getCardInPosition(positions[i], deck);
      if (card) {
        card.attack = GameLogic.clamp(card.attack + parseInt(param2), 0, 100);
      }
    }

    if (!useDeck) {
      setPlayerDeck(deck);
    }
  },

  instantTopDeckEffect: (cardId, useDeck, states, functions) => {
    const { playerDeck } = states;
    const { setPlayerDeck } = functions;

    let deck = useDeck || GameLogic.copyDeck(playerDeck);
    const card = GameLogic.getCardWithId(cardId, deck);
    card.position = '';

    for (let i = 0; i < deck.length; i++) {
      if (deck[i].uId === card.uId) {
        deck[i] = deck[0];
        return;
      }
    }
    deck[0] = card;

    if (!useDeck) {
      setPlayerDeck(deck);
    }
  },

  instantDmgEffect: (operation, useDeck, states, functions) => {
    const { param2 } = operation;
    const { playerDeck } = states;
    const { setPlayerDeck, handleCardDeath } = functions;
    // We're hurting one of our own
    const deck = useDeck || GameLogic.copyDeck(playerDeck);
    const positions = [...GameLogic.userAtkRows, ...GameLogic.userDefRows];

    for (let i = 0; i < positions.length; i++) {
      const card = GameLogic.getCardInPosition(positions[i], deck);
      if (card) {
        card.health -= parseInt(param2);

        if (card.health <= 0) {
          handleCardDeath(card, deck);
        }
      }
    }

    if (!useDeck) {
      setPlayerDeck(deck);
    }
  }
};
