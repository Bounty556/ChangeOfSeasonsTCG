export default {
  enemyAtkRows: ['opponentAtt1', 'opponentAtt2', 'opponentAtt3'],
  enemyDefRows: ['opponentDef1', 'opponentDef2'],
  userAtkRows: ['userAtt1', 'userAtt2', 'userAtt3'],
  userDefRows: ['userDef1', 'userDef2'],
  // prettier-ignore
  springDeck: [1, 1, 5, 9, 9, 13, 17, 17, 21, 21, 25, 25, 29, 29, 33, 33, 37, 37, 41, 41, 45, 45, 49, 49, 53, 53, 57, 61, 65, 69],
  // prettier-ignore
  summerDeck: [2, 2, 6, 6, 10, 14, 18, 18, 22, 22, 26, 26, 30, 30, 34, 34, 38, 38, 42, 42, 46, 46, 50, 50, 54, 54, 58, 62, 66, 70],
  // prettier-ignore
  //fallDeck: [3, 3, 7, 11, 11, 15, 19, 19, 23, 23, 27, 27, 31, 31, 35, 35, 39, 39, 43, 43, 47, 47, 51, 51, 55, 55, 59, 63, 67, 71],
  fallDeck: [3, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
  // prettier-ignore
  winterDeck: [4, 4, 8, 8, 12, 16, 20, 20, 24, 24, 28, 28, 32, 32, 36, 36, 40, 40, 44, 44, 48, 48, 52, 52, 56, 56, 60, 64, 68, 72],

  duplicate: function (array, tempDeck) {
    const newDeck = [];
    for (let i = 0; i < tempDeck.length; i++) {
      for (let j = 0; j < array.length; j++) {
        if (array[j].cardId === tempDeck[i]) {
          newDeck.push({ ...array[j], uId: i, key: 'gameCard' + i }); // Give this card a unique Id
          break;
        }
      }
    }
    return newDeck;
  },

  copyDeck: function (array) {
    const copy = array.map(el => {
      return { ...el };
    });

    return copy;
  },

  deckChoice: function (array) {
    let deckC;
    switch (array[0].cardId) {
      case 1:
        deckC = this.springDeck;
        break;
      case 2:
        deckC = this.summerDeck;
        break;
      case 3:
        deckC = this.fallDeck;
        break;
      case 4:
        deckC = this.winterDeck;
        break;
      default:
        console.log('You do not have a deck');
    }
    return this.duplicate(array, deckC);
  },

  shuffleArray: function (array) {
    var max = array.length / 4;
    var min = 0;
    for (let i = 0; i < 4; i++) {
      //Randomly generate a random index number
      for (let j = 0; j < 20; j++) {
        const randomIndex1 = Math.floor(Math.random() * (max - min) + min);
        const randomIndex2 = Math.floor(Math.random() * (max - min) + min);
        // Swap these elements in the array
        if (randomIndex1 !== randomIndex2) {
          const tempElement = array[randomIndex1];
          array[randomIndex1] = array[randomIndex2];
          array[randomIndex2] = tempElement;
        }
      }
      max += array.length / 4;
      min += array.length / 4;
    }
    return array;
  },

  // Assigns the first 5 cards in the deck to be in the player's hand
  assignHand: function (deck) {
    for (let i = 0; i < 5; i++) {
      deck[i].position = 'userPlayArea';
    }

    return deck;
  },

  inOpponentRows: function (position) {
    return this.enemyAtkRows.includes(position) || this.enemyDefRows.includes(position);
  },

  isPositionFilled: function (position, deck) {
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].position === position) {
        return true;
      }
    }

    return false;
  },

  isOpponentPositionFilled: function (position, opponentData) {
    position = position.replace('opponent', 'user');

    return opponentData[position];
  },

  damageCard: function (position, damage, deck) {
    let cardDied = null;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].position === position) {
        deck[i].health -= damage;

        if (deck[i].health <= 0) {
          deck[i].position = 'userGrave';
          deck[i].health = 0;
          cardDied = { ...deck[i] };
        }

        break;
      }
    }

    return [deck, cardDied];
  },

  hasAvailableCards: function (deck) {
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].position === '') {
        return true;
      }
    }

    return false;
  },

  findFirstAvailableCards: function (cardCount, deck) {
    const availableCardIndices = [];
    let foundCards = 0;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].position === '') {
        availableCardIndices.push(i);
        foundCards++;

        if (foundCards === cardCount) {
          break;
        }
      }
    }

    return availableCardIndices;
  },

  isInDefenseRow: function (position) {
    return this.userDefRows.includes(position);
  },

  getCardInPosition: function (position, deck) {
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].position === position) {
        return { ...deck[i] };
      }
    }

    return null;
  },

  countAllCardsInPosition: function (position, deck) {
    let occurs = 0;

    for (let i = 0; i < deck.length; i++) {
      if ('position' in deck[i] && deck[i].position === position) occurs++;
    }
    return occurs;
  },

  getPlayedCards: function (deck) {
    const playedCards = [];
    for (let i = 0; i < deck.length; i++) {
      if (
        this.userAtkRows.includes(deck[i].position) ||
        this.userDefRows.includes(deck[i].position)
      ) {
        playedCards.push(deck[i]);
      }
    }

    return playedCards;
  },

  compareCards: function (position, ourData, ourDeck) {
    let theirCard = ourData[position];
    let ourCard = this.getCardInPosition(position, ourDeck);

    // Our card died
    if (!theirCard && ourCard) {
      ourCard.health = 0;
      ourCard.position = 'userGrave';
      ourDeck = [...ourDeck.filter(card => card.uId !== ourCard.uId), ourCard];
      return [ourCard, ourDeck];
    } else if (!theirCard && !ourCard) {
      return [null, ourDeck];
    } else {
      ourCard.health = theirCard.health;
      ourCard.attack = theirCard.attack;
      ourDeck = [...ourDeck.filter(card => card.uId !== ourCard.uId), ourCard];
      return [null, ourDeck];
    }
  },

  clamp: function (num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
  }
};
