import React from 'react';
import ShowPlayer from './ShowPlayer';
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
            max_bet: 0,
            comm_cards: [],
            players: [],
            avail_players: [],
            opsVisible: true,
            raise_amount: 0,
            turn: 0
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
                playerData.amount_bet = 0;
                playerData.game_balance = 500;
                localStorage.setItem("token", playerData.token);
                this.props.handleLogin(playerData);
                this.setState(prev => {
                    return {
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
                    console.log(this.state);
                })
                .catch(err => console.log(err))
            }
        }
    }

    turnChecker = () => {
        const playerBets = this.state.avail_players.map(i => this.state.players[i].amount_bet);
        if ((this.state.current_game_id === (this.state.button + 1) % this.state.players.length) && (playerBets.find(b => b!==this.state.max_bet) === undefined)) {
            this.setState({
                turn: this.state.turn + 1
            })
            if (this.state.turn === 1) {
                for (const i of [0,1,2]) {
                    const card = this.state.deck.cards.shift();
                    this.state.comm_cards.push(card);
                }
            }
            else if ([2,3].includes(this.state.turn)) {
                const card = this.state.deck.cards.shift();
                this.state.comm_cards.push(card);                
            }
            else if (this.state.turn > 3) {
                console.log('The game is over!')
            }
            console.log(this.state.comm_cards);
        }
    }

    dealCards = () => {
        this.nextPlayer();
        this.state.players[(this.state.button + 1) % this.state.players.length].amount_bet = this.state.min_bet;
        this.nextPlayer();
        this.state.players[(this.state.button + 2) % this.state.players.length].amount_bet = this.state.min_bet * 2;
        this.nextPlayer();
        this.setState(prev => {
            return {
                ...prev,
                pool: prev.pool + prev.min_bet * 3,
                max_bet: prev.min_bet * 2
            }
        })
        for (const i of [0, 1]) {
            for (const player of this.state.players) {
                const card = this.state.deck.cards.shift();
                player.hand.push(card);
            }
        }
        console.log(this.state);
    }

    makeTurn = () => {
        const player = this.getCurrentPlayer();
        if (!player.isHuman) {
            if (player.amount_bet < this.state.max_bet) {
                const diff = this.state.max_bet - player.amount_bet;
                player.amount_bet += diff;
                this.state.pool += diff;
                console.log(`Bot ${player.username} calls.`)
            }
            else {
                console.log(`Bot ${player.username} checks.`);
            }
            this.nextPlayer();
        }
        else {
            console.log(`Human ${player.username}, make your turn!`)
        }
        console.log(this.state);
        this.turnChecker();
    }

    getCurrentPlayer = () => {
        return this.state.players[this.state.current_game_id];
    }

    nextPlayer = () => {
        // Infinite loop that needs fixin!
        let id = this.state.current_game_id;
        do {
            id = (id + 1) % this.state.players.length;
        } while (!this.state.avail_players.includes(id));
        this.setState(prev => {
            return {
                current_game_id: id,
                opsVisible: this.state.players[id].isHuman
            }
        })
        console.log(`Current player: ${this.getCurrentPlayer().username}`);
    }

    handleBet = e => {
        this.setState({
            raise_amount: parseInt(e.target.value) || 0
        })
    }

    handleChoice = e => {
        const player = this.getCurrentPlayer();
        if (e.target.type === 'submit') {
            if (e.target.value === 'Raise') {
                const diff = (this.state.raise_amount + this.state.max_bet) - player.amount_bet;
                this.state.max_bet += this.state.raise_amount;
                player.amount_bet += diff;
                this.state.pot += diff;
                console.log(`You raised by ${this.state.raise_amount} to ${this.state.max_bet}!`);
            }
            else if (e.target.value === 'Call') {
                const diff = this.state.max_bet - player.amount_bet;
                player.amount_bet += diff;
                this.state.pool += diff;
                console.log('You called.');
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
            else if (e.target.value === 'Check') {
                console.log(`Human ${player.username} checks.`);
            }
            this.nextPlayer();
            console.log(`Now it is bot ${this.getCurrentPlayer().username}'s turn.`)
            this.turnChecker();
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
                    {(this.state.players || []).map(player => <ShowPlayer key={player.id} player={player}/>)}
                </div>
                {this.state.opsVisible &&
                    <div onClick={this.handleChoice} className='turn-option-holder'>
                    {(this.state.players[0] || {}).amount_bet === this.state.max_bet &&
                        <input type='submit' value='Check' />}
                    {(this.state.players[0] || {}).amount_bet < this.state.max_bet &&
                        <input type='submit' value='Call' />}
                    {(this.state.players[0] || {}).amount_bet < this.state.max_bet &&
                        <input type='submit' value='Fold' />}                                                
                    <br />
                    <input onChange={this.handleBet} type='text' name='bet_amount'></input>
                    <input type='submit' value='Raise' />  
                </div>}
            </div>
        )
    }
}

export default GameCenter;