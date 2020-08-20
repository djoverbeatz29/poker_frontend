import React from "react";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      error: "",
      username: "",
      password: "",
    };
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const reqObj = {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    };
    fetch("http://localhost:3001/login", reqObj)
    .then(r => r.json())
    .then(playerData => {
        const player = playerData.player;
        localStorage.setItem("token", playerData.token);
        this.props.handleLogin(player);
        this.props.history.push("/gamecenter");
      })
      .catch(err => {
        this.setState({
          error: "Invalid login. Try again."
        })
      });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <h1>Welcome to Poker</h1>
          <h2>{this.state.error}</h2>
          <label>Username </label>
          <input type="text" name="username"></input>
          <br />
          <label>Password </label>
          <input type="password" name="password"></input>
          <br />
          <input type="submit" value="Log In" />
        </form>
      </div>
    );
  }
}

export default Login;