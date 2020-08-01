import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Container from '../../components/Container/index';
import Card from '../../components/Card/index';
import Navbar from '../../components/Navbar/index';

import './signUp.css';

class SignUp extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        secondPassword: ''
    }

    validateFunc = event => {
        event.preventDefault();

        let anyErrors = false;

        const defaultMessage = '* Cannot be empty';

        const username = this.state.username;
        const email = this.state.email;
        const password = this.state.password;
        const secondPassword = this.state.secondPassword;
        
        // Username validation
        if (username === '') {
            this.displayError('username', defaultMessage);
            anyErrors = true;
        } else if (username.length < 3 || username.length > 20) {
            this.displayError('username', '* Username must be between 3 and 20 characters');
            anyErrors = true;
        }

        // Email validation
        if (email === '') {
            this.displayError('email', defaultMessage);
            anyErrors = true;
        } else if (!email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)) {
            this.displayError('email', '* Not valid email address.');
            anyErrors = true;
        }

        // Password validation
        if (password === '') {
            this.displayError('password', defaultMessage);
            anyErrors = true;
        } else if (password.length < 6 || password.length > 128) {
            this.displayError('password', '* Password must be between 6 and 128 characters');
            anyErrors = true;
        }
        
        // secondPassword validation
        if (secondPassword === '') {
            this.displayError('secondPassword', defaultMessage);
            anyErrors = true;
        } else if (password !== secondPassword) {
            this.displayError('secondPassword', '* Passwords do not match');
            anyErrors = true;
        }

        // If there are no errors then run the submit function
        if (!anyErrors) {
            this.submitFunc();
        }
    }

    submitFunc = () => {
        axios.post('/api/register', {username:this.state.username, password: this.state.password, email: this.state.email})
    }

    inputFunc = event => {
        const { name, value } = event.target;
        const errorCheck = document.getElementById(name).classList;

        if (errorCheck.contains('error')) {
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
        }, 600);
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

                    <Card id='signUpCard'>
                        <h2 className='signUpTitle'>Sign Up for Change of Seasons!</h2>

                        <hr />

                        <form onSubmit={this.validateFunc}>
                            {/* Enter username */}
                            <div className='form-group input-header'>
                                <label htmlFor='userInputUsername'>Username</label>
                                <p id='usernameError' className='errorMessage'></p>
                                <input
                                    type='username'
                                    name='username'
                                    id='username'
                                    className='form-control'
                                    placeholder='Enter a username'
                                    onChange={this.inputFunc}
                                    value={this.state.username}
                                />
                            </div>

                            {/* Enter Email */}
                            <div className='form-group input-header'>
                                <label htmlFor='userInputEmail'>Email address</label>
                                <p id='emailError' className='errorMessage'></p>
                                <input
                                    type='email'
                                    name='email'
                                    id='email'
                                    className='form-control'
                                    placeholder='Enter your email'
                                    onChange={this.inputFunc}
                                    value={this.state.email}
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

                            {/* Re-enter Password */}
                            <div className='form-group input-header'>
                                <label htmlFor='userInputPassword input-header'>Re-enter Password</label>
                                <p id='secondPasswordError' className='errorMessage'></p>
                                <input
                                    type='password'
                                    name='secondPassword'
                                    className='form-control'
                                    id='secondPassword'
                                    placeholder='Re-enter your password'
                                    onChange={this.inputFunc}
                                    value={this.state.secondPassword}
                                />
                            </div>

                            <button type='submit' className='wood animate__animated animate__bounceIn' id='signUpButton' onClick={this.validateFunc}>Sign Up!</button>
                        </form>
                    </Card>

                    <p id='alreadyHave' className='animate__animated animate__fadeIn animate__delay-2s'>Already have an account? <Link id='clickHere' to='/Signin'>Click here to sign in!</Link></p>
                </Container>
            </div>
        )
    }
}

export default SignUp;