import React from 'react';
import './card.css'

function Card(props) {
    return (
        <div className='card' id={props.id}>
            <div className='card-body' id={props.bodyId || ''}>
                {props.children}
            </div>
        </div>
    )
}

export default Card;