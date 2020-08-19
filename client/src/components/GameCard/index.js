import React from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';

import Card from '../Card/index';
import ItemTypes from '../../utils/ItemTypes';

import './GameCard.css';

function GameCard(props) {
  const [, drag, preview] = useDrag({
    item: { type: ItemTypes.CARD, uId: props.uId }
  });
  
  function effectFunc(text) {
    switch (text) {
      // Effects for Spring
      case 'Gain +1 resource':
        return <p className='effect gainOne'>{props.effect}</p>

      case 'Gain 2 resources':
        return <p className='effect gainTwo'>{props.effect}</p>

      case 'When played, gain +1 resource':
        return <p className='effect whenPlayed'>{props.effect}</p>

      case 'When played, give your attack row +3 ATK':
        return <p className='effect whenPlayedGive'>{props.effect}</p>
      
      case 'When this attacks, draw a card':
        return <p className='effect whenThis'>{props.effect}</p>

      case 'Draw a card':
        return <p className='effect drawCard'>{props.effect}</p>
      
        case 'Draw cards until your hand is full':
        return <p className='effect drawCardUntil'>{props.effect}</p>

      case 'Draw 3 cards':
        return <p className='effect drawThree'>{props.effect}</p>
      
      case 'While this is in play give all your creatures +2 ATK +4 health':
        return <p className='effect whileThis'>{props.effect}</p>

      // Effects for Summer
      case 'Deal 5 damage to a minion or player':
        return <p className='effect dealFive'>{props.effect}</p>
      
      case 'Deal 6 damage to a minion or player':
        return <p className='effect dealSix'>{props.effect}</p>
      
      case 'Deal 10 damage to a minion or player':
        return <p className='effect dealTen'>{props.effect}</p>
      
      case 'Give attack row +1 ATK':
        return <p className='effect giveAtt'>{props.effect}</p>
      
      case 'Give +15 health to all your creatures':
        return <p className='effect giveFifteen'>{props.effect}</p>
      
      case 'When played, deal 3 damage to a minion or player':
        return <p className='effect whenPlayedDeal'>{props.effect}</p>
      
      case 'When played, give your attack row +1 ATK +1 DEF':
        return <p className='effect whenPlayedGiveYour'>{props.effect}</p>
      
      case 'While this is in play give all your creatures +3 ATK +3 health':
        return <p className='effect whileThisIs'>{props.effect}</p>

      case 'Draw 2 cards':
        return <p className='effect drawTwo'>{props.effect}</p>

      // Effects for Fall
      case 'Draw a card when this dies':
        return <p className='effect drawCardWhen'>{props.effect}</p>

      case 'Destroy 1 of your own minions - give the rest +1 ATK':
        return <p className='effect destroy'>{props.effect}</p>
      
      case 'Give all your creatures +2 ATK':
        return <p className='effect giveAll'>{props.effect}</p>
        
      case 'Give all your minions +2 ATK +1 health':
        return <p className='effect giveAllYour'>{props.effect}</p>

      case 'When played, give your attack row +2 ATK':
        return <p className='effect whenPlayedAtt'>{props.effect}</p>
      
      case 'Restore life equal to the damage this deals':
        return <p className='effect restore'>{props.effect}</p>
      
      case "Choose a card to have a 'Return to hand on death' effect":
        return <p className='effect choose'>{props.effect}</p>

      case "When this dies destroy your opponent's defense row":
        return <p className='effect whenThisDies'>{props.effect}</p>

      // Effect for Winter
      case 'When played, +5 health to any player or creature':
        return <p className='effect whenPlayedFive'>{props.effect}</p>
      
      case 'When played, give your defense row +3 health':
        return <p className='effect whenPlayedDef'>{props.effect}</p>
      
      case 'When this dies return it to your hand':
        return <p className='effect whenThisDiesReturn'>{props.effect}</p>
        
      case 'Give all your minions +1 ATK +2 health':
        return <p className='effect giveAllAtt'>{props.effect}</p>
      
      case 'Give all your minions +4 ATK':
        return <p className='effect giveAllMin'>{props.effect}</p>

      case 'Reduce your opponents attack row attack to 0':
        return <p className='effect reduce'>{props.effect}</p>
      
      
      default:
        return <p className='effect'>{props.effect}</p>
    }
  }

  return (
    <>
      <DragPreviewImage
        connect={preview}
        src={'/images/cardImg/' + props.img}
      />
      <div ref={drag}>
        <Card id='gameCard'>
          <div className='image-container'>
            <img
              src='./images/cardBack/lava_style/card_title/mana_point_lava.png'
              alt='placeholder'
              className='mana'
            />
            <p className='resource'>{props.resourceCost}</p>
            <img
              src={'/images/cardImg/' + props.img}
              alt='placeholder'
              className='card-image'
            />
          </div>
          <img
            src='./images/cardBack/lava_style/card_title/frame_title_lava.png'
            alt='placeholder'
            className='card-frame'
          />

          <div className='name-container'>
            <h5 className='card-name'>{props.name.trim()}</h5>
          </div>

          <div className='effect-box'>
            {effectFunc(props.effect)}
          </div>

          {props.isCreature ? (
            <div className='stats-box row'>
              <p className='attack'>{props.attack}</p>
              <p className='health'>{props.health}</p>
            </div>
          ) : (
            <></>
          )}
        </Card>
      </div>
    </>
  );
}

export default GameCard;
