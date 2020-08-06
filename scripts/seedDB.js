const mongoose = require('mongoose');
const db = require('../models');

// This file empties the Books collection and inserts the books below

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/changeOfSeasons'
);

const cardSeed = [
  {
    season: 'Spring',
    cardID: 1,
    isCreature: true,
    resourceCost: 2,
    attack: 2,
    health: 3,
    effect: '',
    name: 'Gudrun',
    img: 'buddy.png'
  },
  {
    season: 'Summer',
    cardID: 2,
    isCreature: true,
    resourceCost: 2,
    attack: 3,
    health: 2,
    effect: '',
    name: 'Jacinto the masked one',
    img: 'mask_01.png'
  },
  {
    season: 'Fall',
    cardID: 3,
    isCreature: true,
    resourceCost: 2,
    attack: 4,
    health: 1,
    effect: '',
    name: 'Revna',
    img: 'crow_01.png'
  },
  {
    season: 'Winter',
    cardID: 4,
    isCreature: true,
    resourceCost: 2,
    attack: 1,
    health: 4,
    effect: '',
    name: 'Obasi of the Deep',
    img: 'hound.png'
  },
  {
    season: 'Spring',
    cardID: 5,
    isCreature: true,
    resourceCost: 3,
    attack: 1,
    health: 1,
    effect: 'Gain 1 resource spot ',
    name: 'Hinode',
    img: 'turtle_01.png'
  },
  {
    season: 'Summer',
    cardID: 6,
    isCreature: true,
    resourceCost: 3,
    attack: 3,
    health: 3,
    effect: '',
    name: 'Yōsei',
    img: 'snake_01.png'
  },
  {
    season: 'Fall',
    cardID: 7,
    isCreature: true,
    resourceCost: 3,
    attack: 1,
    health: 1,
    effect: 'draw a card when this dies',
    name: 'Dodokeki',
    img: 'bone_beast.png'
  },
  {
    season: 'Winter',
    cardID: 8,
    isCreature: true,
    resourceCost: 3,
    attack: 2,
    health: 4,
    effect: '',
    name: 'Akashita',
    img: 'banshee.png'
  },
  {
    season: 'Spring',
    cardID: 9,
    isCreature: true,
    resourceCost: 3,
    attack: 3,
    health: 3,
    effect: '',
    name: 'Maia',
    img: 'plant_monster_01.png'
  },
  {
    season: 'Summer',
    cardID: 10,
    isCreature: true,
    resourceCost: 3,
    attack: 1,
    health: 3,
    effect: 'Deal 3 damage to an enemy minion or player',
    name: 'Fanus',
    img: 'phoenix_01.png'
  },
  {
    season: 'Fall',
    cardID: 11,
    isCreature: true,
    resourceCost: 3,
    attack: 3,
    health: 3,
    effect: '',
    name: 'Consus',
    img: 'dragon_03.png'
  },
  {
    season: 'Winter',
    cardID: 12,
    isCreature: true,
    resourceCost: 3,
    attack: 1,
    health: 3,
    effect: 'Restore 5 health to any player or creature',
    name: 'Hathor',
    img: 'yeti_01.png'
  },
  {
    season: 'Spring',
    cardID: 13,
    isCreature: true,
    resourceCost: 4,
    attack: 4,
    health: 3,
    effect: '',
    name: 'Zevran',
    img: 'golem_02.png'
  },
  {
    season: 'Summer',
    cardID: 14,
    isCreature: true,
    resourceCost: 4,
    attack: 3,
    health: 4,
    effect: '',
    name: 'Arven',
    img: 'bug.png'
  },
  {
    season: 'Fall',
    cardID: 15,
    isCreature: true,
    resourceCost: 4,
    attack: 3,
    health: 4,
    effect: '',
    name: 'Jarian',
    img: 'emerald (7).png'
  },
  {
    season: 'Winter',
    cardID: 16,
    isCreature: true,
    resourceCost: 4,
    attack: 0,
    health: 7,
    effect: '',
    name: 'Wall of Swords',
    img: 'red (34).png'
  },
  {
    season: 'Spring',
    cardID: 17,
    isCreature: true,
    resourceCost: 4,
    attack: 3,
    health: 4,
    effect: '',
    name: 'Zothogth',
    img: 'insect_02.png'
  },
  {
    season: 'Summer',
    cardID: 18,
    isCreature: true,
    resourceCost: 4,
    attack: 5,
    health: 2,
    effect: '',
    name: 'Cursed Dromaeo',
    img: 'deamon_05.png'
  },
  {
    season: 'Fall',
    cardID: 19,
    isCreature: true,
    resourceCost: 4,
    attack: 6,
    health: 1,
    effect: '',
    name: 'Thuolond the unsuspecting Jin',
    img: 'jin.png'
  },
  {
    season: 'Winter',
    cardID: 20,
    isCreature: true,
    resourceCost: 4,
    attack: 2,
    health: 5,
    effect: '',
    name: 'Shuasheme',
    img: 'frost_giant_01.png'
  },
  {
    season: 'Spring',
    cardID: 21,
    isCreature: true,
    resourceCost: 5,
    attack: 4,
    health: 5,
    effect: '',
    name: 'Yiennare',
    img: 'living_armor_02.png'
  },
  {
    season: 'Summer',
    cardID: 22,
    isCreature: true,
    resourceCost: 5,
    attack: 5,
    health: 4,
    effect: '',
    name: 'Vegnessss',
    img: 'lizardman_01.png'
  },
  {
    season: 'Fall',
    cardID: 23,
    isCreature: true,
    resourceCost: 5,
    attack: 6,
    health: 3,
    effect: '',
    name: 'Nithrilar',
    img: 'orc_03.png'
  },
  {
    season: 'Winter',
    cardID: 24,
    isCreature: true,
    resourceCost: 5,
    attack: 4,
    health: 5,
    effect: '',
    name: 'Lykoo',
    img: 'crystal_golem_01.png'
  },
  {
    season: 'Spring',
    cardID: 25,
    isCreature: true,
    resourceCost: 5,
    attack: 3,
    health: 3,
    effect: 'Gain an extra resourse ',
    name: 'Rynia',
    img: 'dragon_01.png'
  },
  {
    season: 'Summer',
    cardID: 26,
    isCreature: true,
    resourceCost: 5,
    attack: 3,
    health: 3,
    effect: 'Deal 5 damage to an enemy minion or player',
    name: 'Vyniho',
    img: 'dragon_04.png'
  },
  {
    season: 'Fall',
    cardID: 27,
    isCreature: true,
    resourceCost: 5,
    attack: 3,
    health: 3,
    effect: 'Destroy 1 enemy resource',
    name: 'Tirdyha',
    img:'dragon_03.png'
  },
  {
    season: 'Winter',
    cardID: 28,
    isCreature: true,
    resourceCost: 5,
    attack: 3,
    health: 3,
    effect: 'Draw a card ',
    name: 'Nymymnas',
    img: 'dragon_05.png'
  },
  {
    season: 'Spring',
    cardID: 29,
    isCreature: false,
    resourceCost: 5,
    attack: 0,
    health: 0,
    effect: 'Gain 2 resource spots ',
    name: 'Concentration of Nature',
    img: 'emerald (9).png'
  },
  {
    season: 'Summer',
    cardID: 30,
    isCreature: false,
    resourceCost: 4,
    attack: 0,
    health: 0,
    effect: 'give attack row 1 extra attack ',
    name: 'Assault of Nature',
    img: 'green (11).png'
  },
  {
    season: 'Fall',
    cardID: 31,
    isCreature: false,
    resourceCost: 3,
    attack: 0,
    health: 0,
    effect: 'Destroy 1 of your own minions - give the rest 1 attack',
    name: 'Mystic Typhoon',
    img: 'blue (25)'
  },
  {
    season: 'Winter',
    cardID: 32,
    isCreature: false,
    resourceCost: 4,
    attack: 0,
    health: 0,
    effect: 'Give defense row 2 extra health ',
    name: 'Phantom Form',
    img: 'violet (11).png'
  },
  {
    season: 'Spring',
    cardID: 33,
    isCreature: true,
    resourceCost: 4,
    attack: 4,
    health: 3,
    effect: '',
    name: 'Zevran',
    img: 'golem_02.png'
  },
  {
    season: 'Summer',
    cardID: 34,
    isCreature: true,
    resourceCost: 4,
    attack: 3,
    health: 4,
    effect: '',
    name: 'Arven',
    img: 'bug.png'
  },
  {
    season: 'Fall',
    cardID: 35,
    isCreature: true,
    resourceCost: 4,
    attack: 3,
    health: 4,
    effect: '',
    name: 'Jarian',
    img: 'emerald (7).png'
  },
  {
    season: 'Winter',
    cardID: 36,
    isCreature: true,
    resourceCost: 4,
    attack: 0,
    health: 7,
    effect: '',
    name: 'Wall of Swords',
    img: 'red (34).png'
  },
  {
    season: 'Spring',
    cardID: 37,
    isCreature: true,
    resourceCost: 4,
    attack: 3,
    health: 4,
    effect: '',
    name: 'Zothogth',
    img: 'insect_02.png'
  },
  {
    season: 'Summer',
    cardID: 38,
    isCreature: true,
    resourceCost: 4,
    attack: 5,
    health: 2,
    effect: '',
    name: 'Cursed Dromaeo',
    img: 'deamon_05.png'
  },
  {
    season: 'Fall',
    cardID: 39,
    isCreature: true,
    resourceCost: 4,
    attack: 6,
    health: 1,
    effect: '',
    name: 'Thuolond the unsuspecting Jin',
    img: 'jin.png'
  },
  {
    season: 'Winter',
    cardID: 40,
    isCreature: true,
    resourceCost: 4,
    attack: 2,
    health: 5,
    effect: '',
    name: 'Shuasheme',
    img: 'frost_giant_01.png'
  },
  {
    season: 'Spring',
    cardID: 41,
    isCreature: true,
    resourceCost: 5,
    attack: 4,
    health: 5,
    effect: '',
    name: 'Yiennare',
    img: 'living_armor_02.png'
  },
  {
    season: 'Summer',
    cardID: 42,
    isCreature: true,
    resourceCost: 5,
    attack: 5,
    health: 4,
    effect: '',
    name: 'Vegnessss',
    img: 'lizardman_01.png'
  },
  {
    season: 'Fall',
    cardID: 43,
    isCreature: true,
    resourceCost: 5,
    attack: 6,
    health: 3,
    effect: '',
    name: 'Nithrilar',
    img: 'orc_03.png'
  },
  {
    season: 'Winter',
    cardID: 44,
    isCreature: true,
    resourceCost: 5,
    attack: 4,
    health: 5,
    effect: '',
    name: 'Lykoo',
    img: 'crystal_golem_01.png'
  },
  {
    season: 'Spring',
    cardID: 45,
    isCreature: true,
    resourceCost: 5,
    attack: 3,
    health: 3,
    effect: 'Gain an extra resourse ',
    name: 'Rynia',
    img: 'dragon_01.png'
  },
  {
    season: 'Summer',
    cardID: 46,
    isCreature: true,
    resourceCost: 5,
    attack: 3,
    health: 3,
    effect: 'Deal 5 damage to an enemy minion or player',
    name: 'Vyniho',
    img: 'dragon_04.png'
  },
  {
    season: 'Fall',
    cardID: 47,
    isCreature: true,
    resourceCost: 5,
    attack: 3,
    health: 3,
    effect: 'Destroy 1 enemy resource',
    name: 'Tirdyha',
    img: 'dragon_03.png'
  },
  {
    season: 'Winter',
    cardID: 48,
    isCreature: true,
    resourceCost: 5,
    attack: 3,
    health: 3,
    effect: 'Draw a card',
    name: 'Nymymnas',
    img: 'dragon_05.png'
  },
  {
    season: 'Spring',
    cardID: 49,
    isCreature: false,
    resourceCost: 5,
    attack: 0,
    health: 0,
    effect: 'Gain an extra resourse ',
    name: 'Rynia',
    img: 'dragon_01.png'
  },
  {
    season: 'Summer',
    cardID: 50,
    isCreature: false,
    resourceCost: 6,
    attack: 0,
    health: 0,
    effect: 'restore 15 life to all your creatures',
    name: 'Call of Health',
    img: 'TBD'
  },
  {
    season: 'Fall',
    cardID: 51,
    isCreature: false,
    resourceCost: 7,
    attack: 0,
    health: 0,
    effect: 'Give all your creatures +2 attack ',
    name: 'Hidden Dagger',
    img: 'TBD'
  },
  {
    season: 'Winter',
    cardID: 52,
    isCreature: false,
    resourceCost: 7,
    attack: 0,
    health: 0,
    effect: 'Destroy all creatures ',
    name: 'Seal of Death',
    img: 'TBD'
  },
  {
    season: 'Spring',
    cardID: 53,
    isCreature: true,
    resourceCost: 6,
    attack: 5,
    health: 5,
    effect: '',
    name: 'Slughorth',
    img: 'TBD'
  },
  {
    season: 'Summer',
    cardID: 54,
    isCreature: true,
    resourceCost: 6,
    attack: 5,
    health: 5,
    effect: '',
    name: 'Vrunteghe',
    img: 'TBD'
  },
  {
    season: 'Fall',
    cardID: 55,
    isCreature: true,
    resourceCost: 6,
    attack: 6,
    health: 4,
    effect: '',
    name: 'Ito',
    img: 'TBD'
  },
  {
    season: 'Winter',
    cardID: 56,
    isCreature: true,
    resourceCost: 6,
    attack: 4,
    health: 6,
    effect: '',
    name: 'Brethraodduss',
    img: 'TBD'
  },
  {
    season: 'Spring',
    cardID: 57,
    isCreature: true,
    resourceCost: 6,
    attack: 3,
    health: 4,
    effect: 'draw a card',
    name: 'Wiubhun',
    img: 'TBD'
  },
  {
    season: 'Summer',
    cardID: 58,
    isCreature: true,
    resourceCost: 6,
    attack: 3,
    health: 4,
    effect: 'When this enters give your atk row +2 attack',
    name: 'Vrunteghe',
    img: 'TBD'
  },
  {
    season: 'Fall',
    cardID: 59,
    isCreature: true,
    resourceCost: 6,
    attack: 3,
    health: 4,
    effect: 'return 2 random cards from your grave yard to your hand',
    name: 'Ito',
    img: 'TBD'
  },
  {
    season: 'Winter',
    cardID: 60,
    isCreature: true,
    resourceCost: 6,
    attack: 3,
    health: 4,
    effect: 'When this enters give your def row  +3 health',
    name: 'Brethraodduss',
    img: 'TBD'
  },
  {
    season: 'Spring',
    cardID: 61,
    isCreature: true,
    resourceCost: 7,
    attack:5,
    health: 6,
    effect: '',
    name: 'Reldo',
    img: 'TBD'
  },
  {
    season: 'Summer',
    cardID: 62,
    isCreature: true,
    resourceCost: 7,
    attack: 5,
    health: 6,
    effect: '',
    name: 'Sherthok',
    img: 'TBD'
  },
  {
    season: 'Fall',
    cardID: 63,
    isCreature: true,
    resourceCost: 7,
    attack: 5,
    health: 6,
    effect: '',
    name: 'Grarthu',
    img: 'TBD'
  },
  {
    season: 'Winter',
    cardID: 64,
    isCreature: true,
    resourceCost: 7,
    attack: 5,
    health: 6,
    effect: '',
    name: 'Snorbaglel',
    img: 'TBD'
  },
  {
    season: 'Spring',
    cardID: 65,
    isCreature: true,
    resourceCost: 7,
    attack:3,
    health: 5,
    effect: 'When this enters give your atk row +3 attack',
    name: 'Dilbuggraulm',
    img: 'TBD'
  },
  {
    season: 'Summer',
    cardID: 66,
    isCreature: true,
    resourceCost: 7,
    attack: 3,
    health: 5,
    effect: 'Deal 6 damage to an enemy minion or player',
    name: 'Legrash',
    img: 'TBD'
  },
  {
    season: 'Fall',
    cardID: 67,
    isCreature: true,
    resourceCost: 7,
    attack: 3,
    health: 5,
    effect: 'restore life equal to the damge this deals',
    name: 'Fardel',
    img: 'TBD'
  },
  {
    season: 'Winter',
    cardID: 68,
    isCreature: true,
    resourceCost: 7,
    attack: 3,
    health: 2,
    effect: 'when this dies return it to your hand',
    name: 'Volmuloelle',
    img: 'TBD'
  },
  {
    season: 'Spring',
    cardID: 69,
    isCreature: true,
    resourceCost: 8,
    attack: 6,
    health: 6,
    effect: '',
    name: 'Lailzon',
    img: 'TBD'
  },
  {
    season: 'Summer',
    cardID: 70,
    isCreature: true,
    resourceCost: 8,
    attack: 6,
    health: 6,
    effect: '',
    name: 'Nemastos',
    img: 'TBD'
  },
  {
    season: 'Fall',
    cardID: 71,
    isCreature: true,
    resourceCost: 8,
    attack: 6,
    health: 6,
    effect: '',
    name: 'Alcinysius',
    img: 'TBD'
  },
  {
    season: 'Winter',
    cardID: 72,
    isCreature: true,
    resourceCost: 8,
    attack: 6,
    health: 6,
    effect: '',
    name: 'Icariss',
    img: 'TBD'
  },
  {
    season: 'Spring',
    cardID: 73,
    isCreature: true,
    resourceCost: 8,
    attack:4,
    health: 5,
    effect: 'When this deals damage draw a card',
    name: 'Phantisto',
    img: 'TBD'
  },
  {
    season: 'Summer',
    cardID: 74,
    isCreature: true,
    resourceCost: 8,
    attack: 4,
    health: 5,
    effect: 'draw 2 cards',
    name: 'Elenone',
    img: 'TBD'
  },
  {
    season: 'Fall',
    cardID: 75,
    isCreature: true,
    resourceCost: 8,
    attack: 4,
    health: 5,
    effect: 'give all your minions +2 +1',
    name: 'Xanderise',
    img: 'TBD'
  },
  {
    season: 'Winter',
    cardID: 76,
    isCreature: true,
    resourceCost: 8,
    attack: 4,
    health: 5,
    effect: 'give all your minions +1 +2',
    name: 'Artesa',
    img: 'TBD'
  },
  {
    season: 'Spring',
    cardID: 77,
    isCreature: false,
    resourceCost: 9,
    attack:0,
    health: 0,
    effect: 'Draw cards until your hand is full',
    name: 'Deep Pockets',
    img: 'TBD'
  },
  {
    season: 'Summer',
    cardID: 78,
    isCreature: false,
    resourceCost: 9,
    attack: 0,
    health: 0,
    effect: 'Deal 10 damage to the enemy player',
    name: 'Fires of the Divine',
    img: 'TBD'
  },
  {
    season: 'Fall',
    cardID: 79,
    isCreature: false,
    resourceCost: 7,
    attack: 0,
    health: 0,
    effect: 'You may play a card from your graveyard for free',
    name: 'Gravediggers Delight',
    img: 'TBD'
  },
  {
    season: 'Winter',
    cardID: 80,
    isCreature: false,
    resourceCost: 9,
    attack: 0,
    health: 0,
    effect: 'Give all your minions +4 attack',
    name: 'Winter`s End',
    img: 'TBD'
  },
  {
    season: 'Spring',
    cardID: 81,
    isCreature: true,
    resourceCost: 9,
    attack:6,
    health: 7,
    effect: '',
    name: 'Sühkgüi',
    img: 'TBD'
  },
  {
    season: 'Summer',
    cardID: 82,
    isCreature: true,
    resourceCost: 9,
    attack:6,
    health: 7,
    effect: '',
    name: 'Enezorig',
    img: 'TBD'
  },
  {
    season: 'Fall',
    cardID: 83,
    isCreature: true,
    resourceCost: 9,
    attack:6,
    health: 7,
    effect: '',
    name: 'Nertsetseg',
    img: 'TBD'
  },
  {
    season: 'Winter',
    cardID: 84,
    isCreature: true,
    resourceCost: 9,
    attack:6,
    health: 7,
    effect: '',
    name: 'Hontuyaa',
    img: 'TBD'
  },
  {
    season: 'Spring',
    cardID: 85,
    isCreature: true,
    resourceCost: 9,
    attack:5,
    health: 5,
    effect: 'While this is in play give all your creatures +2+4',
    name: 'Hontuyaa',
    img: 'TBD'
  },
  {
    season: 'Summer',
    cardID: 86,
    isCreature: true,
    resourceCost: 9,
    attack:5,
    health: 5,
    effect: 'While this is in play give all your creatures +3 +3 ',
    name: 'Otgonbaatar',
    img: 'TBD'
  },
  {
    season: 'Fall',
    cardID: 87,
    isCreature: true,
    resourceCost: 9,
    attack:5,
    health: 5,
    effect: 'When this dies destory your oponents defense row',
    name: 'Nertulga',
    img: 'TBD'
  },
  {
    season: 'Winter',
    cardID: 88,
    isCreature: true,
    resourceCost: 9,
    attack:5,
    health: 5,
    effect: 'reduce your opponents attack row attack to 0 ',
    name: 'Batgüi',
    img: 'TBD'
  },
];

db.Card.remove({})
  .then(() => db.Card.collection.insertMany(cardSeed))
  .then(data => {
    console.log(data.result.n + ' records inserted!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });