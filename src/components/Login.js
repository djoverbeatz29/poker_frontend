import React, { useState, useEffect } from 'react';

function Login(props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleUsername = e => {
        setUsername(e.target.value);
        console.log(username);
    }

    const handlePassword = e => {
        setPassword(e.target.value);
        console.log(password);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:3001/auto_login', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(r => r.json())
            .then(data => {
                setUsername(data.username);
                setPassword(data.password);
            })
        }
    })

    const handleSubmit = e => {
        e.preventDefault();
        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password_digest: password })
        })
        .then(r => r.json())
        .then(data => {
            localStorage.setItem('token', data.jwt);
            props.handleLogin(data.user);
        })
        setUsername('');
        setPassword('');
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Welcome to Poker</h1>
                <label>Username </label>
                <input onChange={handleUsername} type='text' name='username'></input><br/>
                <label>Password </label>
                <input onChange={handlePassword} type='password' name='password_digest'></input><br/>
                <input type='submit' value='Log In' />
            </form>
        </div>
    )

}

export default Login;