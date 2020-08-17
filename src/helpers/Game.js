import React from 'react';

class Game extends React.Component {
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