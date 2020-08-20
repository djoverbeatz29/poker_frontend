import { HAND_RANKS } from './constants';

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

    for (const freq of Object.values(freqs)) {
        freqGroups[freq] = [];
    }

    for (const card of hand) {
        freqGroups[freqs[card.rank]].push(card);
        if (freqs[card.rank] !== maxFreq) {
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
                1: freqGroups[3].slice(freqGroups[3].length - 3, freqGroups[3].length)
            }
            for (const i of [0,1]) {
                rez.cards[i+2] = [extras[extras.length - 1 - i]];
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
                1: freqGroups[2]
            };
            for (const i of [0,1,2]) {
                rez.cards[i+2] = [extras[extras.length - 1 - i]];
            }
        }
    }
    else {
        rez.type = 'High Card';
        for (const i of [0,1,2,3,4]) {
            rez.cards[i+1] = [freqGroups[1][freqGroups[1].length - 1 - i]];
        }
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
    const cardsOb = {};
    if (flushCards) {
        const straightFlushCards = straightGetter(flushCards);
        if (straightFlushCards) {
            const cards = straightFlushCards.end;
            for (let i = 1; i <= 5; i++) {
                cardsOb[i] = [cards[cards.length-i]];
            }
            return {type: 'Straight Flush', cards: cardsOb};
        }
        else {
            for (let i = 1; i <= 5; i++) {
                cardsOb[i] = [flushCards[flushCards.length-i]];
            }
            return {type: 'Flush', cards: cardsOb};
        }
    }
    else {
        const straightCards = straightGetter(hand);
        if (straightCards) {
            const cards = straightCards.end;
            for (let i = 1; i <= 5; i++) {
                cardsOb[i] = [cards[cards.length-i]];
            }
            return {type: 'Straight', cards: cardsOb};
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