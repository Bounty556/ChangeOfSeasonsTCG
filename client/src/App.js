import React, {useEffect} from 'react';
import ProtectedRoute from './components/ProtectedRoute'
import {logout, getAuthLocally, saveAuthLocally} from './utils/authentication'
import {useAuthContext} from './utils/GlobalState'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Homepage from './pages/Homepage/index';
import About from './pages/About/index';
import SignUp from './pages/Sign Up/index';
import Signin from './pages/Sign In/index';
import ForgotPassword from './pages/Forgot-Password/index';
import UserProfile from './pages/UserProfile/index';
import Lobby from './pages/Lobby/index'
import Game from './pages/Gameboard/index';


function App() {
    const [auth, setAuth] = useAuthContext()
    useEffect(() => {
        let auth = getAuthLocally();
        console.log(auth);
        if (auth){
            setAuth(auth);
        }
    }, [])
    return (

        <Router>
            <div>
                <Switch>
                    <Route exact path='/' component={Homepage}/>
                    <Route exact path='/About' component={About}/>
                    <Route exact path='/Signup' component={SignUp}/>
                    <Route exact path='/Signin' component={Signin} />
                    <Route exact path='/Forgot' component={ForgotPassword}/>
                    <ProtectedRoute exact path = '/Profile' component = {UserProfile}/>
                    <Route exact path = '/Lobby' component = {Lobby}/>
                    <Route exact path='/Game' component={Game} />
                </Switch>
            </div>
        </Router>
    )
}

export default App;