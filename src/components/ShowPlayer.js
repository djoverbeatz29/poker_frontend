import React from 'react';

class ShowPlayer extends React.Component {
    constructor(props) {
        super(props)
        this.state = this.props
    }

    render() {
        return (
            <div>
                <h1>{this.state.username}</h1>
                <h2>{this.state.game_balance}</h2>
                <h2>{this.state.amount_bet}</h2>
                {this.state.hand.map(card => <img src={`../../public/images/photos/${card.isVisible ? card.code : 'Back'}`} alt='' />)}
            </div>
        )
    }
}

export default ShowPlayer;