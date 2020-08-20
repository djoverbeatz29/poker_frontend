import React from 'react';
// import ShowPlayer from './ShowPlayer';
import { Deck } from '../helpers/gameLogic';
import { handGetter } from '../helpers/handLogic';
import images from '../images/index';

class GameCenter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            deck: new Deck(),
            dialog: "",
            errors: "",
            button: 0,
            current_game_id: 0,
            pool: 0,
            min_bet: 5,
            max_bet: 0,
            comm_cards: [],
            players: [],
            avail_players: [],
            started: false,
            over: false,
            raise_amount: 0,
            turn: 0,
            cycle: 0
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
                localStorage.setItem("token", playerData.token);
                this.props.handleLogin(playerData);
                playerData.hand = [];
                playerData.amount_bet = 0;
                playerData.game_balance = 500;
                playerData.isIn = true;
                this.setState(prev => {
                    return {
                        players: [playerData],
                        avail_players: [playerData.gameId]}
                })
            })
            .catch(err => console.log(err))

            for (const id of [2,3,4,5]) {
                fetch(`http://localhost:3001/players/${id}`)
                .then(r=>r.json())
                .then(player=>{
                    player.hand = [];
                    player.isHuman = false;
                    player.isIn = true;
                    player.gameId = this.state.players.length;
                    this.setState(prevState => {
                        return {
                            players: [...prevState.players, player],
                            avail_players: [...prevState.avail_players, player.gameId]
                        }
                    })
                })
                .catch(err => console.log(err))
            }
        }
    }

    renderPlayer = i => {
        if (this.state.players.length > 0) {
            const player = this.state.players[i];
            const {username, game_balance, amount_bet, hand} = player;
            return (
                <div className='player-info' key={i}>
                    <h3>
                        {this.state.button === player.gameId ? "🟢" : ""}
                        {this.state.current_game_id === player.gameId ? "🔴" : ""}
                        {username} - ${amount_bet}
                    </h3>
                    <h3>Bank: ${game_balance}</h3>
                    {hand.map(card => this.renderCard(card))}
                    {player.bestHand && <h3>{player.bestHand.type}</h3>}
                </div>
            )
        }
    }

    renderCard = card => {
        return <img src={card.isVisible ? card.image : images['Back']} alt='' />;
    }

    getCurrentPlayer = () => {
        return this.state.players[this.state.current_game_id];
    }

    getYou = () => {
        return this.state.players[0];
    }

    dealCards = () => {
        for (const card of this.state.deck.cards) {
            card.image = images[card.code];
        }
        const [si, bi] = [(this.state.button + 1) % this.state.players.length, (this.state.button + 2) % this.state.players.length];
        const [small, big] = [this.state.players[si], this.state.players[bi]];
        small.amount_bet += this.state.min_bet;
        small.game_balance -= this.state.min_bet;
        big.amount_bet += 2 * this.state.min_bet;
        big.game_balance -= 2 * this.state.min_bet;

        this.setState(prev => {
            return {
                current_game_id: (prev.button + 3) % this.state.players.length,
                pool: prev.pool + prev.min_bet * 3,
                max_bet: prev.min_bet * 2,
                started: true
            }
        })
        for (let i = 0; i < 2; i++) {
            for (const player of this.state.players) {
                const card = this.state.deck.cards.shift();
                if (player.isHuman) {
                    card.isVisible = true;
                }
                player.hand.push(card);
            }
        }
    }

    turnChecker = () => {
        const playerBets = this.state.avail_players.map(i => this.state.players[i].amount_bet);
        if ((this.state.current_game_id === (this.state.button + 2) % this.state.players.length) && (this.state.cycle > 0) && (playerBets.find(b => b!==this.state.max_bet) === undefined)) {
            this.setState(prev => {
                return {
                    turn: prev.turn + 1,
                    cycle: 0
                }
            })
            if (this.state.turn === 1) {
                for (let i = 0; i < 3; i++) {
                    const card = this.state.deck.cards.shift();
                    card.isVisible = true;
                    this.state.comm_cards.push(card);
                }
            }
            else if ([2,3].includes(this.state.turn)) {
                const card = this.state.deck.cards.shift();
                card.isVisible = true;
                this.state.comm_cards.push(card);                
            }
            else if (this.state.turn > 3) {
                this.setState({
                    dialog: 'The game is over!',
                    over: true
                })
                this.handComp();
            }
        }
    }

    botTurn = player => {
        if (player.amount_bet < this.state.max_bet) {
            const diff = parseInt(this.state.max_bet - player.amount_bet);
            player.amount_bet += diff;
            player.game_balance -= diff;
            this.state.pool += diff;
            this.setState({
                dialog: `${player.username} calls.`
            })
        }
        else {
            this.setState({
                dialog: `${player.username} checks.`
            })
        }
        this.nextPlayer();
    }

    makeTurn = () => {
        const player = this.getCurrentPlayer();
        if (!player.isHuman) {
            setTimeout(this.botTurn(player), 1000);
        }
        else {
            this.setState({
                dialog: `${player.username}, make your turn!`
            })
        }
        console.log(this.state);
    }

    nextPlayer = () => {
        const nextId = (this.state.current_game_id + 1) % this.state.players.length; 
        this.setState(prev => {
            return {
                avail_players: prev.avail_players.filter(i => this.state.players[i].isIn),
                current_game_id: nextId,
            }
        })
        if (this.state.current_game_id === (this.state.button + 1) % this.state.players.length) {
            this.setState(prev => {
                return {
                    cycle: prev.cycle + 1
                }
            })
        }
        this.turnChecker();
    }

    handleBet = e => {
        this.setState({
            raise_amount: parseInt(e.target.value) || 0
        })
    }

    humanTurn = e => {
        const player = this.getCurrentPlayer();
        if (e.target.type === 'submit') {
            if (e.target.value === 'Raise') {
                if (!(parseInt(this.state.raise_amount) > 0)) {
                    this.setState({
                        dialog: "Entry must be a number greater than 0."
                    })
                }
                else if (parseInt(this.state.raise_amount) + this.state.max_bet > player.game_balance) {
                    this.setState({
                        dialog: "Bet cannot exceed balance."
                    })
                }
                else {
                    const diff = (this.state.raise_amount + this.state.max_bet) - player.amount_bet;
                    this.state.max_bet += this.state.raise_amount;
                    player.amount_bet += diff;
                    player.game_balance -= diff;
                    this.state.pool += diff;
                    this.setState({
                        dialog: `You raised by $${this.state.raise_amount} to $${this.state.max_bet}!`
                    })
                }
            }
            else if (e.target.value === 'Call') {
                const diff = this.state.max_bet - player.amount_bet;
                player.amount_bet += diff;
                player.game_balance -= diff;
                this.state.pool += diff;
                this.setState({
                    dialog: 'You called.'
                })
            }
            else if (e.target.value === 'Fold') {
                player.isIn = false;
                this.setState(prev => {
                    return {
                        ...prev,
                        dialog: `You folded. Remaining players: ${this.state.avail_players.map(i=>this.state.players[i].username).join(', ')}`,
                        avail_players: prev.avail_players.map(i => i !== this.state.current_game_id)
                    }
                })
            }
            else if (e.target.value === 'Check') {
                this.setState({
                    dialog: `${player.username} checks.`
                })
            }
            this.nextPlayer();
        }
    }

    handComp() {
        const players = this.state.players;
        for (const player of players) {
            for (const card of player.hand) {
                card.isVisible = true;
            }
            player.fullHand = this.state.comm_cards.concat(player.hand);
            player.bestHand = handGetter(player.fullHand);
        }
        let winners = [players[0]];
        for (const player of players.slice(1,players.length)) {
            const winner = winners[0].bestHand;
            const challenger = player.bestHand;
            if (winner.rank < challenger.rank || !player.isIn) {
    
            }
            else if (winner.rank > challenger.rank) {
                winners = [player];
            }
            else {
                let boo = true;
                for (const key of Object.keys(winner.cards)) {
                    const winnerMax = winner.cards[key][0].value;
                    const challengerMax = challenger.cards[key][0].value;
                    if (winnerMax === challengerMax) {
    
                    }
                    else {
                        if (winnerMax > challengerMax) {
                            boo = false;
                            break;
                        }
                        else {
                            winners = [player];
                            boo = false;
                            break;
                        }
                    }
                }
                if (boo) {
                    winners.push(player);
                }
            }
        }
        this.setState({
            dialog: `The winner${winners.length > 1 ? 's are' : ' is'}, with a ${winners[0].bestHand.type}: ${winners.map(w=>w.username).join(', ')}!`
        })
        for (const winner of winners) {
            const winnings = parseFloat(this.state.pool / winners.length);
            winner.game_balance += winnings;
        }
    }


    resetState = () => {
        this.setState(prev => {
            return {
                deck: new Deck(),
                dialog: "",
                button: (prev.button + 1) % (prev.players.length),
                current_game_id: (prev.button + 1) % (prev.players.length),
                pool: 0,
                min_bet: 5,
                max_bet: 0,
                comm_cards: [],
                avail_players: prev.players.map(p => p.gameId),
                started: false,
                over: false,
                raise_amount: 0,
                turn: 0        
            }
        })
        for (const player of this.state.players) {
            player.hand = [];
            player.fullHand = [];
            player.amount_bet = 0;
            player.bestHand = {};
        }
    }


    startGame = () => {
        this.dealCards();
        // while (!this.state.over) {
        //     this.makeTurn();
        //     this.turnChecker();
        // }
        // this.handComp();
    }

    newGame = () => {
        this.resetState();
    }

    render() {
        return (
            <div>
                <h1>Welcome to Poker!</h1>
                <h2>{this.state.dialog}</h2>
                <h2>{this.state.errors}</h2>
                {this.state && <h2>Pool: ${this.state.pool}</h2>}
                <div className='comm-card-holder'>
                    {(this.state.comm_cards || []).map(card => this.renderCard(card))}
                </div>
                <h3>Opponents</h3>
                <div className='player-info-holder'>
                    {this.state.players.slice(1, this.state.players.length).map(player => this.renderPlayer(player.gameId))}
                </div>
                <div className='my-card-holder'>
                    { this.renderPlayer(0) }
                </div>
                {!this.state.started && <button onClick={this.startGame}>Start Game</button>}
                {this.state.started && !this.state.over && !this.getCurrentPlayer().isHuman && <button onClick={this.makeTurn}>Make Turn</button>}
                {this.state.over && <button onClick={this.newGame}>New Game</button>}
                {this.state.started && this.state.current_game_id === 0 && !this.state.over &&
                    <div onClick={this.humanTurn} className='turn-option-holder'>
                    {(this.state.players[0] || {}).amount_bet === this.state.max_bet &&
                        <input type='submit' value='Check' />}
                    {(this.state.players[0] || {}).amount_bet < this.state.max_bet &&
                        <input type='submit' value='Call' />}
                    {(this.state.players[0] || {}).amount_bet < this.state.max_bet &&
                        <input type='submit' value='Fold' />}                                                
                    <input onChange={this.handleBet} type='text' name='bet_amount'></input>
                    <input type='submit' value='Raise' />  
                </div>}
            </div>
        )
    }

}

export default GameCenter;