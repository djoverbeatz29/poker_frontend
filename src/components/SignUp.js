import React from 'react';

class SignUp extends React.Component {
    constructor() {
        super()
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            username: '',
            password: '',
            password_confirm: ''
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
        console.log(this.state);
    }

    handleSubmit = e => {
        e.preventDefault();
        fetch('http://localhost:3001/players', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then(r => r.json())
        .then(playerData => {
            localStorage.setItem('token', playerData.jwt);
            this.props.handleSignUp(playerData);
            this.history.push(playerData);
            this.setState({
                first_name: '',
                last_name: '',
                email: '',
                username: '',
                password: '',
                password_confirm: ''
            })
        })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <h1>Create a New Profile</h1>
                    <label>First Name </label>
                    <input type='text' name='first_name'></input><br/>
                    <label>Last Name </label>
                    <input type='text' name='last_name'></input><br/>
                    <label>Email </label>
                    <input type='text' name='email'></input><br/>
                    <label>Username </label>
                    <input type='text' name='username'></input><br/>
                    <label>Password </label>
                    <input type='password' name='password'></input><br/>
                    <label>Confirm Password </label>
                    <input type='password' name='password_confirm'></input><br/>
                    <input type='submit' value='Log In' />
                </form>
            </div>
        )
    }

}

export default SignUp;