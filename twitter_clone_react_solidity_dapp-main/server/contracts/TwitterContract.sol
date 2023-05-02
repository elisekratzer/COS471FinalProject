// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.4;
/**
 * @title Twitter Contract
 * @dev Store & retrieve value in a variable
 */
contract TwitterContract {

    event AddTweet(address recipient, uint tweetId);
    event DeleteTweet(uint tweetId, bool isDeleted);

    event AddUser(address username)

    struct Tweet {
        uint id;
        address username;
        string tweetText;
        bool isDeleted;
        bool isRetweet;
        uint replyId;
        uint likes; //Have to update for every like 
        uint retweets; //Have to update for every retweet

    }

    //Initialize users
    struct User{
        address username;
        // address[] followers;
        address[] following;
        uint balance;
    }

    Tweet[] private tweets;
    User[] private users;

    // Mapping of Tweet id to the wallet address of the user
    mapping(uint256 => address) tweetToOwner;

    // Method to be called by our frontend when trying to add a new User
    function addUser(address username) external{
        users.push(User(username, [],[],1000));
        //TODOOO - change balances
        emit AddUser(username, 1000)
        
    }


    // ELISE

    // Method to be called by our frontend when trying to add a new user to following list 
    function follow(){

    }
    // Method to be called by our frontend when trying to delete a user to following list 
    function unfollow(){

    }



    //DIANA AND KEVIN

    // Method to be called by our frontend when trying to add a new retweet
    function retweet(){

    }

    // Method to be called by our frontend when trying to add a new like to a tweet
    function like(){

    }


    //GABE

    // Method to be called by our frontend when trying to transfer a payment to another user
    function transferPayment(){

    }


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

}
