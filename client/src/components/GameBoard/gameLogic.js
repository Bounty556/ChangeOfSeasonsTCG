export default {
  shuffleArray: function(array) {
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
  assignHand: function(deck) {
    for (let i = 0; i < 5; i++) {
      deck[i].position = 'userPlayArea';
    }

    return deck;
  }
};