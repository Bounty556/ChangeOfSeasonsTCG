export default {
  enemyAtkRows: ['opponentAtt1', 'opponentAtt2', 'opponentAtt3'],
  enemyDefRows: ['opponentDef1', 'opponentDef2'],
  dupDeck: [],
  springDeck: [1, 1, 5, 9, 9, 13, 17, 17, 21, 21, 25, 25, 29, 29, 33, 33, 37, 37, 41, 41, 45, 45, 49, 49, 53, 53, 57, 61, 65, 69],
  summerDeck: [2, 2, 6, 6, 10, 14, 18, 18, 22, 22, 26, 26, 30, 30, 34, 34, 38, 38, 42, 42, 46, 46, 50, 50, 54, 54, 58, 62, 66, 70],
  fallDeck: [3, 3, 7, 11, 11, 15, 19, 19, 23, 23, 27, 27, 31, 31, 35, 35, 39, 39, 43, 43, 47, 47, 51, 51, 55, 55, 59, 63, 67, 71],
  winterDeck: [4, 4, 8, 8, 12, 16, 20, 20, 24, 24, 28, 28, 32, 32, 36, 36, 40, 40, 44, 44, 48, 48, 52, 52, 56, 56, 60, 64, 68, 72],

  duplicate: function (array, tempDeck) {
    const newDeck = [];
    console.log("tempDeck", tempDeck);
    for (let i = 0; i < tempDeck.length; i++) {
      for (let j = 0; j < array.length; j++) {
        if (array[j].cardId === tempDeck[i]) {
          newDeck.push(array[j])
        }
      }
    }
    this.dupDeck = [...newDeck];
  },

  copyArray: function (array) {
    const copy = array.map(el => {
      return { ...el };
    });

    return copy;
  },

  // chooses the correct array to duplicate
  deckChoice: function (array) {
    let deckC
    switch (array[0].cardId) {
      case 1:
        deckC = this.springDeck;
        this.duplicate(array, deckC);
        break;
      case 2:
        deckC = this.summerDeck;
        this.duplicate(array, deckC);
        break;
      case 3:
        deckC = this.fallDeck;
        this.duplicate(array, deckC);
        break;
      case 4:
        deckC = this.winterDeck;
        this.duplicate(array, deckC);
        break;
      default:
        console.log('You do not have a deck')
    }
    return this.dupDeck;

  },

  shuffleArray: function (array) {
    var max = (array.length / 4)
    var min = 0
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
      max += (array.length / 4)
      min += (array.length / 4)

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
    return (
      this.enemyAtkRows.includes(position) ||
      this.enemyDefRows.includes(position)
    );
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
          cardDied = { ...deck[i] };
        }

        break;
      }
    }

    return [deck, cardDied];
  },

  isOpponentCardInPlay: function (cardId, opponentData) {
    const keys = Object.keys(opponentData);
    for (let i = 0; i < keys.length; i++) {
      if (opponentData[keys[i]] && opponentData[keys[i]].uId === cardId) {
        return keys[i];
      }
    }

    return null;
  }
};


