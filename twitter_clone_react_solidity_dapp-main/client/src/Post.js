import React, { forwardRef, useState , useEffect } from "react";
import "./Post.css";
import Avatar from 'avataaars';
import { generateRandomAvatarOptions } from './avatar';
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { red } from '@mui/material/colors';
import DeleteIcon from '@material-ui/icons/Delete';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from '@mui/material';
import { TwitterContractAddress } from './config.js';
import {ethers} from 'ethers';
import Twitter from './utils/TwitterContract.json'
import { Button } from "@material-ui/core";

const Post = forwardRef(
  ({  tweetId, address, text, personal, likes, onFollowClick, onLikeClick, 
    onDeleteClick, isLiked, isFollowed, setBalance }, ref) => {
    
    const [replyMessage,setReplyMessage]=useState("");
    const [isClicked, setIsClicked] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [avatarOptions, setAvatarOptions] = useState("");
    const [replyId, setReplyId]=useState(0);
    
    const addReply = async() => {

      let tweet = {
        'replyText': replyMessage,
        'isDeleted': false
      };
      console.log("addingg reply");
      
      try {
        const {ethereum} = window;
  
        if(ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const TwitterContract = new ethers.Contract(
            TwitterContractAddress,
            Twitter.abi,
            signer
          )
          console.log( tweet.replyText);
          console.log(tweetId);
          await TwitterContract.replyTweet( tweet.replyText, tweetId);
            
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch(error) {
        console.log("Error submitting new Tweet", error);
      }
  }

  const sendReply = (e) => {
      e.preventDefault();
      console.log("sending reply");

      addReply();
      
      setReplyMessage("");
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

    // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    
    console.log(tweetId);
    setReplyId(tweetId);
    let avatar = generateRandomAvatarOptions();
    setAvatarOptions(avatar);
  }, []);


    return (
      <div className="post" ref={ref}>
        <div className="post__avatar">
          <Avatar
            style={{ width: '100px', height: '100px' }}
            avatarStyle='Circle'
            {...avatarOptions }
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
              !isFollowed ? (
                <Tooltip title="Follow User"><AddIcon fontSize="small" onClick={onFollowClick} /></Tooltip>)
                : (
                  <Tooltip title="Unfollow User"><CloseIcon fontSize="small" onClick={onFollowClick} /></Tooltip>
                )
            ) : ("")}


            {/* <Tooltip title="Comment"><ChatBubbleOutlineIcon fontSize="small" onClick={()=>{
              setShowReplyBox(true)
            }} /></Tooltip> */}
                 
              <div >
                {!isLiked ? (
                <Tooltip title="Like"><FavoriteBorderIcon fontSize="small" onClick={onLikeClick} /></Tooltip>
                ) :
                (<Tooltip title="Remove Like"><FavoriteIcon fontSize="small" sx={{ color: red[700] }} onClick={onLikeClick} /></Tooltip>)}
                <span>{likes.toString()}</span>
              </div>      
           
            
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
                  onChange={(e) => setReplyMessage(e.target.value)}
                  value={replyMessage}
                  placeholder="Reply To Tweet (max 350 chars)"
                  maxLength="350"
                  rows="3" // specify the number of rows
                />
              </div>

              <Button
                onClick={sendReply}
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