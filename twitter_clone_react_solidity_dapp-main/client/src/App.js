import React from "react";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Widgets from "./Widgets";
import "./App.css";
import { useState, useEffect } from "react";
import { TwitterContractAddress } from './config.js';
import {ethers} from 'ethers';
import Twitter from './utils/TwitterContract.json'

function App() {

  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [balance, setBalance] = useState("");


  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      let chainId = await ethereum.request({ method: 'eth_chainId'})
      console.log('Connected to chain:' + chainId)

      const sepoliaChainId = '0xaa36a7'

      if (chainId !== sepoliaChainId) {
        alert('You are not connected to the Sepolia Testnet!');
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Found account', accounts[0])
      setCurrentAccount(accounts[0])

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const TwitterContract = new ethers.Contract(
        TwitterContractAddress,
        Twitter.abi,
        signer
      );

      let accountExists = await TwitterContract.getAccountExists();
      console.log(accountExists);
      if (!accountExists) {
        let setInitialBalanceTx = await TwitterContract.setInitialBalance();
        console.log(setInitialBalanceTx);
      }
    } catch (error) {
      console.log('Error connecting to metamask', error)
    }
  }

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window
    let chainId = await ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain:' + chainId)

    const sepoliaChainId = '0xaa36a7'

    if (chainId !== sepoliaChainId) {
      setCorrectNetwork(false)
    } else {
      setCorrectNetwork(true)
    }
  }

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    connectWallet();
    checkCorrectNetwork();
  }, []);

  // Update the state of the balance variable
  const handleSetBalance = (newBalance) => {
    setBalance(newBalance);
  };
  
  return (
    // BEM
    <div>
    {currentAccount === '' ? (
      <button
      className='text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
      onClick={connectWallet}
      >
      Connect Wallet
      </button>
      ) : correctNetwork ? (
        <div className="app">
          <Sidebar balance={balance} setBalance={handleSetBalance} />
          <Feed balance={balance} setBalance={handleSetBalance} />
          <Widgets />
        </div>
      ) : (
      <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
      <div>----------------------------------------</div>
      <div>Please connect to the Sepolia Testnet</div>
      <div>and reload the page</div>
      <div>----------------------------------------</div>
      </div>
    )}
    </div>

  );
}

export default App;
