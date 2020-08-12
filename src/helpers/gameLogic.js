import './handLogic';
import './constants';

class Round {
    constructor(min_bet = 5, button = 0) {
        this.deck = new Deck();
        this.pool = 0;
        this.availPlayers = players.map(p=>p.id);
        this.maxBet = 0;
        this.button = button;
        this.currPlayer = this.button + 2;
        this.min_bet = min_bet;
        this.step = 0;
        this.roundOver = false;
    }

    initialBets() {
        players[this.button + 1].amount_bet = min_bet;
        players[this.button + 2].amount_bet = min_bet * 2;
        this.maxBet = min_bet * 3;
    }

    playerTurn() {
        if (this.availPlayers.includes(this.currPlayer)) {

        }
        else {
            const player = players[this.currPlayer];
            if (player.amount_bet < this.maxBet) {
                const options = ['call', 'fold', 'raise'];
                if (playerOp === 'fold') {
                    this.availPlayers = this.availPlayers.filter(ix => ix !== player.id);
                }
                else if (playerOp === 'call') {
                    const spread = this.maxBet - player.amount_bet;
                    player.amount_bet += spread;
                    this.pool += spread;
                }
                else if (playerOp === 'raise') {
                    const raiseAmt;
                    this.maxBet += raiseAmt;
                    const bet = raiseAmt - player.amount_bet;
                    this.pool += bet;
                    player.amount_bet += bet;
                }
            }
            else if (player.amount_bet === this.maxBet) {
                const options = ['check', 'raise'];
                if (playerOp === 'check') {

                }
                else {
                    const raiseAmt;
                    this.pool += raiseAmt;
                    this.maxBet += raiseAmt;
                    player.amount_bet += raiseAmt;
                }
            }
        }
        this.currPlayer = (this.currPlayer + 1) % players.length;
    }

    playCycle() {
        do {
            this.playerTurn();
        }
        while (this.currPlayer !== this.button);
        this.stepChecker();
    }

    stepChecker() {
        if (!this.availPlayers.find(p=>p.amount_bet < this.maxBet)) {
            this.step++;
            if (this.step === 1) {
                this.dealCommCards(3);
            }
            else if ([2,3].includes(this.step)) {
                this.dealCommCards();
            }
            else {
                this.roundOver = true;
            }
        }
    }

    roundChecker() {
        if (this.roundOver) {
            this.handComp();
            this.button = (this.button + 1) % this.players.length;
        }
    }
}

class Game {
    constructor(players) {
        this.players = players;
        this.deck = new Deck();
        this.commCards = [];
        this.button = 0;
    }

    dealCards() {
        for (const i of [0, 1]) {
            for (const player of this.players) {
                player.cards.push(this.deck.cards.shift());
            }
        }
    }

    dealCommCards(n=1) {
        for (let i = 0; i < n; i++) {
            const card = this.deck.cards.shift();
            this.commCards.push(card);
            console.log(`Card drawn: ${card.rank} of ${card.suit}`)
        }
    }

    handComp() {
        for (const player of this.players) {
            player.fullHand = this.commCards.concat(player.cards);
            player.bestHand = handGetter(player.fullHand);
        }
        let winners = [players[0]];
        for (const player of players.slice(1,players.length)) {
            const winner = winners[0].bestHand;
            const challenger = player.bestHand;
            if (winner.rank < challenger.rank) {
    
            }
            else if (winner.rank > challenger.rank) {
                winners = [player];
            }
            else {
                let boo = true;
                for (const key of Object.keys(winner.cards)) {
                    const winnerMax = winner.cards[key][winner.cards[key].length - 1].value;
                    const challengerMax = challenger.cards[key][challenger.cards[key].length - 1].value;
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
        console.log(`The winner${winners.length > 1 ? 's are' : ' is'}, with a ${winners[0].bestHand.type}: ${winners.map(w=>w.username).join(', ')}!`);
        for (const winner of winners) {
            winner.balance += (this.pool / winners.length);
        }
        for (const player of players) {
            player.cards = [];
            player.amount_bet = 0;
        }
        return winners;
    }

}

class Deck {
    constructor() {
        this.cards = [];
        for (const suit of SUITS) { 
            for (const rank of RANKS) {
                this.cards.push(new Card(rank, suit));
            }
        }
        this.shuffle();
    }

    shuffle() {
        for (let i = 52; i > 0; i--) {
            this.cards.push(this.cards.splice(Math.floor(i * Math.random()), 1)[0]);
        }
    }

    dealCard() {
        return this.cards.shift();
    }
}

class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.value = RANK_VAL_MAP[rank];
        this.code = `${rank}${suit[0]}`;
        this.isVisible = false;
    }

}