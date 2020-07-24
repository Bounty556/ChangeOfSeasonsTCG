import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Homepage from './pages/Homepage/index';
import SignUp from './pages/Sign Up/index';

function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path='/' component={Homepage}/>
                    <Route exact path='/Signup' component={SignUp}/>
                </Switch>
            </div>
        </Router>
    )
}

export default App;