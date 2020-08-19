import HelperFunctions from './helperFunctions';
import Parser from './cardScript';

export default {
  drawCard: deck => {
    const indices = HelperFunctions.findFirstAvailableCards(1, deck);

    if (indices.length > 0) {
      deck[indices[0]].position = 'userPlayArea';
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
    const { playerDeck, playerData, opponentBoardData, updateSwitch } = states;
    const {
      castEffect,
      setPlayerDeck,
      setPlayerData,
      setOpponentBoardData,
      setUpdateSwitch
    } = functions;

    const ourDeck = HelperFunctions.copyDeck(playerDeck);
    const ourData = { ...playerData };
    const oppData = { ...opponentBoardData };
    const card = HelperFunctions.getCardInPosition(attackingCardPosition, ourDeck);

    if (
      attackedPosition === 'opponentGameInformation' &&
      !HelperFunctions.opponentHasDef(oppData)
    ) {
      oppData.opponentLifeTotal -= card.attack;
      card.hasAttacked = true;
    } else if (HelperFunctions.isOpponentPositionFilled(attackedPosition, oppData)) {
      attackedPosition = attackedPosition.replace('opponent', 'user');
      
      card.health -= oppData[attackedPosition].attack;
      if (card.health <= 0) {
        this.handleCardDeath(card, ourDeck, castEffect);
      }

      const attackEffect = card.onAttackEffect;
      if (attackEffect) {
        castEffect(card.uId, null, attackEffect, { ourDeck, ourData, oppData });
      }

      oppData[attackedPosition].health -= card.attack;
      card.hasAttacked = true;
      if (oppData[attackedPosition].health <= 0) {
        oppData[attackedPosition] = null;
      }
    }

    setPlayerDeck(ourDeck);
    setPlayerData(ourData);
    setOpponentBoardData(oppData);
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
      card.hasAttacked = false;
      card.hasEffect = false;

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
          default:
            break;
        }
      }
      return card;
    });
  },

  playCard: (cardVal, destinationPosition, states, functions) => {
    const { playerDeck, playerData, opponentBoardData, updateSwitch } = states;
    const {
      castEffect,
      setPlayerDeck,
      setPlayerData,
      setOpponentBoardData,
      setUpdateSwitch
    } = functions;

    const ourDeck = HelperFunctions.copyDeck(playerDeck);
    const ourData = { ...playerData };
    const oppData = { ...opponentBoardData };
    const card = HelperFunctions.getCardWithId(cardVal.uId, ourDeck);

    if (ourData.currentResource >= card.resourceCost) {
      ourData.currentResource -= card.resourceCost;
      card.position = destinationPosition;
    } else {
      return;
    }

    // Set that we're now starting an effect if this card has one
    const effect = card.onPlayEffect;
    if (effect) {
      if (Parser.canInstaCast(effect.operations[0])) {
        castEffect(card.uId, null, effect, { ourDeck, ourData, oppData });
      } else {
        card.hasEffect = true;
      }
    }

    setPlayerData(ourData);
    setPlayerDeck(ourDeck);
    setOpponentBoardData(oppData);
    setUpdateSwitch(!updateSwitch);
  },

  endTurn: function (states, functions) {
    const { playerData, updateSwitch, playerDeck } = states;
    const { setPlayerData, setUpdateSwitch, setPlayerDeck } = functions;

    const ourData = { ...playerData };
    const ourDeck = HelperFunctions.copyDeck(playerDeck);

    ourData.isPlayersTurn = false;
    if (ourData.currentResource <= 8) {
      ourData.currentResource += 1;
    }
    // Check to see the amount of cards in the players hands and draws a card if able
    const handCount = HelperFunctions.countAllCardsInPosition('userPlayArea', ourDeck);
    if (handCount < 5) {
      this.drawCard(ourDeck);
    }
    
    // Reset attacked and effects flags for all cards
    for (let i = 0; i < ourDeck.length; i++) {
      ourDeck[i].hasAttacked = false;
      ourDeck[i].hasEffect = false;
    }
    
    setPlayerDeck(ourDeck);
    setPlayerData(ourData);
    setUpdateSwitch(!updateSwitch);
  },

  updateBoard: (otherDeck, otherData, ourData, playerNumber, player, states, functions) => {
    const { playerDeck, playerData, updateSwitch, opponentBoardData } = states;
    const {
      setPlayerDeck,
      setPlayerData,
      setUpdateSwitch,
      setOpponentBoardData,
      castEffect
    } = functions;

    const boardData = {
      ...opponentBoardData,
      userDef1: null,
      userDef2: null,
      userAtt1: null,
      userAtt2: null,
      userAtt3: null,
      currentResource: otherData.currentResource
    };
    let newPlayerDeck = HelperFunctions.copyDeck(playerDeck);
    const newPlayerData = { ...playerData };

    if (player === playerNumber) {
      return;
    }

    const opponentCards = HelperFunctions.getPlayedCards(otherDeck);
    for (let i = 0; i < opponentCards.length; i++) {
      boardData[opponentCards[i].position] = opponentCards[i];
    }

    boardData.opponentBoardData = HelperFunctions.hasAvailableCards(otherDeck);
    boardData.opponentPlayAreaCount = HelperFunctions.countAllCardsInPosition(
      'userPlayArea',
      otherDeck
    );

    if (playerData.hasInitiated) {
      // Update our board data
      newPlayerData.currentResource = ourData.currentResource;
      newPlayerData.lifeTotal = ourData.opponentLifeTotal;

      let deadCards = [null, null, null, null, null];
      [deadCards[0], newPlayerDeck] = HelperFunctions.compareCards(
        'userDef1',
        ourData,
        newPlayerDeck
      );
      [deadCards[1], newPlayerDeck] = HelperFunctions.compareCards(
        'userDef2',
        ourData,
        newPlayerDeck
      );
      [deadCards[2], newPlayerDeck] = HelperFunctions.compareCards(
        'userAtt1',
        ourData,
        newPlayerDeck
      );
      [deadCards[3], newPlayerDeck] = HelperFunctions.compareCards(
        'userAtt2',
        ourData,
        newPlayerDeck
      );
      [deadCards[4], newPlayerDeck] = HelperFunctions.compareCards(
        'userAtt3',
        ourData,
        newPlayerDeck
      );

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
          castEffect(deadCard.uId, null, effect, {
            ourDeck: newPlayerDeck,
            ourData: newPlayerData,
            oppData: boardData
          });
        }
        setPlayerDeck(newPlayerDeck);
        setPlayerData(newPlayerData);
        setOpponentBoardData(boardData);
        setUpdateSwitch(!updateSwitch);
      } else {
        setPlayerDeck(newPlayerDeck);
        setPlayerData(newPlayerData);
        setOpponentBoardData(boardData);
      }
    }
  }
};
