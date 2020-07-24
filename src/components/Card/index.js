import React from 'react';

function Card(props) {
    return (
        <div className='card' id={props.id}>
            <div className='card-body'>
                {props.children}
            </div>
        </div>
    )
}

export default Card;