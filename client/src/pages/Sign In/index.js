import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Container from '../../components/Container/index';
import Card from '../../components/Card/index';
import Navbar from '../../components/Navbar/index';

import './signIn.css';

class SignIn extends Component {
    state = {
        username: '',
        password: ''
    }

    validateFunc = event => {
        event.preventDefault();

        let anyErrors = false;

        const username = this.state.username;
        const password = this.state.password;

        // Username validation
        if (username === '') {
            this.displayError('username', '* Cannot be empty');
            anyErrors = true;
        }

        // Password validation
        if (password === '') {
            this.displayError('password', '* Cannot be empty');
            anyErrors = true;
        }

        if (!anyErrors) {
            this.submitFunc();
        }
    }

    submitFunc = () => {
        axios.post ('/login', {username:this.state.username, password: this.state.password});
    }

    inputFunc = event => {
        const { name, value } = event.target;

        if (event.target.classList.contains('error')) {
            this.removeError(name);
        }
        
        this.setState({ [name]: value });
    }

    displayError = (name, errorMessage) => {
        // This will make the input's border color red and add a horizontal shaking animation
        document.getElementById(name).classList.add('animate__animated', 'animate__shakeX', 'error');
        document.getElementById(name).style.borderColor = 'red';

        // This will display the error message using a fade in animation
        document.getElementById(name + 'Error').classList.add('animate__animated', 'animate__fadeIn');
        document.getElementById(name + 'Error').innerHTML = errorMessage;

        // After 600 milliseconds this will remove the shaking animation class from the element 
        setTimeout(() => {
            document.getElementById(name).classList.remove('animate__animated', 'animate__shakeX');
        }, 1000);
    }

    removeError = name => {
        // This will reset the input's border color to black and fade out the error message
        document.getElementById(name).style.borderColor = 'black';
        document.getElementById(name + 'Error').classList.replace('animate__fadeIn', 'animate__fadeOut');

        // After 600 milliseconds this will remove the fade out class from the error message and reset the error message back to blank
        setTimeout(() => {
            document.getElementById(name + 'Error').classList.remove('animate__animated', 'animate__fadeOut');
            document.getElementById(name + 'Error').innerHTML = '';
        }, 600);
    }

    render() {
        return (
            <div>
                <Navbar />

                <Container className='animate__animated animate__zoomIn'>

                    <Card id='signInCard'>
                        <h2 className='signInTitle'>Sign In to Change of Seasons!</h2>

                        <hr />

                        <form onSubmit={this.validateFunc}>
                            {/* Enter username */}
                            <div className='form-group input-header'>
                                <label htmlFor='userInputusername'>Username</label>
                                <p id='usernameError' className='errorMessage'></p>
                                <input
                                    type='text'
                                    name='username'
                                    id='username'
                                    className='form-control'
                                    placeholder='Enter your username'
                                    onChange={this.inputFunc}
                                    value={this.state.username}
                                />
                            </div>

                            {/* Enter Password */}
                            <div className='form-group input-header'>
                                <label htmlFor='userInputPassword'>Password</label>
                                <p id='passwordError' className='errorMessage'></p>
                                <input
                                    type='password'
                                    name='password'
                                    id='password'
                                    className='form-control'
                                    placeholder='Enter a password'
                                    onChange={this.inputFunc}
                                    value={this.state.password}
                                />
                            </div>
                            <button type='submit' className='wood animate__animated animate__bounceIn' id='signUpButton' onClick={this.validateFunc}>Sign In!</button>
                        </form>
                    </Card>

                    <p id='dontHave' className='animate__animated animate__fadeIn animate__delay-2s'>Don't have an account yet? <Link className='clickHere' to='/Signup'>Click here to sign up!</Link></p>

                    <p id='forgot' className='animate__animated animate__fadeIn animate__delay-2s'>Forgot your password? <Link to='Forgot' className='clickHere'>Click here to reset it!</Link></p>
                </Container>
            </div>
        )
    }
}

export default SignIn;