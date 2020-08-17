import React from 'react';
import './handLogic';

class Round extends React.Component {
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

    handleTurnClick = e => {
        const playerOp = e.target.value;
        if (!this.availPlayers.includes(this.currPlayer)) {
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