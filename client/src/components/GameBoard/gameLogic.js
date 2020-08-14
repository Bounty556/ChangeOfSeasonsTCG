export default {
  enemyAtkRows: ['opponentAtt1', 'opponentAtt2', 'opponentAtt3'],
  enemyDefRows: ['opponentDef1', 'opponentDef2'],

  copyArray: function(array) {
    const copy = array.map(el => {
      return { ...el };
    });

    return copy;
  },

  shuffleArray: function (array) {
    for (let i = 0; i < 50; i++) {
      // Swap these elements in the array
      const randomIndex1 = Math.floor(Math.random() * array.length);
      const randomIndex2 = Math.floor(Math.random() * array.length);

      if (randomIndex1 !== randomIndex2) {
        const tempElement = array[randomIndex1];
        array[randomIndex1] = array[randomIndex2];
        array[randomIndex2] = tempElement;
      }
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

  isPositionFilled: function(position, deck) {
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

  damageCard: function(position, damage, deck) {
    let cardDied = null;
    for (let i = 0; i < deck.length; i++) {
      if (deck[i].position === position) {
        deck[i].health -= damage;

        if (deck[i].health <= 0) {
          deck[i].position = 'userGrave';
          cardDied = {...deck[i]};
        }

        break;
      }
    }

    return [deck, cardDied];
  },

  isOpponentCardInPlay: function(cardId, opponentData) {
    const keys = Object.keys(opponentData);
    for (let i = 0; i < keys.length; i++) {
      if (opponentData[keys[i]] && opponentData[keys[i]].uId === cardId) {
        return keys[i];
      }
    }

    return null;
  }
};
