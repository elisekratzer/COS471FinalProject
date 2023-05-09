import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import TwitterIcon from "@material-ui/icons/Twitter";
import SidebarOption from "./SidebarOption";
import Person4Icon from '@mui/icons-material/Person4';
import AbcIcon from '@mui/icons-material/Abc';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Groups2Icon from '@mui/icons-material/Groups2';
import FeedIcon from '@mui/icons-material/Feed';
import { TwitterContractAddress } from './config.js';
import { ethers } from 'ethers';
import Twitter from './utils/TwitterContract.json'

function Sidebar(props) {
  const [displayName, setDisplayName] = useState("");
  const [address, setAddress] = useState("");
  const [numTweets, setNumTweets] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [showDisplayNameInput, setShowDisplayNameInput] = useState(false);
  const [numFollows, setNumFollowers] = useState("");


  const getProfileDetails = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TwitterContract = new ethers.Contract(
          TwitterContractAddress,
          Twitter.abi,
          signer
        );
        
        const userDisplayName = await TwitterContract.getDisplayName();
        if (userDisplayName == "") {
          setShowDisplayNameInput(true);
        }
        else {
          setDisplayName(userDisplayName);
        }

        const userAddress = await signer.getAddress();
        const userBalance = await TwitterContract.getBalance();
        const arrayTweets = await TwitterContract.getMyTweets();
        console.log(arrayTweets);
        const numTweets = arrayTweets.length;
        setNumTweets(numTweets.toString());

        const arrayFollows = await TwitterContract.getFollows();
        const numFollows = arrayFollows.length;
        setNumFollowers(numFollows.toString());

        const firstFive = userAddress.toString().slice(0, 5);
        const lastFour = userAddress.toString().slice(-4);
        setAddress(firstFive + "..." + lastFour);
        props.setBalance(userBalance.toString());
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfileDetails();
  }, []);

  const handleNewDisplayNameKeyDown = async (event) => {
    if (event.key === 'Enter') {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const TwitterContract = new ethers.Contract(
            TwitterContractAddress,
            Twitter.abi,
            signer
          );

          await TwitterContract.setDisplayName(newDisplayName);
          setDisplayName(newDisplayName);
          setNewDisplayName("");
          setShowDisplayNameInput(false);
        } else {
          console.log("Ethereum object doesn't exist");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className="sidebar">
      <TwitterIcon className="sidebar__twitterIcon" />

      <SidebarOption Icon={Person4Icon} text={"Address: " + address} />
      <div style={{ display: "flex", alignItems: "center" }}>
        <SidebarOption Icon={AbcIcon} text={"Display Name: " + displayName} />
        { showDisplayNameInput &&
          <input
            type="text"
            placeholder="Create name:"
            onChange={(e) => setNewDisplayName(e.target.value)}
            onKeyDown={handleNewDisplayNameKeyDown}
          />
        }
      </div>

      {/* <SidebarOption Icon={AbcIcon} text={"Display Name: " + displayName} /> <input type="text" value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} onKeyDown={handleNewDisplayNameKeyDown} /> */}
      <SidebarOption Icon={AttachMoneyIcon} text={"Balance: " + props.balance} />
      <SidebarOption Icon={Groups2Icon} text={"# Followers: " + numFollows} />
      <SidebarOption Icon={FeedIcon} text={"# Tweets: " + numTweets}/>
    </div>
  );
}

export default Sidebar;
