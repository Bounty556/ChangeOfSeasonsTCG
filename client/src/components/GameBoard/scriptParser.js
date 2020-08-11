export default {
  TRIGGERS: ['ONPLAY', 'ONDEATH', 'ONATK'],
  OPERATORS: [
    'DRAW',
    'RES',
    'DMG',
    'HEAL',
    'KILL',
    'RTNHND',
    'RAISEATK',
    'RAISEDEF',
    'SETATK',
    'ADDEFFECT'
  ],

  // Puts all TRIGGERS into individual objects describing their behavior
  // Example token:
  /* 
     {
       trigger: 'ONPLAY',
       operations: [
         op: 'RES',
         param1: 'SELF',
         param2: '3'
       ]
     }
   */
  tokenize: function(string) {
    const splitString = string.trim().split(' ');

    // Group all TRIGGERS and their OPERATORS into objects
    const tokens = [];
    let currentToken = -1;
    let currentOperator = -1;
    let currentParameter = 0;
    for (let i = 0; i < splitString.length; i++) {
      let word = splitString[i];

      // Check to see if this is a new token
      if (this.TRIGGERS.includes(word)) {
        tokens.push({
          trigger: word,
          operations: []
        });
        currentToken++;
        currentOperator = -1;
        currentParameter = 0;
      } else if (this.OPERATORS.includes(word)) { // Check to see if this is an operator
        tokens[currentToken].operations.push({
          op: word
        });
        currentOperator++;
        currentParameter = 0;
      } else { // This is a parameter
        currentParameter++;
        tokens[currentToken].operations[currentOperator]['param' + currentParameter] = word;
      }
    }

    return tokens;
  },

  parseScript: function(script) {
    return this.tokenize(script);
  }
};
