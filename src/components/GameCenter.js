import React from 'react';
import ShowPlayer from './ShowPlayer';
// import cardImage from '../images/2H.png';
import { Deck } from '../helpers/gameLogic';

class GameCenter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            deck: new Deck(),
            button: 0,
            current_game_id: 0,
            pool: 0,
            min_bet: 5,
            bet: 0,
            max_bet: 0,
            players: [],
            avail_players: [],
            opsVisible: true
        }
    }

    componentDidMount() {
        const token = localStorage.getItem("token");
        if (!token) {
            this.props.history.push('/login');
        }
        else {
            fetch('http://localhost:3001/player', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(r=>r.json())
            .then(playerData => {
                playerData.hand = [];
                localStorage.setItem("token", playerData.token);
                this.props.handleLogin(playerData);
                this.setState(prev => {
                    return {
                        ...prev,
                        players: [playerData],
                        avail_players: [playerData.gameId]}
                })
            })
            .catch(err => console.log(err))

            for (const id of [2,3,4]) {
                fetch(`http://localhost:3001/players/${id}`)
                .then(r=>r.json())
                .then(player=>{
                    player.hand = [];
                    player.isHuman = false;
                    player.gameId = this.state.players.length;
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            players: [...prevState.players, player],
                            avail_players: [...prevState.avail_players, player.gameId]
                        }
                    })
                    console.log(this.state.players);
                })
                .catch(err => console.log(err))
            }
        }
    }

    dealCards = () => {
        this.state.players[(this.state.button + 1) % this.state.players].amount_bet = this.state.min_bet;
        this.nextPlayer();
        this.state.players[(this.state.button + 2) % this.state.players].amount_bet = this.state.min_bet * 2;
        this.nextPlayer();
        for (const i of [0, 1]) {
            for (const player of this.state.players) {
                const card = this.state.deck.cards.shift();
                player.hand.push(card);
            }
        }
        console.log(this.state.players);
        console.log(this.state.deck.cards);
    }

    makeTurn = () => {
        console.log(this.state);
        const player = this.getCurrentPlayer();
        if (!player.isHuman) {
            console.log(`Bot ${player.username} passes.`);
            this.nextPlayer();
        }
        else {
            console.log(`Human ${player.username}, make your turn!`)
        }
    }

    getCurrentPlayer = () => {
        return this.state.players[this.state.current_game_id];
    }

    nextPlayer = () => {
        // Infinite loop that needs fixin!
        do {
            this.setState(prev => {
                return {
                    ...prev,
                    current_game_id: (prev.current_game_id + 1) % prev.players.length,
                    opsVisible: this.getCurrentPlayer().isHuman
                }
            })
        } while (!this.state.avail_players.includes(this.state.current_game_id));
        console.log(`Current player: ${this.getCurrentPlayer().username}`);
    }

    handleBet = e => {
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
            else if (e.target.value === 'Fold') {
                console.log('You folded.');
                this.setState(prev => {
                    return {
                        avail_players: prev.avail_players.map(i => i !== this.state.current_game_id)
                    }
                })
                console.log(`Remaining players: ${this.state.avail_players.map(i=>this.state.players[i].username).join(', ')}`);
            }
            this.nextPlayer();
            console.log(`Now it is bot ${this.getCurrentPlayer().username}'s turn.`)
        }
    }

    render() {
        return (
            <div>
                <h1>Welcome to Poker!</h1>
                <h2>Currently up: </h2>
                <button onClick={this.dealCards}>Deal Cards</button>
                <button onClick={this.makeTurn}>Make Turn</button>
                <div className='player-holder'>
                    {this.state.players ? this.state.players.map(player => <ShowPlayer key={player.id} player={player}/>) : null}
                </div>
                {this.state.opsVisible &&
                    <div onClick={this.handleChoice} className='turn-option-holder'>
                    Your action: {['Check', 'Call', 'Fold'].map(op=><input type='submit' key={op} value={op} />)}
                    <br />
                    <input onChange={this.handleBet} type='text' name='bet_amount'></input>
                    <input type='submit' value='Raise' />  
                </div>}
            </div>
        )
    }
}

export default GameCenter;