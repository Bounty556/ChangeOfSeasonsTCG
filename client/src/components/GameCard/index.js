import React from 'react';

import Card from '../Card/index';
import './GameCard.css';

function GameCard(props) {
    return (
        <Card id='gameCard'>
            <h5 className='card-name'>{props.name}</h5>

            <div className = 'image-container'>
                <img src={props.imgSrc} alt='placeholder' className='card-image' />
            </div>
            
            <div className = 'effect-box'>
                <p className = 'effect'></p>
            </div>
                <div className = 'stats-box row'>  
                <p className = 'attack'>{props.attack}</p>
                <p className = 'resource'>{props.resource}</p>
                <p className = 'health'>{props.health}</p>
            </div>
        </Card>
    )
}

export default GameCard;