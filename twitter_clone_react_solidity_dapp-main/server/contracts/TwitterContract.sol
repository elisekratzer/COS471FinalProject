// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.4;
/**
 * @title Twitter Contract
 * @dev Store & retrieve value in a variable
 */
contract TwitterContract {

    event AddTweet(address creator, uint tweetId);
    event DeleteTweet(uint tweetId, bool isDeleted);
    event PaymentTweet(address sender, address recipient, uint amount);
    event LikeTweet(uint tweetId, uint likesNum);
    event ReplyTweet(address recipient, uint replyTweetId);

    struct Tweet {
        uint id;
        address username;
        string tweetText;
        bool isDeleted;
        bool isReply;
        uint replyId;//-1 for original tweets or positive numbers for replies
        uint likes;
        uint replies;//Have to update for every retweet
        address[] usersLiked; //Array of addresses that have liked the tweet 
    }

    Tweet[] private tweets;

    struct User {
        address username;
        string displayName;
    }

    // Mapping of Tweet id to the wallet address of the user
    mapping(uint256 => address) tweetToOwner;

    // Mapping of wallet address to user balance
    mapping(address => uint) userBalances;

    // Mapping of user to their followers
    mapping(address => address[]) usersFollowing;
    
    // Mapping of wallet address to account creation
    mapping(address => bool) accountExists;

    // Mapping of wallet address to user display name
    mapping(address => string) userDisplayNames;

    // Method to be called by our frontend when trying to add a new Tweet
    function addTweet(string memory tweetText, bool isDeleted) external {
        
        uint tweetId = tweets.length;
        address[] memory userLiked=new address[](0);
        tweets.push(Tweet(tweetId, msg.sender, tweetText, isDeleted, false, 0, 0, 0, userLiked));//MAY NEED TO CREATE MAPPING
        
        tweetToOwner[tweetId] = msg.sender;
        emit AddTweet(msg.sender, tweetId);

    }

    // Method to get all the Tweets
    function getAllTweets() external view returns (Tweet[] memory) {
        Tweet[] memory temporary = new Tweet[](tweets.length);
        uint counter = 0;
        for(uint i=0; i<tweets.length; i++) {
            if(tweets[i].isDeleted == false) {
                temporary[counter] = tweets[i];
                counter++;
            }
        }

        Tweet[] memory result = new Tweet[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    // Method to get only your Tweets
    function getMyTweets() external view returns (Tweet[] memory) {
        Tweet[] memory temporary = new Tweet[](tweets.length);
        uint counter = 0;
        for(uint i=0; i<tweets.length; i++) {
            if(tweetToOwner[i] == msg.sender && tweets[i].isDeleted == false) {
                temporary[counter] = tweets[i];
                counter++;
            }
        }

        Tweet[] memory result = new Tweet[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }

        return result;
    }

    // Method to Delete a Tweet
    function deleteTweet(uint tweetId, bool isDeleted) external {
        if(tweetToOwner[tweetId] == msg.sender) {
            tweets[tweetId].isDeleted = isDeleted;
            emit DeleteTweet(tweetId, isDeleted);
        }
    }


    // Method to be called by our frontend when trying to add a new like to a tweet
    function likeTweet(uint tweetId) external{
        
        bool isLiked=false;
        uint length=tweets[tweetId].usersLiked.length;

        for(uint i=0; i<length; i++) {
            if (tweets[tweetId].usersLiked[i]== msg.sender){
                isLiked=true;
                tweets[tweetId].usersLiked[i] = tweets[tweetId].usersLiked[length-1];
                
                tweets[tweetId].usersLiked.pop();
                tweets[tweetId].likes=tweets[tweetId].likes-1;
                emit LikeTweet(tweetId, tweets[tweetId].likes);
                return;
            }
        }
        if(!isLiked){
            tweets[tweetId].usersLiked.push(msg.sender);
            tweets[tweetId].likes=tweets[tweetId].likes+1;
            emit LikeTweet(tweetId, tweets[tweetId].likes);
        }
        
        // if(!tweets[tweetId].usersLiked[msg.sender]){

        //     tweets[tweetId].usersLiked[msg.sender] = true;
        //     tweets[tweetId].likes+=1;
        //     emit LikeTweet(tweetId, tweets[tweetId].likes);
            
        // }
        // else{
            
        //     tweets[tweetId].usersLiked[msg.sender]=false;
        //     tweets[tweetId].likes-=1;
        //     emit LikeTweet(tweetId, tweets[tweetId].likes);

        // }

    }

    // Method to be called by our frontend when trying to reply to a tweet
    function replyTweet(string memory tweetText, uint tweetId)external{
        
        uint newTweetId = tweets.length;
        address[] memory userLiked=new address[](0);
        tweets.push(Tweet(newTweetId, msg.sender, tweetText, false, true, tweetId, 0, 0,userLiked));//MAY NEED TO CREATE MAPPING
        tweetToOwner[newTweetId] = msg.sender;
        tweets[tweetId].replies=tweets[tweetId].replies+1;

        emit ReplyTweet(msg.sender, tweets[tweetId].replies);
    }

    // Method to send payment
    function paymentTweet(address recipient, uint amount) external {
        require(amount <= userBalances[msg.sender], "Insufficient balance");
        userBalances[msg.sender] -= amount;
        userBalances[recipient] += amount;
        emit PaymentTweet(msg.sender, recipient, amount);
    }

    // Method to get user balance
    function getBalance() external view returns (uint) {
        return userBalances[msg.sender];
    }

    // Method to check if account exists (user logged in previously)
    function getAccountExists() external view returns (bool) {
        return accountExists[msg.sender];
    }

    // Method to create initial balance
    function setInitialBalance() external {
        accountExists[msg.sender] = true;
        userBalances[msg.sender] = 100;
    }

    // Method to set user display name
    function setDisplayName(string memory displayName) external {
        userDisplayNames[msg.sender] = displayName;
    }

    // Method to get user display name
    function getDisplayName() external view returns (string memory) {
        return userDisplayNames[msg.sender];
    }

    // Method to add follow
    function addFollow(address userToFollow) external {
        bool isAlreadyFollowing = false;
        address[] storage followingList = usersFollowing[msg.sender];

        for (uint i = 0; i < followingList.length; i++) {
            if (followingList[i] == userToFollow) {
                isAlreadyFollowing = true;
                break;
            }
        }

        if (!isAlreadyFollowing) {
            followingList.push(userToFollow);
        }
    }

    // Method to get follows
    function getFollows() external view returns (User[] memory) {
        address[] memory addresses = usersFollowing[msg.sender];
        uint length = addresses.length;
        User[] memory result = new User[](length);

        for(uint i=0; i<length; i++) {
            User memory user = User(addresses[i], userDisplayNames[addresses[i]]);
            result[i] = user;
        }

        return result;
    }
}
