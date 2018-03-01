import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import lottery from './lottery';
import web3 from './web3';

class App extends Component {
  state = {
    manager: ''
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    this.setState({manager});
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
      </div>
    );
  }
}

export default App;
