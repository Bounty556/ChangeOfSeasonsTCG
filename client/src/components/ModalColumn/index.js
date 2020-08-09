import React from "react";
import './modal.css';


function ModalColumn(props) {
  return (
  <div>
    <img className='userProfileIcons' src={`./images/cardImg/${props.imageString}.png`}/>
  </div>
  )
}

export default ModalColumn;
