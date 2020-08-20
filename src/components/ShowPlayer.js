import React from 'react';

class ShowPlayer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            player: this.props.player
        }
    }

    render() {
        const {username, game_balance, amount_bet, hand} = this.state;
        return (
            <div>
                <h2>{username}</h2>
                <h2>{game_balance}</h2>
                <h2>{amount_bet}</h2>
                {hand && hand.map(card => <img src={card.image} alt='' />)}
            </div>
        )
    }
}

export default ShowPlayer;