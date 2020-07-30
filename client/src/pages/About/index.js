import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import Navbar from '../../components/Navbar/index';

// TODO: Remove this because this is just for testing SocketIO
import socketIOClient from 'socket.io-client';

import './about.css';

const socket = socketIOClient('http://localhost:3001/', {
  transports: ['websocket'],
  autoConnect: false
});

function About() {
    const [connectionStatus, setConnectionStatus] = useState(false);
    const [time, setTime] = useState([]);
    const [channel, setChannel] = useState();

    useEffect(() => {
      socket.on(channel, (data) => {
        setTime((prev) => [...data, prev]);
      });
    }, [channel]);

    const handleToggle = () => {
      if (socket.connected) {
        console.log('disconnected');
        socket.close();
      } else {
        console.log('connecting');
        handleSocket();
      }
      setConnectionStatus((prev) => !prev);
      setTime([]);
    };

    const handleSocket = () => {
      socket.open();
      socket.on('connect', () => {
        console.log('connected');
        setChannel(socket.connected ? socket.id : '');
      });
    };

    return (
      <div>
        { connectionStatus ? 'Connected to ' + channel : 'Disconnected' }
        <br />
        <button onClick={handleToggle}>
          { ' ' }
          { connectionStatus ? 'Disconnect' : 'Connect' }
        </button>
      </div>
    );

    // TODO: Restore this once done with socket io testing
    /*
    return (
        <div>
            <Container>
                <div className="card gameCard">
                    <p>
                    
                    </p>
                </div>
            </Container>
        </div>
    )
    */
}

export default About;