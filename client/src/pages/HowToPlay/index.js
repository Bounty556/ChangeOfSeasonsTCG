import React from 'react';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';
import './howtoplay.css'

function HowToPlay() {
    return (
        <div>
            <Navbar />
            <h1 className=' cosHome animate__animated animate__slideInDown'>Change of Seasons</h1>
            <Container>
                <div>
                    <p className='inline highlightR'>
                    Getting started 
                    </p>
                    <br></br>
                        <p className='inline'>Create an account with us by </p><p className='inline highlightB'>signing up</p><p className='inline'> , or if you already have an account then make sure to<p  className='inline highlightB'> SIGN IN </p>. Once signed in, you should be directed to the Profile page.  
                        </p>
                        <br></br>
                        <br></br>
                        <p className='inline highlightR'> 
                        Create a match
                        </p>
                        <p> 
                        Once you have signed in, select a profile avatar and a deck you wish to play with. Push the Create Match option to create a match, you will be given a number in the middle of the screen. Relay that number to your friend so they can find your lobby. 
                        <br></br>
                        <br></br>
                        <p className='inline highlightR'> 
                        Join match
                        </p>
                        <p className='inline'>
                        Joining a match is just as simple as creating one. Wait for your friend to create the match. Enter in the lobby number relayed to you, and click <p className='inline highlightB'> JOIN MATCH </p>. 
                        Once both opponents appear in the lobby, the User who created the game may press the</p><p className='inline highlightB'> START GAME </p><p>button. 
                        </p>
                        <br></br>
                        <p className='highlightR'>
                        Playing the game
                        </p>
                        <p className='inline'>
                        Each player starts with 5 cards in their hand, which is the maximum number of cards you can have in your hand at one time. You can play multiple cards at a time, as long as you have enough recourse points (located at the bottom of the screen.  
                        </p>
                        <br></br>
                        <br></br>
                        Each character card has a resource cost, attack power, and defense power: 
                        </p>
                        <img src='./images/cardImg/cardDescription.png' alt='Picture of Card Description'></img>
                        <br></br>
                        <p>
                        There are 3 playable slots in the ATTACK  ROW, and 2 playable slots in the defense row. The Attack Row may attack the opponent’s Attack Row or their Defensive Row. However, the Defensive Row may not attack.  
                        When ready to play a card simply drag and drop the card of your choice into the respective slot that you want (if for some reason the card does not drop into the specified slot, it is not your turn or you cannot play that card in that position). 
                        <br></br>
                        Damage to the cards will be dealt automatically. Any card that reaches 0 health, will be removed from the play area, and set to the players graveyard.   
                        <br></br>
                        At the beginning of your turn you gain 1 Resource. You are allowed to play as many cards you can per turn, but not required to.  
                        When you are done with your turn, press the End Turn button at the top of the screen.  When your turn ends, you will gain 1 Resource.  
                        <br></br>
                        </p>
                </div>
            </Container>
        </div >
    )
}

export default HowToPlay;