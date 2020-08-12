import React from 'react';

class ShowPlayer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            player: this.props.player
        }
    }

    render() {
        const [username, game_balance, amount_bet, hand] = this.state.player;
        return (
            <div>
                <h1>{username}</h1>
                <h2>{game_balance}</h2>
                <h2>{amount_bet}</h2>
                {hand.map(card => <img src={`../../public/images/photos/${card.isVisible ? card.code : 'Back'}`} alt='' />)}
            </div>
        )
    }
}

export default ShowPlayer;