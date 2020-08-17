import { HAND_RANKS, RANK_VAL_MAP, SUITS, RANKS } from './constants';

export class Deck {
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

export class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.value = RANK_VAL_MAP[rank];
        this.code = `${rank}${suit[0]}`;
        this.isVisible = false;
    }

}