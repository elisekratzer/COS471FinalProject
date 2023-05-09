// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.4;
/**
 * @title Twitter Contract
 * @dev Store & retrieve value in a variable
 */
contract TwitterContract {

    event AddTweet(address recipient, uint tweetId);
    event DeleteTweet(uint tweetId, bool isDeleted);
    event PaymentTweet(address sender, address recipient, uint amount);
    event LikeTweet(uint tweetId, uint likesNum);
    event ReplyTweet(address recipient, uint tweetId);

    struct Tweet {
        uint id;
        address username;
        string tweetText;
        bool isDeleted;
    }

    Tweet[] private tweets;

    // Mapping of Tweet id to the wallet address of the user
    mapping(uint256 => address) tweetToOwner;

    // Mapping of wallet address to user balance
    mapping(address => uint) userBalances;

    // Mapping of wallet address to account creation
    mapping(address => bool) accountExists;

    // Method to be called by our frontend when trying to add a new Tweet
    function addTweet(string memory tweetText, bool isDeleted) external {
        uint tweetId = tweets.length;
        tweets.push(Tweet(tweetId, msg.sender, tweetText, isDeleted));
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

    // Method to be called by our frontend when trying to add a new like to a tweet
    function likeTweet(uint tweetId) external {
        if(!tweets[tweetId].usersLiked[msg.sender]){

            tweets[tweetId].usersLiked[msg.sender] = true
            tweets[tweetId].likes+=1;
            emit LikeTweet(tweetId, tweets[tweetId].likes);

        }
        else{

            tweets[tweetId].usersLiked[msg.sender]=false
            tweets[tweetId].likes-=1;
            emit LikeTweet(tweetId, tweets[tweetId].likes);
        }

    }

}