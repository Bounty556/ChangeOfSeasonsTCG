import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import Card from '../../components/Card/index';
import Navbar from '../../components/Navbar/index';

import './signIn.css';

class SignIn extends Component {
    state = {
        email: '',
        password: ''
    }

    submitFunc = event => {
        event.preventDefault();
    }

    inputFunc = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    render() {
        return (
            <div>
                <Navbar />

                <Container className='animate__animated animate__zoomIn'>

                    <Card id='signInCard'>
                        <h2 className='signInTitle'>Sign In to Change of Seasons!</h2>

                        <hr />

                        <form>
                            {/* Enter Email */}
                            <div className='form-group input-header'>
                                <label htmlFor='userInputEmail'>Email address</label>
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
                            <button type='submit' className='wood animate__animated animate__bounceIn' id='signUpButton' onSubmit={this.submitFunc}>
                        Sign In!
                    </button>
                        </form>
                    </Card>

                    {/* <button type='submit' className='wood animate__animated animate__bounceIn' id='signUpButton' onSubmit={this.submitFunc}>
                        Sign In!
                    </button> */}

                    <p id='dontHave' className='animate__animated animate__fadeIn animate__delay-2s'>Don't have an account yet? <Link className='clickHere' to='/Signup'>Click here to sign up!</Link></p>

                    <p id='forgot' className='animate__animated animate__fadeIn animate__delay-2s'>Forgot your password? <Link to='Forgot' className='clickHere'>Click here to reset it!</Link></p>
                </Container>
            </div>
        )
    }
}

export default SignIn;