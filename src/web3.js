import Web3 from 'web3';

const metamaskWeb3 = window.web3;
const web3 = new Web3(metamaskWeb3.currentProvider);

export default web3;
