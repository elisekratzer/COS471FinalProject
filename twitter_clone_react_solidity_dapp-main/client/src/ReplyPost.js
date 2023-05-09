import React, { forwardRef, useState } from "react";
import "./Post.css";
import Avatar from 'avataaars';
import { generateRandomAvatarOptions } from './avatar';
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import PublishIcon from "@material-ui/icons/Publish";
import DeleteIcon from '@material-ui/icons/Delete';
// LOOK FOR LIKE AND UNLIKE ICONS

const ReplyPost = forwardRef(
    ({ address, key, text, personal, likes, onLikeClick, onDeleteClick }, ref) => {
    const [buttonPopup, setButtonPopup]=useState(false);
    const [username, setUsername]=useState("");
    const [tweetId,setTweetId]=useState(0);

    const [replyTweet, setreplyTweet]=useState(0);

/*     const getTweet = tweetId => async()=>{
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
      
              let replyTweet = await TwitterContract.getTweet();
              setreplyTweet(replyTweet);
            } else {
              console.log("Ethereum object doesn't exist");
            }
          } catch(error) {
            console.log(error);
          }
    }
 */
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
            <div className="post__replyDiv">

                {replyTweet.username}
                
                {replyTweet.tweetText}
                
            </div>
          </div>
          <div className="post__footer">
            <ChatBubbleOutlineIcon fontSize="small" onClick={()=>{
              setUsername(address);
              setTweetId(key);
            }}/>
            <RepeatIcon fontSize="small" />
            
            <FavoriteBorderIcon fontSize="small" onClick={onLikeClick} /> 

            {/* {isLiked ? (color="red"):(color="black")} */}

            <p>{likes.toString()}</p>
            <PublishIcon fontSize="small" />
            {personal ? (
              <DeleteIcon fontSize="small" onClick={onDeleteClick}/>
            ) : ("")}

            {/* <Popup trigger={buttonPopup} setTrigger={setButtonPopup} username={username} tweetId={tweetId} >
                
            </Popup> */}
          </div>
        </div>
      </div>
    );
  }
);

export default ReplyPost;
