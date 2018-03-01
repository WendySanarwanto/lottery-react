import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import lottery from './lottery';
import web3 from './web3';

class App extends Component {
  state = {
    manager: '',
    balance: '',
    players: []
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({manager});
    this.setState({players});
    this.setState({balance});
  }

  render() {
    console.log(`[DEBUG] - <App> web3.version: ${web3.version}`);
    web3.eth.getAccounts()
      .then((response) => {
        console.log(`[DEBUG] - <App> Accounts: \n`, response);
      });

    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>There are currently {this.state.players.length} people entered,</p>
        <p>competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether.</p>
      </div>
    );
  }
}

export default App;
