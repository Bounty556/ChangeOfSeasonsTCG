export default {
  triggers: ['ONPLAY', 'ONDEATH', 'ONATK'],
  operators: [
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
  targettingOperators: ['HEAL', 'KILL', 'RAISEATK', 'RAISEDEF', 'SETATK'],
  positions: [
    'userAtt1',
    'userAtt2',
    'userAtt3',
    'userDef1',
    'userDef2',
    'opponentAtt1',
    'opponentAtt2',
    'opponentAtt3',
    'opponentDef1',
    'opponentDef2'
  ],

  // Puts all TRIGGERS into individual objects describing their behavior
  // Example token:
  /* 
     {
       trigger: 'ONPLAY',
       operations: [
         {
           op: 'RES',
           param1: 'SELF',
           param2: '3'
         }
       ]
     }
   */
  tokenize: function (string) {
    if (!string || string.length === 0) {
      return [];
    }

    const splitString = string.trim().split(' ');

    // Group all TRIGGERS and their OPERATORS into objects
    const tokens = [];
    let currentToken = -1;
    let currentOperator = -1;
    let currentParameter = 0;
    for (let i = 0; i < splitString.length; i++) {
      let word = splitString[i];

      // Check to see if this is a new token
      if (this.triggers.includes(word)) {
        tokens.push({
          trigger: word,
          operations: []
        });
        currentToken++;
        currentOperator = -1;
        currentParameter = 0;
      } else if (this.operators.includes(word)) {
        // Check to see if this is an operator
        tokens[currentToken].operations.push({
          op: word
        });
        currentOperator++;
        currentParameter = 0;
      } else {
        // This is a parameter
        currentParameter++;
        tokens[currentToken].operations[currentOperator]['param' + currentParameter] = word;
      }
    }

    return tokens;
  },

  getScriptTargets: function (operation) {
    // TODO: We need to be able to target the enemy player/hero

    // The targetting parameter should be the first param, make sure it exists
    if (!operation || !operation.param1) {
      return [];
    }

    const target = operation.param1;

    if (target === 'SELF') {
      return this.positions.slice(0, 5);
    } else if (target === 'OPP') {
      return this.positions.slice(5);
    } else if (target === 'ALL' || target === 'SINGLE' || operation.op === 'DMG') {
      return this.positions.slice(0);
    } else if (target === 'DEFROW') {
      return this.positions.slice(3, 5);
    } else if (target === 'ATKROW') {
      return this.positions.slice(0, 3);
    } else if (target === 'OPPATKROW') {
      return this.positions.slice(5, 8);
    } else if (target === 'OPPDEFROW') {
      return this.positions.slice(8);
    }

    return [];
  },

  canInstaCast: function (operation) {
    const operator = operation.op;
    return (
      operator === 'DRAW' ||
      operator === 'RES' ||
      operator === 'RTNHAND' ||
      operator === 'RAISEATK' ||
      operator === 'RAISEDEF' ||
      operator === 'SETATK' ||
      (operator === 'HEAL' && operation.param1 === 'ALL') ||
      (operator === 'HEAL' && operation.param1 === 'DEFROW') ||
      (operator === 'HEAL' && operation.param1 === 'ATKROW')
    );
  }
};
