import React, { useState, useEffect } from 'react';

import Card from '../Card';
import InfoCard from '../InfoCard';

function Graveyard(props) {
  return (
    <div id={props.id}>
      <Card bodyId='playAreaRow'>
        <div id='cardRow'>
          {props.recent ? (
            <InfoCard {...props.recent} />
          ) : (
            <></>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Graveyard;
