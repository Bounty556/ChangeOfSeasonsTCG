import React from 'react';

import Card from '../Card/index';

import './gameboard.css';

function Gameboard(props) {
    return (
        <div>
          <div className='wrapper'>
            <div id='opponentRow'>
              {/* Opponent's Graveyard*/}
              <Card id='opponentGrave'>
                <h6>Opponent Graveyard</h6>
              </Card>

              {/* Opponent's Deck */}
              <Card id='opponentDeck'>
                <h6>Opponent Deck</h6>
              </Card>

              {/* Opponent's Play area */}
              <Card id='opponentPlayArea'>
                <h4>Opponent Play Area</h4>
              </Card>
            </div>

            {/* Defense Row */}
            <div id='opponentDefRow'>
              <Card id='opponentDef1'>
                <h6>Opponent Defense 1</h6>
              </Card>
              <Card id='opponentDef2'>
                <h6>Opponent Defense 2</h6>
              </Card>
            </div>

            {/* Attack Row */}
            <div id='opponentAttRow'>
              <Card id='opponentAtt1'>
                <h6>Opponent Attack 1</h6>
              </Card>
              <Card id='opponentAtt2'>
                <h6>Opponent Attack 2</h6>
              </Card>
              <Card id='opponentAtt3'>
                <h6>Opponent Attack 3</h6>
              </Card>
            </div>
          </div>

          <hr />

          <div className='wrapper'>
            <div id='userAttRow'>
              <Card id='userAtt1'>
                <h6>User Attack 1</h6>
              </Card>
              <Card id='userAtt2'>
                <h6>User Attack 2</h6>
              </Card>
              <Card id='userAtt3'>
                <h6>User Attack 3</h6>
              </Card>
            </div>

            <div id='userDefRow'>
              <Card id='userDef1'>
                <h6>User Defense 1</h6>
              </Card>
              <Card id='userDef2'>
                <h6>User Defense 2</h6>
              </Card>
            </div>

            <div id='userRow'>
              {/* User's Graveyard*/}
              <Card id='userGrave'>
                <h6>User Graveyard</h6>
              </Card>

              {/* User's Deck */}
              <Card id='userDeck'>
                <h6>User Deck</h6>
              </Card>

              {/* User's Play area */}
              <Card id='userPlayArea'>
                <h4>User Play Area</h4>
              </Card>
            </div>
          </div>
        </div>
    )
}

export default Gameboard;