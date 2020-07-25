import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Homepage from './pages/Homepage/index';
import SignUp from './pages/Sign Up/index';
import Signin from './pages/Sign In/index';
import ForgotPassword from './pages/Forgot-Password/index';

function App() {
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path='/' component={Homepage}/>
                    <Route exact path='/Signup' component={SignUp}/>
                    <Route exact path='/Signin' component={Signin} />
                    <Route exact path='/Forgot' component={ForgotPassword}/>
                </Switch>
            </div>
        </Router>
    )
}

export default App;