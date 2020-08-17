import {Card, Deck} from './gameLogic';
import { HAND_RANKS, RANK_VAL_MAP, SUITS, RANKS } from './constants';
import {dupeGetter, straightGetter, flushGetter, straightFlushGetter, handGetter} from './handLogic';

export function dupeGetter(hand) {
    hand = hand.sort((a,b)=>a.value>b.value?1:-1)
    const freqs = {};
    const freqGroups = {};
    let extras = [];
    const rez = {type: '', cards: {}};

    for (const card of hand) {
        freqs[card.rank] = (freqs[card.rank] || 0) + 1;
    }

    const maxFreq = Math.max(...Object.values(freqs));

    for (freq of Object.values(freqs)) {
        freqGroups[freq] = [];
    }

    for (const card of hand) {
        freqGroups[freqs[card.rank]].push(card);
        if (freqs[card.rank] != maxFreq) {
            extras.push(card);
        }
    }

    extras = extras.sort((a,b)=>a.value>b.value?a:b);

    if (maxFreq === 4) {
        rez.type = 'Four of a Kind';
        rez.cards = {
            1: freqGroups[4],
            2: [extras[extras.length - 1]]
        };
    }
    else if (maxFreq === 3) {
        if (freqGroups[2]) {
            rez.type = 'Full House';
            rez.cards = {
                1: freqGroups[3].slice(freqGroups[3].length - 3, freqGroups[3].length),
                2: freqGroups[2].slice(freqGroups[2].length - 2, freqGroups[2].length)
            };
        }
        else {
            rez.type = 'Three of a Kind';
            rez.cards = {
                1: freqGroups[3].slice(freqGroups[3].length - 3, freqGroups[3].length),
                2: extras.slice(extras.length - 2, extras.length)
            }
        }
    }
    else if (maxFreq === 2) {
        if (freqGroups[2].length > 2) {
            rez.type = 'Two Pair';
            rez.cards = {
                1: freqGroups[2].slice(freqGroups[2].length - 2, freqGroups[2].length),
                2: freqGroups[2].slice(freqGroups[2].length - 4, freqGroups[2].length - 2),
                3: [extras[extras.length - 1]]
            };
        }
        else {
            rez.type = 'Pair';
            rez.cards = {
                1: freqGroups[2],
                2: extras.slice(extras.length - 3, extras.length)
            };
        }
    }
    else {
        rez.type = 'High Card';
        rez.cards = freqGroups[1].slice(freqGroups[1].length - 5, freqGroups[1].length);
    }
    return rez;
}

export function flushGetter(hand) {
    const suits = {};
    for (const card of hand) {
        suits[card.suit] = (suits[card.suit] || 0) + 1;
    }
    if (Math.max(...Object.values(suits)) < 5) {
        return null;
    }
    else {
        const flushSuit = Object.keys(suits).reduce((a, b) => suits[a] > suits[b] ? a : b);
        const flushHand = hand.filter(c => c.suit === flushSuit).sort((a,b)=>a.value>b.value?1:-1);
        return flushHand;
    }
}

export function straightGetter(hand) {
    hand = hand.sort((a,b)=>parseInt(a.value)>parseInt(b.value) ? 1 : -1);
    const vals = {end: [hand[0]], len: 1};
    let currStreak = 1;
    let currEnd = 0;
    for (let i = 1; i < hand.length; i++) {
        if (hand[i].value === hand[i-1].value + 1) {
            currStreak++;
            if (currStreak >= vals.len) {
                vals.len = currStreak;
                currEnd = i;
            }
        }
        else if (hand[i].value === hand[i-1].value) {
        }
        else {
            currStreak = 1;
        }
    }
    vals.end = hand.slice(currEnd - vals.len + 1, currEnd + 1);
    return vals.len >= 5 ? vals : null;
}

export function straightFlushGetter(hand) {
    const flushCards = flushGetter(hand);
    if (flushCards) {
        const straightFlushCards = straightGetter(flushCards);
        if (straightFlushCards) {
            const cards = straightFlushCards.end;
            return {type: 'Straight Flush', cards: {1: cards.slice(cards.length - 5, cards.length)}};
        }
        else {
            return {type: 'Flush', cards: {1: flushCards.slice(flushCards.length - 5, flushCards.length)}};
        }
    }
    else {
        straightCards = straightGetter(hand);
        if (straightCards) {
            const cards = straightCards.end;
            return {type: 'Straight', cards: {1: cards.slice(cards.length - 5, cards.length)}};
        }
        else {
            return {type: 'Null'};
        }
    }
}

export function handGetter(hand) {
    const outcomes = [straightFlushGetter(hand), dupeGetter(hand)];
    const outcome = outcomes.reduce((a,b)=>HAND_RANKS[a.type]<HAND_RANKS[b.type]?a:b);
    outcome.rank = HAND_RANKS[outcome.type];
    return outcome;
}