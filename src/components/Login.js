import React from "react";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
    };
  }

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const reqObj = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state),
    };

    fetch("http://localhost:3001/login", reqObj)
      .then((resp) => resp.json())
      .then((playerData) => {
        const player = playerData.player;
        localStorage.setItem("token", playerData.token);
        this.props.handleLogin(player);
        this.props.history.push("/home");
      })
      .catch((err) => console.log(err));
  };

  // useEffect(() => {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //         fetch('http://localhost:3001/auto_login', {
  //             headers: {
  //                 Authorization: `Bearer ${token}`
  //             }
  //         })
  //         .then(r => r.json())
  //         .then(data => {
  //             setUsername(data.username);
  //             setPassword(data.password);
  //         })
  //     }
  // })

  render() {
    return (
      <div>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <h1>Welcome to Poker</h1>
          <label>Username </label>
          <input
            onChange={(e) => this.handleOnChange(e)}
            value={this.state.username}
            type="text"
            name="username"
          ></input>
          <br />
          <label>Password </label>
          <input
            onChange={(e) => this.handleOnChange(e)}
            value={this.state.password}
            type="password"
            name="password"
          ></input>
          <br />
          <input type="submit" value="Log In" />
        </form>
      </div>
    );
  }
}

export default Login;
