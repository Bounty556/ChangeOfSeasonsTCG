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