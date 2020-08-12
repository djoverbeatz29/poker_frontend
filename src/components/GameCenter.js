import React from 'react';
import ShowPlayer from './ShowPlayer';

class GameCenter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            players: []
        }
    }

    componentDidMount() {
        for (const id of this.props.playerIds) {
            fetch(`http://localhost:3001/players/${id}`)
            .then(r=>r.json())
            .then(player=>{
                console.log(`Getting Player #${id}`);
                player.hand = [];
                this.setState(prevState => {
                    return {
                        players: [...prevState.players, player]
                    }
                })
            })
        }
    }

    handleChoice = e => {
        console.log(e.target.innerText);
    }

    render() {
        console.log(this.state.players);
        return (
            <div>
                <h1>Welcome to Poker!</h1>
                <div className='player-holder'>
                    {this.state.players.map(player => <ShowPlayer player={player}/>)}
                </div>
                <div className='turn-option-holder'>
                    Your action: {['Check', 'Raise', 'Call', 'Fold'].map(op=><button onClick={this.handleChoice} key={op} className={op}>{op}</button>)}
                </div>
            </div>
        )
    }
}

export default GameCenter;