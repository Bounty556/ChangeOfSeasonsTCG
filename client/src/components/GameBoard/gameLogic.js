import HelperFunctions from './helperFunctions';
import Parser from './cardScript';

export default {
  drawCard: (playerDeck, setPlayerDeck) => {
    const indices = HelperFunctions.findFirstAvailableCards(1, playerDeck);

    if (indices.length > 0) {
      const cardVal = { ...playerDeck[indices[0]] };
      cardVal.position = 'userPlayArea';
      setPlayerDeck([...playerDeck.filter(card => card.uId !== cardVal.uId), cardVal]);
    }
  },

  handleCardDeath: (deadCard, deck, effectCallback) => {
    deadCard.health = 0;
    deadCard.position = 'userGrave';

    // Trigger that card's on death effect
    const effect = deadCard.onDeathEffect;
    if (effect) {
      for (let i = 0; i < effect.operations.length; i++) {
        effectCallback(deadCard.uId, effect.operations[i], deck);
      }
    }
  },

  attackCard: function (attackingCardPosition, attackedPosition, states, functions) {
    const { opponentBoardData, playerDeck, updateSwitch } = states;
    const {
      instantCastOperation,
      setPlayerDeck,
      setOpponentBoardData,
      setUpdateSwitch
    } = functions;
    const ourDeck = HelperFunctions.copyDeck(playerDeck);
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
      this.handleCardDeath(attackingCard, ourDeck, instantCastOperation);
    }
    setPlayerDeck(ourDeck);

    if (boardData[attackedPosition].health <= 0) {
      boardData[attackedPosition] = null;
    }

    setOpponentBoardData(boardData);
    setUpdateSwitch(!updateSwitch);
  },

  initiatePlayerDeck: deck => {
    return deck.map(card => {
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
    });
  },

  endTurn: function (states, functions) {
    const { playerData, updateSwitch, playerDeck } = states;
    const { setPlayerData, setUpdateSwitch, setPlayerDeck, setEffectData } = functions;

    const tempData = { ...playerData };
    tempData.isPlayersTurn = false;
    if (tempData.currentResource <= 8) {
      tempData.currentResource += 1;
    }
    setPlayerData(tempData);
    // Check to see the amount of cards in the players hands and draws a card if able
    const handCount = HelperFunctions.countAllCardsInPosition('userPlayArea', playerDeck);
    if (handCount < 5) {
      this.drawCard(playerDeck, setPlayerDeck);
    }

    setEffectData(null); // They may have wasted any spells they could've cast

    setUpdateSwitch(!updateSwitch);
  },

  updateBoard: (otherDeck, otherData, ourData, playerNumber, player, states, functions) => {
    const { playerDeck, playerData, updateSwitch, opponentBoardData } = states;
    const {
      setPlayerDeck,
      setPlayerData,
      setUpdateSwitch,
      setOpponentBoardData,
      instantCastOperation
    } = functions;

    if (player === playerNumber) {
      return;
    }

    // Update our opponent board data
    const boardData = {
      ...opponentBoardData,
      userDef1: null,
      userDef2: null,
      userAtt1: null,
      userAtt2: null,
      userAtt3: null,
      currentResource: otherData.currentResource
    };

    const opponentCards = HelperFunctions.getPlayedCards(otherDeck);
    for (let i = 0; i < opponentCards.length; i++) {
      boardData[opponentCards[i].position] = opponentCards[i];
    }

    boardData.opponentBoardData = HelperFunctions.hasAvailableCards(otherDeck);
    boardData.opponentPlayAreaCount = HelperFunctions.countAllCardsInPosition(
      'userPlayArea',
      otherDeck
    );

    setOpponentBoardData(boardData);

    if (playerData.hasInitiated) {
      // Update our board data
      setPlayerData(prevState => ({ ...prevState, currentResource: ourData.currentResource }));

      let ourDeck = HelperFunctions.copyDeck(playerDeck);
      let deadCards = [null, null, null, null, null];
      [deadCards[0], ourDeck] = HelperFunctions.compareCards('userDef1', ourData, ourDeck);
      [deadCards[1], ourDeck] = HelperFunctions.compareCards('userDef2', ourData, ourDeck);
      [deadCards[2], ourDeck] = HelperFunctions.compareCards('userAtt1', ourData, ourDeck);
      [deadCards[3], ourDeck] = HelperFunctions.compareCards('userAtt2', ourData, ourDeck);
      [deadCards[4], ourDeck] = HelperFunctions.compareCards('userAtt3', ourData, ourDeck);

      let deadCard;
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
        setPlayerDeck(ourDeck);
        setUpdateSwitch(!updateSwitch);
      } else {
        setPlayerDeck(ourDeck);
      }
    }
  }
};
