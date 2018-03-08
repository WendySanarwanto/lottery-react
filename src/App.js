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
    // console.log(`[DEBUG] - <App.pickGameInfo> players: \n${JSON.stringify(players, " ", 2)}\nbalance: ${balance}`);
  }

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    this.setState({manager});

    // console.log(`[DEBUG] - <App.componentDidMount> Calling 'pickGameInfo' ...`);
    await this.pickGameInfo();
  }

  async getCurrentAccount() {
    const accounts = await web3.eth.getAccounts();
    // console.log(`[DEBUG] - <App.getCurrentAccount> accounts: \n${JSON.stringify( accounts, " ", 2)}\nvalue: ${this.state.value}`);

    return Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : undefined;
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const account = await this.getCurrentAccount();

    if (!account) {
      // console.log(`[ERROR] - <App.onSubmit> cannot find available account.`);
      return;
    }

    // TODO: Validate account's balance against entered value.

    // TODO: Calling ethereum's method might take longer to complete. 
    //       Therefore, we need to put some kind of processing feedback indicator to user.

    try {
      this.setState({enteringPlayerStatus: `Waiting on transaction success ... `});
      // console.log(`[DEBUG] - <App.onSubmit> Before calling 'lottery.enter()', 'account' is `, account);
      await lottery.methods.enter().send({
        from: account,
        value: web3.utils.toWei(this.state.value, 'ether')
      });

      // TODO: When sending process is finished, close the processing feedback
      //       And show some kind of visual feedback which tells the user that the process has been completed.
      this.setState({enteringPlayerStatus: `You have entered the game.`});
      await this.pickGameInfo();
    } catch(err) {
      // TODO: Should display nice looking error message when the user rejects transaction(s)
      this.setState({enteringPlayerStatus: `Entering the game is failing: ${err.message}`});
    }
  }

  onClick = async(event) => {
    const account = await this.getCurrentAccount();

    if (!account) {
      console.log(`[ERROR] - <App.onSubmit> cannot find available account.`);
      return;
    }

    try {
      this.setState({enteringPlayerStatus: `Waiting on transaction success ... `});
      await lottery.methods.pickWinner().send({
        from: account
      });
      this.setState({enteringPlayerStatus: `A winner has been picked!`});
    } catch(err) {
      this.setState({enteringPlayerStatus: `Picking a winner is failing: ${err.message}`});
    }
  }

  render() {
    // console.log(`[DEBUG] - <App> web3.version: ${web3.version}`);
    web3.eth.getAccounts()
      .then((response) => {
        // console.log(`[DEBUG] - <App> Accounts: \n`, response);
      });
    // console.log(`[DEBUG] - <App> this.state.value: ${this.state.value}`);
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

        <h4>Ready to pick a winner ?</h4>
        <button onClick={this.onClick}>Pick a winner</button>

        <hr/>

        <h1>{this.state.enteringPlayerStatus}</h1>


      </div>
    );
  }
}

export default App;
