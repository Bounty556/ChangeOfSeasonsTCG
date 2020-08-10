import React from 'react';
import './modal.css';


function ModalColumn(props) {
  return (
    <button onClick={props.changeFunc}>
      <img className='userProfileIcons' data={props.imgData} src={`./images/cardImg/${props.imageString}.png`} alt='Avatar Icon'/>
    </button>
  )
}

export default ModalColumn;
