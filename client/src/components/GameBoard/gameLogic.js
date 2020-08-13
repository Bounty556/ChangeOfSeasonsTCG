export default {
  shuffleArray: function(array) {
    const copy = array.map(card => { return{ ...card } });

    for (let i = 0; i < 50; i++) {
      // Swap these elements in the array
      const randomIndex1 = Math.floor(Math.random() * copy.length);
      const randomIndex2 = Math.floor(Math.random() * copy.length);

      if (randomIndex1 !== randomIndex2) {
        const tempElement = copy[randomIndex1];
        copy[randomIndex1] = copy[randomIndex2];
        copy[randomIndex2] = tempElement;
      }
    }

    return copy;
  },

  // Assigns the first 5 cards in the deck to be in the player's hand
  assignHand: function(deck) {
    const copy = deck;

    for (let i = 0; i < 5; i++) {
      copy[i].position = 'userPlayArea';
      console.log(copy[i].position);
      console.log(copy[i]);
    }

    console.log(copy);

    return copy;
  }
};