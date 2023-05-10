import React, { useState, useEffect } from "react";
import TweetBox from "./TweetBox.js";
import Post from "./Post.js";
import ReplyPost from "./ReplyPost.js";
import "./Feed.css";
import FlipMove from "react-flip-move";
import axios from 'axios';
import { TwitterContractAddress } from './config.js';
import {ethers} from 'ethers';
import Twitter from './utils/TwitterContract.json'


function Feed(props) {
  const [posts, setPosts] = useState([]);
  const [follows, setFollows] = useState([]);

  const getUpdatedTweets = (allTweets, address) => {
    let updatedTweets = [];
    // Here we set a personal flag around the tweets
    
    for(let i=0; i<allTweets.length; i++) {
      
      if(allTweets[i].username.toLowerCase() == address.toLowerCase()) {
        let tweet = {
          'id': allTweets[i].id,
          'tweetText': allTweets[i].tweetText,
          'isDeleted': allTweets[i].isDeleted,
          'username': allTweets[i].username,
          'isReply': allTweets[i].isReply,
          'replyId':allTweets[i].replyId,
          'personal': true,
          'likes': allTweets[i].likes,
          'usersLiked':allTweets[i].usersLiked
        };
        updatedTweets.push(tweet);
      } else {
        let tweet = {
          'id': allTweets[i].id,
          'tweetText': allTweets[i].tweetText,
          'isDeleted': allTweets[i].isDeleted,
          'username': allTweets[i].username,
          'isReply': allTweets[i].isReply,
          'replyId':allTweets[i].replyId,
          'personal': false,
          'likes': allTweets[i].likes,
          'usersLiked':allTweets[i].usersLiked
        };
        updatedTweets.push(tweet);
      }
    }
    console.log(updatedTweets);
    return updatedTweets;
  }

  const getAllTweets = async() => {
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

        let allTweets = await TwitterContract.getAllTweets(); 
        let follows = await TwitterContract.getFollows();
        setFollows(follows);
        setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllTweets();
  }, []);

  const deleteTweet = key => async() => {
    console.log(key);

    // Now we got the key, let's delete our tweet
    try {
      const {ethereum} = window

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TwitterContract = new ethers.Contract(
          TwitterContractAddress,
          Twitter.abi,
          signer
        );

        let deleteTweetTx = await TwitterContract.deleteTweet(key, true);
        let allTweets = await TwitterContract.getAllTweets();
        setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
      } else {
        console.log("Ethereum object doesn't exist");
      }

    } catch(error) {
      console.log(error);
    }
  };

  const likeTweet = key => async() => {
    try {
      const {ethereum} = window

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TwitterContract = new ethers.Contract(
          TwitterContractAddress,
          Twitter.abi,
          signer
        );

        let likeTweetTx = await TwitterContract.likeTweet(key);

        let allTweets = await TwitterContract.getAllTweets();
        setPosts(getUpdatedTweets(allTweets, ethereum.selectedAddress));
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch(error) {
      console.log(error);
    }
  };

  const followUser = addr => async() => {
    try {
      const {ethereum} = window

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TwitterContract = new ethers.Contract(
          TwitterContractAddress,
          Twitter.abi,
          signer
        );

        await TwitterContract.toggleFollow(addr);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch(error) {
      console.log(error);
    }
  };

  const isLikedFunc = usersLiked => {
    try {
      const {ethereum} = window

      let address = ethereum.selectedAddress;

      for(let i=0; i<usersLiked.length; i++) {
        if (usersLiked[i].toLowerCase() == address.toLowerCase()) {
          return true;
        }
      }
      return false;

    } catch(error) {
      console.log(error);
    }
  };

  const isFollowedFunc = addr => {
    for (let i = 0; i < follows.length; i++) {
      if (addr.toLowerCase() == follows[i].username.toLowerCase()) {
        return true;
      }
    }
    return false;
  };

  const findReplyTweet=replyTweetid=>{
    
    for(let i=0; i<posts.length; i++) {
     
      if (posts[i].id.eq(replyTweetid)) {
        
        return posts[i];
      }
    }
    return null;
  }


  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>

      <TweetBox />

      <FlipMove>
      {posts.map((post) => (
          
          post.isReply?(
            
            <ReplyPost
              tweetId={post.id}
              address={post.username}
              text={post.tweetText}
              personal={post.personal}
              likes={post.likes}
              replyTweet={findReplyTweet(post.replyId)}
              onFollowClick={followUser(post.username)}
              onLikeClick={likeTweet(post.id)}
              onDeleteClick={deleteTweet(post.id)}
              isLiked={isLikedFunc(post.usersLiked)}
              isFollowed={isFollowedFunc(post.username)}
            />
          ) : (
          
          <Post
            tweetId={post.id}
            address={post.username}
            text={post.tweetText}
            personal={post.personal}
            likes={post.likes}
            onFollowClick={followUser(post.username)}
            onLikeClick={likeTweet(post.id)}
            onDeleteClick={deleteTweet(post.id)}
            isLiked={isLikedFunc(post.usersLiked)}
            isFollowed={isFollowedFunc(post.username)}
          />)
        
        ))}
      </FlipMove>
    </div>
  );
}

export default Feed;
