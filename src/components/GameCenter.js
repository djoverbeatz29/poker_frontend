import React from 'react';
import ShowPlayer from './ShowPlayer';

class GameCenter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            current_game_id: 0,
            pool: 0,
            min_bet: 5,
            bet: 0,
            max_bet: 0,
            players: [this.props.player],
            avail_players: [this.props.player.gameId]
        }
    }

    componentDidMount() {
        for (const id of [2]) {
            fetch(`http://localhost:3001/players/${id}`)
            .then(r=>r.json())
            .then(player=>{
                console.log(`Getting Player #${id}`);
                player.hand = [];
                player.isHuman = false;
                player.gameId = this.state.players.length;
                this.setState(prevState => {
                    return {
                        players: [...prevState.players, player],
                        avail_players: [...prevState.avail_players, player.gameId]
                    }
                })
            })
        }
    }

    handleBet = e => {
        console.log(e.target.value);
        this.setState({
            bet: parseInt(e.target.value) || 0
        })
    }

    handleChoice = e => {
        if (e.target.type === 'submit') {
            if (e.target.value === 'Raise') {
                this.setState(prev => {
                    return {
                        pool: prev.pool + prev.bet,
                        bet: 0
                    }
                })
            }
        }
        this.setState(prev => {
            return {
                current_game_id: (prev.current_game_id + 1) % (prev.players.length + 1)
            }
        })
    }

    render() {
        const {username} = this.state.players[this.state.current_game_id];
        return (
            <div>
                <h1>Welcome to Poker!</h1>
                <h2>Currently up: {username}</h2>
                <img src={"../../public/images/cards/Back.jpg"} alt=''></img>
                <div className='player-holder'>
                    {this.state.players.map(player => <ShowPlayer player={player}/>)}
                </div>
                <div onClick={this.handleChoice} className='turn-option-holder'>
                    Your action: {['Check', 'Call', 'Fold'].map(op=><input type='submit' key={op} value={op} />)}
                    <br />
                    <input onChange={this.handleBet} type='text' name='bet_amount'></input>
                    <input type='submit' value='Raise' />  
                </div>
            </div>
        )
    }
}

export default GameCenter;