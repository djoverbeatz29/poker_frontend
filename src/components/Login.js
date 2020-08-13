import React from 'react';

class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password_digest: '',
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
        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then(r => r.json())
        .then(player => {
            localStorage.setItem('token', player.jwt);
            this.props.handleLogin(player);
            this.history.push(player);
            this.setState({
                username: '',
                password_digest: ''
            })
        })
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
                    <h1>Welcome to Poker</h1>
                    <label>Username </label>
                    <input type='text' name='username'></input><br/>
                    <label>Password </label>
                    <input type='password' name='password_digest'></input><br/>
                    <input type='submit' value='Log In' />
                </form>
            </div>
        )
    }

}

export default Login;