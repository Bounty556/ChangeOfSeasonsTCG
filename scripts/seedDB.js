const mongoose = require('mongoose');
const db = require('../models');

// This file empties the Books collection and inserts the books below

// TODO: Add other imgs to cards with 'TBD'

/*
OPERATORS:
   ONDEATH
   ONPLAY
   ONATK

ACTIONS:
   DRAW # - If FULL, give cards until hand is full
   RES TARGET # - SELF, OPP
   DMG #
   HEAL TARGET # - SINGLE, ALL, DEFROW
   KILL TARGET - SELF, OPP, ALL, OPPDEFROW
   RTNHND - Moves the card back to the players hand
   RAISEATK TARGET # - ALL, ATKROW, DEFROW
   RAISEDEF TARGET # - ALL, ATKROW, DEFROW
   SETATK TARGET # - OPPATKROW
   ADDEFFECT "..."
*/

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
    effect: 'When played, gain 1 resource spot',
    effectScript: 'ONPLAY RES SELF 1',
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
    effect: 'Draw a card when this dies',
    effectScript: 'ONDEATH DRAW 1',
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
    effect: 'When played, deal 3 damage to an enemy minion or player',
    effectScript: 'ONPLAY DMG 3',
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
    effect: 'When played, restore 5 health to any player or creature',
    effectScript: 'ONPLAY HEAL SINGLE 5',
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
    effect: 'Gain an extra resource',
    effectScript: 'ONPLAY RES SELF 1',
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
    effectScript: 'ONPLAY DMG 5',
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
    effectScript: 'ONPLAY RES OPP -1',
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
    effect: 'Draw a card',
    effectScript: 'ONPLAY DRAW 1',
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
    effect: 'Gain 2 resource',
    effectScript: 'ONPLAY RES SELF 2',
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
    effect: 'Give attack row +1ATK',
    effectScript: 'ONPLAY RAISEATK ATKROW 1',
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
    effect: 'Destroy 1 of your own minions - give the rest +1ATK',
    effectScript: 'ONPLAY KILL SELF RAISEATK ALL 1',
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
    effect: 'Give defense row +2DEF',
    effectScript: 'ONPLAY RAISEDEF DEFROW 2',
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
    effect: 'Gain an extra resource',
    effecScript: 'ONPLAY RES SELF 1',
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
    effectScript: 'ONPLAY DMG 5',
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
    effectScript: 'ONPLAY RES OPP -1',
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
    effectScript: 'ONPLAY DRAW 1',
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
    effect: 'Gain an extra resource',
    effectScript: 'ONPLAY RES SELF 1',
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
    effect: 'Restore 15 life to all your creatures',
    effectScript: 'ONPLAY HEAL ALL 15',
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
    effect: 'Give all your creatures +2ATK',
    effectScript: 'ONPLAY RAISEATK ALL 2',
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
    effect: 'Destroy all creatures',
    effectScript: 'ONPLAY KILL ALL',
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
    effect: 'Draw a card',
    effectScript: 'ONPLAY DRAW 1',
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
    effect: 'When this enters give your atk row +1ATK +1DEF',
    effectScript: 'ONPLAY RAISEATK ATKROW 1 RAISEDEF ATKROW 1',
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
    effect: 'When this enters give your atk row +2 ATK',
    effectScript: 'ONPLAY RAISEATK ATKROW 2',
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
    effect: 'When this enters heal your def row by 3 health',
    effectScript: 'ONPLAY HEAL DEFROW 3',
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
    effectScript: 'ONPLAY RAISEATK ATKROW 3',
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
    effectScript: 'ONPLAY DMG 6',
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
    effect: 'Restore life equal to the damage this deals',
    effectScript: 'ONATK HEAL DMG',
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
    effect: 'When this dies return it to your hand',
    effectScript: 'ONDEATH RTNHND',
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
    effectScript: 'ONATK DRAW 1',
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
    effect: 'Draw 2 cards',
    effectScript: 'ONPLAY DRAW 2',
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
    effect: 'Give all your minions +2ATK +1DEF',
    effectScript: 'ONPLAY RAISEATK ALL 2 RAISEDEF ALL 1',
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
    effect: 'Give all your minions +1 +2',
    effectScript: 'ONPLAY RAISEATK ALL 1 RAISEDEF ALL 2',
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
    effectScript: 'ONPLAY DRAW FULL',
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
    effect: 'Deal 10 damage to an enemy minion or player',
    effectScript: 'ONPLAY DMG 10',
    name: 'Fires of the Divine',
    img: 'TBD'
  },
  {
    season: 'Fall',
    cardID: 79,
    isCreature: false,
    resourceCost: 9,
    attack: 0,
    health: 0,
    effect: 'You may play a card from your graveyard for free',
    effectScript: 'ONPLAY ADDEFFECT "ONDEATH RTNHND"',
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
    effect: 'Give all your minions +4ATK',
    effectScript: 'ONPLAY RAISEATK ALL 4',
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
    effect: 'While this is in play give all your creatures +2ATK +4DEF',
    effectScript: 'ONPLAY RAISEATK ALL 2 RAISEDEF ALL 4 ONDEATH RAISEATK ALL -2 RAISEDEF ALL -4',
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
    effect: 'While this is in play give all your creatures +3 +3',
    effectScript: 'ONPLAY RAISEATK ALL 3 RAISEDEF ALL 3 ONDEATH RAISEATK ALL -3 RAISEDEF ALL -3',
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
    effect: 'When this dies destroy your opponents defense row',
    effectScript: 'ONDEATH KILL OPPDEFROW',
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
    effect: 'Reduce your opponents attack row attack to 0',
    effectScript: 'ONPLAY SETATK OPPATKROW 0',
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