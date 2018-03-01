import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import lottery from './lottery';
import web3 from './web3';

class App extends Component {
  state = {
    manager: '',
    balance: '',
    players: [],
    value: ''
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
    console.log(`[DEBUG] - <App> this.state.value: ${this.state.value}`);
    return (
      <div>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to Lottery Contract</h1>
          </header>  
        </div>      
        <p>This contract is managed by {this.state.manager}</p>
        <p>There are currently {this.state.players.length} people entered,</p>
        <p>competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether.</p>
        
        <hr/>

        <form>
          <h4>Hello, do you want to play a game ?</h4>
          <div>
            <label>Please enter amount of your ether, to enter the game</label>
            &nbsp;&nbsp;<input value={this.state.value}
              onChange={event => this.setState({ value: event.target.value})} />
          </div>
        </form>

      </div>
    );
  }
}

export default App;
