import React, { forwardRef, useState } from "react";
import "./Post.css";
import Avatar from 'avataaars';
import { generateRandomAvatarOptions } from './avatar';
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import DeleteIcon from '@material-ui/icons/Delete';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AddIcon from '@mui/icons-material/Add';
import { Tooltip } from '@mui/material';
import { TwitterContractAddress } from './config.js';
import {ethers} from 'ethers';
import Twitter from './utils/TwitterContract.json'
import { Button } from "@material-ui/core";

const Post = forwardRef(
  ({ setBalance, key, address, text, personal, likes, onFollowClick, onLikeClick, onDeleteClick }, ref) => {
    const [tweetMessage,setTweetMessage]=useState("");
    const [isClicked, setIsClicked] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const addReply = async (tweetId) => {
      let tweet = {
        'tweetText': tweetMessage,
        'isDeleted': false

      };
  
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
  
          let twitterTx = await TwitterContract.replyTweet( tweet.tweetText, tweetId);
  
          console.log(twitterTx);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch(error) {
        console.log("Error submitting new Tweet", error);
      }
  }

  const sendTweet = (tweetId) => {
      // e.preventDefault();

      addReply(tweetId);
      
      setTweetMessage("");
  };

    const sendCoin = async (setBalance) => {  
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
    
          // Send a coin to the tweet creator
          await TwitterContract.paymentTweet(address, 1);

          // retrieve the updated balance from the contract
          const userBalance = await TwitterContract.getBalance();

          // update the userBalance state variable in Sidebar.js
          setBalance(userBalance.toString());
  
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch(error) {
        console.log("Error submitting new Tweet", error);
      }
    };

    const handleClick = () => {
      setIsClicked(true);
      sendCoin(setBalance);
      setTimeout(() => {
        setIsClicked(false);
      }, 300);
    };

    return (
      <div className="post" ref={ref}>
        <div className="post__avatar">
          <Avatar
            style={{ width: '100px', height: '100px' }}
            avatarStyle='Circle'
            {...generateRandomAvatarOptions() }
          />
        </div>
        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <h3>
                {address}{" "}
              </h3>
            </div>
            <div className="post__headerDescription">
              <p>{text}</p>
            </div>
          </div>
          <div className="post__footer">
            {!personal ? (
              <Tooltip title="Follow User"><AddIcon fontSize="small" onClick={onFollowClick} /></Tooltip>
            ) : ("")}
            <Tooltip title="Comment"><ChatBubbleOutlineIcon fontSize="small" onClick={()=>{
              setShowReplyBox(true)
            }} /></Tooltip>
            <Tooltip title="Like">     
              <div >
                <FavoriteBorderIcon fontSize="small" onClick={onLikeClick} />
                <span>{likes.toString()}</span>
              </div>      
           
            </Tooltip>
            
            {!personal ? (
              <Tooltip title="Send Coin">
              <MonetizationOnIcon 
                fontSize={isClicked ? 'large' : 'small'}
                className={`monetization-icon ${isClicked ? 'clicked' : ''}`}
                onClick={handleClick} />
              </Tooltip>

            ) : ("")}
            {personal ? (
              <Tooltip title="Delete"><DeleteIcon fontSize="small" onClick={onDeleteClick} /></Tooltip>
            ) : ("")}
            

        
          </div>

          <div className="reply_textarea">
          <div className="replyBox">
            <form>
              <div className="replyBox__input">
                
                <textarea
                  onChange={(e) => setTweetMessage(e.target.value)}
                  value={tweetMessage}
                  placeholder="What's happening?"
                  maxLength="350"
                  rows="3" // specify the number of rows
                />
              </div>
              {/* <input
                value={tweetImage}
                onChange={(e) => setTweetImage(e.target.value)}
                className="replyBox__imageInput"
                placeholder="Optional: Enter image URL"
                type="text"
              /> */}

              <Button
                onClick={sendTweet}
                type="submit"
                className="replyBox__tweetButton"
              >
                Tweet
              </Button>
            </form>
          </div>

                </div>
          </div>
        </div>
    );
  }
);

export default Post;