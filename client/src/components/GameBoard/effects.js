import HelperFunctions from './helperFunctions';
import GameLogic from './gameLogic';
import Parser from './cardScript';

export default {
  manualHealEffect: (target, operation, tempStates) => {
    const { oppData, ourDeck } = tempStates;

    // We need different behavior for if we're healing an enemy
    if (HelperFunctions.inOpponentRows(target)) {
      target = target.replace('opponent', 'user');
      const healedCard = oppData[target];
      if (healedCard) {
        healedCard.health += parseInt(operation.param2);
      }
    } else {
      // We're healing one of our own
      const healedCard = HelperFunctions.getCardInPosition(target, ourDeck);
      if (healedCard) {
        healedCard.health += parseInt(operation.param2);
      }
    }
  },

  manualDmgEffect: (target, operation, tempStates, castCallback) => {
    const { param1 } = operation;
    const { oppData, ourDeck } = tempStates;

    if (target === 'opponentGameInformation') {
      GameLogic.attackEnemyPlayer(oppData, parseInt(param1));
    } else if (HelperFunctions.inOpponentRows(target)) {
      target = target.replace('opponent', 'user');
      const damagedCard = oppData[target];
      if (damagedCard) {
        damagedCard.health -= parseInt(param1);
        if (damagedCard.health <= 0) {
          oppData[target] = null;
        }
      }
    } else {
      // We're hurting one of our own
      const damagedCard = HelperFunctions.getCardInPosition(target, ourDeck);
      if (damagedCard) {
        damagedCard.health -= parseInt(param1);
        if (damagedCard.health <= 0) {
          GameLogic.handleCardDeath(damagedCard, tempStates, castCallback);
        }
      }
    }
  },

  manualKillEffect: (target, tempStates, castCallback) => {
    const { ourDeck } = tempStates;

    // If we can't find the target, kill the first card we have
    const killedCard = HelperFunctions.getCardInPosition(target, ourDeck);

    if (killedCard) {
      GameLogic.handleCardDeath(killedCard, tempStates, castCallback);
    } else {
      const ourRows = [...HelperFunctions.userAtkRows, ...HelperFunctions.userDefRows];
      for (let i = 0; i < ourRows.length; i++) {
        const foundCard = HelperFunctions.getCardInPosition(ourRows[i], ourDeck);
        if (foundCard) {
          GameLogic.handleCardDeath(foundCard, tempStates, castCallback);
          return;
        }
      }
    }
  },

  manualAddEffect: (target, operation, tempStates) => {
    const { ourDeck } = tempStates;
    const { param1 } = operation;

    const parsedToken = Parser.tokenize(param1);

    const affectedCard = HelperFunctions.getCardInPosition(target, ourDeck);

    if (affectedCard) {
      HelperFunctions.addEffectToCard(affectedCard, parsedToken);
    } else {
      const ourRows = [...HelperFunctions.userAtkRows, ...HelperFunctions.userDefRows];
      for (let i = 0; i < ourRows.length; i++) {
        const foundCard = HelperFunctions.getCardInPosition(ourRows[i], ourDeck);
        if (foundCard) {
          HelperFunctions.addEffectToCard(foundCard, parsedToken);
          return;
        }
      }
    }
  },

  instantResEffect: (operation, tempStates) => {
    const { param1, param2 } = operation;
    const { ourData, oppData } = tempStates;

    let data = param1 === 'SELF' ? ourData : oppData;
    let resources = data.currentResource;
    resources = HelperFunctions.clamp(resources + parseInt(param2), 0, 9);
    data.currentResource = resources;
  },

  instantDrawEffect: (operation, tempStates) => {
    const { param1 } = operation;
    const { ourDeck } = tempStates;

    const handCount = HelperFunctions.countAllCardsInPosition('userPlayArea', ourDeck);
    let canDraw;
    if (param1 === 'FULL') {
      canDraw = HelperFunctions.clamp(5, 0, 5 - handCount);
    } else {
      canDraw = HelperFunctions.clamp(parseInt(param1), 0, 5 - handCount);
    }
    const indices = HelperFunctions.findFirstAvailableCards(canDraw, ourDeck);
    for (let i = 0; i < indices.length; i++) {
      ourDeck[indices[i]].position = 'userPlayArea';
    }
  },

  instantHealEffect: (casterId, operation, tempStates) => {
    const { param1, param2 } = operation;
    const { ourDeck } = tempStates;

    let positions;
    if (param1 === 'ALL') {
      positions = [...HelperFunctions.userAtkRows, ...HelperFunctions.userDefRows];
    } else if (param1 === 'DEFROW') {
      positions = HelperFunctions.userDefRows;
    } else if (param1 === 'ATKROW') {
      positions = HelperFunctions.userAtkRows;
    } else if (param1 === 'DEALT') {
      const card = HelperFunctions.getCardWithId(casterId, ourDeck);
      card.health += card.attack;
      return;
    }

    // Increase the health of the chosen cards
    for (let i = 0; i < positions.length; i++) {
      const card = HelperFunctions.getCardInPosition(positions[i], ourDeck);
      if (card) {
        card.health += parseInt(param2);
      }
    }
  },

  instantSetAtkEffect: (operation, tempStates) => {
    const { param1, param2 } = operation;
    const { oppData } = tempStates;

    let positions;
    if (param1 === 'OPPATKROW') {
      positions = HelperFunctions.userAtkRows;
    }

    // Increase the attack of all of our cards
    for (let i = 0; i < positions.length; i++) {
      if (oppData[positions[i]]) {
        oppData[positions[i]].attack = parseInt(param2);
      }
    }
  },

  instantRaiseAtkEffect: (operation, tempStates) => {
    const { param1, param2 } = operation;
    const { ourDeck } = tempStates;

    let positions;
    if (param1 === 'ALL') {
      positions = [...HelperFunctions.userAtkRows, ...HelperFunctions.userDefRows];
    } else if (param1 === 'ATKROW') {
      positions = HelperFunctions.userAtkRows;
    } else if (param1 === 'DEFROW') {
      positions = HelperFunctions.userDefRows;
    }

    // Increase the attack of all of our cards
    for (let i = 0; i < positions.length; i++) {
      const card = HelperFunctions.getCardInPosition(positions[i], ourDeck);
      if (card) {
        card.attack = HelperFunctions.clamp(card.attack + parseInt(param2), 0, 100);
      }
    }
  },

  instantTopDeckEffect: (casterId, tempStates) => {
    const { ourDeck } = tempStates;

    const card = HelperFunctions.getCardWithId(casterId, ourDeck);
    card.position = '';

    for (let i = 0; i < ourDeck.length; i++) {
      if (ourDeck[i].uId === card.uId) {
        ourDeck[i] = ourDeck[0];
        return;
      }
    }
    ourDeck[0] = card;
  },

  instantDmgEffect: (operation, tempStates, castCallback) => {
    const { param2 } = operation;
    const { ourDeck } = tempStates;

    // We're hurting one of our own
    const positions = [...HelperFunctions.userAtkRows, ...HelperFunctions.userDefRows];

    for (let i = 0; i < positions.length; i++) {
      const card = HelperFunctions.getCardInPosition(positions[i], ourDeck);
      if (card) {
        card.health -= parseInt(param2);

        if (card.health <= 0) {
          GameLogic.handleCardDeath(card, tempStates, castCallback);
        }
      }
    }
  },

  instantKillEffect: tempStates => {
    const { oppData } = tempStates;

    const oppDefRow = HelperFunctions.userDefRows;

    for (let i = 0; i < oppDefRow.length; i++) {
      oppData[oppDefRow[i]] = null;
    }
  }
};
