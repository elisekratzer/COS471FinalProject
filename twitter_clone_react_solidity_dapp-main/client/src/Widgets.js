import React, { useState, useEffect } from "react";
import "./Widgets.css";
import SearchIcon from "@material-ui/icons/Search";
import { TwitterContractAddress } from './config.js';
import {ethers} from 'ethers';
import Twitter from './utils/TwitterContract.json';
import User from './User.js';
import FlipMove from "react-flip-move";


function Widgets() {
  const [follows, setFollows] = useState([]);

  const getFollows = async() => {
    try {
      const {ethereum} = window

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TwitterContract = new ethers.Contract(
          TwitterContractAddress,
          Twitter.abi,
          signer
        )

        let followsRaw = await TwitterContract.getFollows();
        let follows = [];
        for(let i=0; i<followsRaw.length; i++) {
          let follow = {
            'address': followsRaw[i].username,
            'displayName': followsRaw[i].displayName
          };
  
          follows.push(follow);
        }

        setFollows(follows);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch(error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFollows();
  }, []);




  return (
    <div className="widgets">
      {/* <div className="widgets__input">
        <SearchIcon className="widgets__searchIcon" />
        <input placeholder="Search Twitter" type="text" />
      </div> */}
      <div className="widgets__input">
        <h2>Following</h2>
      </div>
      
      <div className="widgets__widgetContainer">
        

        <FlipMove>
          {follows.map((follow) => (
            <User
              address={follow.address}
              displayName={follow.displayName}
            />
          ))}
        </FlipMove>
      </div>
    </div>
  );
}

export default Widgets;
