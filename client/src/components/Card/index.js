import React from 'react';

function Card(props) {
    return (
        <div className='card' id={props.id}>
            <div className='card-body' id={props.bodyId == undefined ? '' : props.bodyId}>
                {props.children}
            </div>
        </div>
    )
}

export default Card;