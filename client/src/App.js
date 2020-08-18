import React, {useEffect, useState} from 'react';
import ProtectedRoute from './components/ProtectedRoute'
import { getAuthLocally } from './utils/authentication'
import { useAuthContext } from './utils/GlobalState'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Homepage from './pages/Homepage/index';
import About from './pages/About/index';
import SignUp from './pages/Sign Up/index';
import Signin from './pages/Sign In/index';
import ForgotPassword from './pages/Forgot-Password/index';
import UserProfile from './pages/UserProfile/index';
import Lobby from './pages/Lobby/index'
import HowToPlay from './pages/HowToPlay/index'
// TODO: Check out blank page when duplicating tabs

function App() {
    const [authLoading, setAuthLoading] = useState(true);
    const [, setAuth] = useAuthContext();

    useEffect(() => {
        let auth = getAuthLocally();

        if (auth){
            setAuth(auth);
        }

        setAuthLoading(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (authLoading) {
        return null;
    }
    
    return (

        <Router>
            <div>
                <Switch>
                    <Route exact path='/' component={Homepage}/>
                    <Route exact path='/HowToPlay' component={HowToPlay}/>
                    <Route exact path='/About' component={About}/>
                    <Route exact path='/Signup' component={SignUp}/>
                    <Route exact path='/Signin' component={Signin} />
                    <Route exact path='/Forgot' component={ForgotPassword}/>
                    <ProtectedRoute exact path = '/Profile' component = {UserProfile}/>
                    <ProtectedRoute exact path = '/Lobby' component = {Lobby}/>
                </Switch>
            </div>
        </Router>
    )
}

export default App;