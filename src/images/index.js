import {SUITS, RANKS} from '../helpers/constants';

const images = {};
for (const suit of SUITS) {
    for (const rank of RANKS) {
        const code = `${rank}${suit[0]}`;
        images[code] = require(`./${code}.png`);
    }
}
images['Back'] = require('./Back.jpg');
images['Button'] = require('./Button.jpg');
images['Turn'] = require('./Turn.png');

export default images;