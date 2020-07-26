const mongoose = require('mongoose');
const db = require('../models');

// This file empties the Books collection and inserts the books below

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/changeOfSeasons'
);

const creatureSeed = [
  {
    season: 'Spring',
    cardID: '001',
    cardType: 'Creature',
    resource: '2',
    attack: '2',
    health: '3',
    effect: '',
    name: 'Gudrun',
    img: 'buddy.png'
  },
  {
    season: 'Summer',
    cardID: '002',
    cardType: 'Creature',
    resource: '2',
    attack: '3',
    health: '2',
    effect: '',
    name: 'Jacinto the masked one',
    img: 'mask_01.png'
  },
  {
    season: 'Fall',
    cardID: '003',
    cardType: 'Creature',
    resource: '2',
    attack: '4',
    health: '1',
    effect: '',
    name: 'Revna',
    img: 'crow_01.png'
  },
  {
    season: 'Winter',
    cardID: '004',
    cardType: 'Creature',
    resource: '2',
    attack: '1',
    health: '4',
    effect: '',
    name: 'Obasi of the Deep',
    img: 'hound.png'
  }
];

db.Creature.remove({})
  .then(() => db.Creature.collection.insertMany(creatureSeed))
  .then(data => {
    console.log(data.result.n + ' records inserted!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });