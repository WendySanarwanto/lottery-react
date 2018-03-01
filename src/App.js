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
    value: '',
    enteringPlayerStatus: ''
  };

  async pickGameInfo() {
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({players});
    this.setState({balance});    
  }

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    await this.pickGameInfo();
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();    
    console.log(`[DEBUG] - <App.onSubmit> accounts: \n${JSON.stringify( accounts, " ", 2)}\nvalue: ${this.state.value}`);

    const account = Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : undefined;

    if (!account) {
      console.log(`[ERROR] - <App.onSubmit> cannot find available account.`);
      return;
    }

    // TODO: Validate account's balance against entered value.

    // TODO: Calling ethereum's method might take longer to complete. 
    //       Therefore, we need to put some kind of processing feedback indicator to user.

    try {
      this.setState({enteringPlayerStatus: `Waiting for transaction success ... `});      
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });

      // TODO: When sending process is finished, close the processing feedback
      //       And show some kind of visual feedback which tells the user that the process has been completed.
      this.setState({enteringPlayerStatus: `You have entered the game.`});
      await this.pickGameInfo();
    } catch(err) {
      this.setState({enteringPlayerStatus: `Entering the game is failing: ${err.message}`});
    }
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
        <p>There are currently <b>{this.state.players.length}</b> people entered,</p>
        <p>competing to win <b>{web3.utils.fromWei(this.state.balance, 'ether')}</b> ether.</p>
        
        <hr/>

        <form onSubmit={this.onSubmit}>
          <h4>Hello, do you want to play a game ?</h4>

          <div>
            <label>Please enter amount of your ether, to enter the game (>0.01 Ether)</label>
            &nbsp;&nbsp;<input value={this.state.value}
              onChange={event => this.setState({ value: event.target.value})} />
          </div>
          <p>
            <button>Enter</button>
          </p>
          
        </form>

        <hr/>

        <h1>{this.state.enteringPlayerStatus}</h1>

      </div>
    );
  }
}

export default App;
