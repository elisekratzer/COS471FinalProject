const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Twitter Contract", function() {
  let Twitter;
  let twitter;
  let owner;

  const NUM_TOTAL_NOT_MY_TWEETS = 5;
  const NUM_TOTAL_MY_TWEETS = 3;

  let totalTweets;
  let totalMyTweets;

  beforeEach(async function() {
    Twitter = await ethers.getContractFactory("TwitterContract");
    [owner, addr1, addr2] = await ethers.getSigners();
    twitter = await Twitter.deploy();

    totalTweets = [];
    totalMyTweets = [];

    for(let i=0; i<NUM_TOTAL_NOT_MY_TWEETS; i++) {
      let tweet = {
        'tweetText': 'Ramdon text with id:- ' + i,
        'username': addr1,
        'isDeleted': false
      };

      await twitter.connect(addr1).addTweet(tweet.tweetText, tweet.isDeleted);
      totalTweets.push(tweet);
    }

    for(let i=0; i<NUM_TOTAL_MY_TWEETS; i++) {
      let tweet = {
        'username': owner,
        'tweetText': 'Ramdon text with id:- ' + (NUM_TOTAL_NOT_MY_TWEETS+i),
        'isDeleted': false
      };

      await twitter.addTweet(tweet.tweetText, tweet.isDeleted);
      totalTweets.push(tweet);
      totalMyTweets.push(tweet);
    }

    // Set initial balances for users
    await twitter.connect(owner).setInitialBalance();
    await twitter.connect(addr1).setInitialBalance();
    await twitter.connect(addr2).setInitialBalance();
  });

  describe("Add Tweet", function() {
    it("should emit AddTweet event", async function() {
      let tweet = {
        'tweetText': 'New Tweet',
        'isDeleted': false
      };

      await expect(await twitter.addTweet(tweet.tweetText, tweet.isDeleted)
    ).to.emit(twitter, 'AddTweet').withArgs(owner.address, NUM_TOTAL_NOT_MY_TWEETS + NUM_TOTAL_MY_TWEETS);
    })

  });

  describe("Like a Tweet", function() {
    it("should emit LikeTweet event", async function() {
      const TWEET_ID = 0;
      const TWEET_LIKES1=1;

      await expect(await twitter.likeTweet(TWEET_ID)).to.emit(twitter, 'LikeTweet').withArgs(TWEET_ID, TWEET_LIKES1);

      
    })

  });

  describe("Reply to Tweet", function() {
    it("should emit ReplyTweet event", async function() {
      const TWEET_ID=0;
      const REPLIES_NUM=1

      let tweet = {
        'tweetText': 'New Tweet Reply',
        'isDeleted': false
      };

      await expect(await twitter.connect(addr2).replyTweet(tweet.tweetText, TWEET_ID)
    ).to.emit(twitter, 'ReplyTweet').withArgs(addr2.address, REPLIES_NUM);
    })

  });



  describe("Get All Tweets", function() {
    it("should return the correct number of total tweets", async function() {
      const tweetsFromChain = await twitter.getAllTweets();
      expect(tweetsFromChain.length).to.equal(NUM_TOTAL_NOT_MY_TWEETS+NUM_TOTAL_MY_TWEETS);
    })

    it("should return the correct number of all my tweets", async function() {
      const myTweetsFromChain = await twitter.getMyTweets();
      expect(myTweetsFromChain.length).to.equal(NUM_TOTAL_MY_TWEETS);
    })
  });


  describe("Delete Tweet", function() {
    it("should emit delete tweet event", async function() {
      const TWEET_ID = 0;
      const TWEET_DELETED = true;

      await expect(
        twitter.connect(addr1).deleteTweet(TWEET_ID, TWEET_DELETED)
      ).to.emit(
        twitter, 'DeleteTweet'
      ).withArgs(
        TWEET_ID, TWEET_DELETED
      );
    })
  });

  describe("Payment Tweet", function() {
    it("should emit payment tweet event", async function() {
      const amount = 100;
      await expect(
        twitter.connect(owner).paymentTweet(addr1.address, amount)
      ).to.emit(
        twitter, 'PaymentTweet'
      ).withArgs(
        owner.address, addr1.address, amount
      );

      const balance1 = await twitter.connect(owner).getBalance();
      expect(balance1).to.equal(0);

      const balance2 = await twitter.connect(addr1).getBalance();
      expect(balance2).to.equal(200);

      // Check if owner balance does not change
      let accountExists = await twitter.connect(owner).getAccountExists();
      if (!accountExists) {
        await twitter.connect(owner).setInitialBalance();
      }
      const balance3 = await twitter.connect(owner).getBalance();
      expect(balance3).to.equal(0);
    })
  });

  describe("Set Display Name", function() {
    it("should change user display name in mapping", async function() {
      const displayName = "Gabe";
      await twitter.connect(owner).setDisplayName(displayName);
      const name = await twitter.getDisplayName();
      expect(name).to.equal("Gabe");
    })
  });


});