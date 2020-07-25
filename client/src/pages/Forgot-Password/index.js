import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Container from '../../components/Container/index';
import Card from '../../components/Card/index';

import './forgotPassword.css';

class ForgotPassword extends Component {
    state = {
        email: ''
    }

    inputFunc = event => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    submitFunc = event => {
        event.preventDefault();
    }

    render() {
        return (
            <Container>
                <Card id='forgotPasswordCard'>
                    <form onSubmit={this.submitFunc}>
                        <h2>Enter your email address below</h2>

                        <div className='form-group'>
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

                        <button type='submit' className='btn btn-primary' id='resetPasswordButton'>
                            Reset password
                        </button>
                    </form>
                </Card>

                <p id='signIn'>Need to Sign in? <Link className='clickHere' to='/Signin'>Click here to go to the Sign in page!</Link></p>
            </Container>
        )
    }
}

export default ForgotPassword;