require('dotenv').config()
const {
    TwitterClient
} = require('twitter-api-client')
// const config = require('./config')
const axios = require('axios')
const cron = require('node-cron')
// import * as cron from 'node-cron'

const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

/*  asterisks time divisions; they specify “every minute,” “every hour,” “every day of the month,” “every month,” and “every day of the week,” respectively. */

/* 
  for testing: thirtieth second of the twentieth minute of each hour
  currently runs every day at 2:03 a.m. // 3 2 * * * 
 ** every friday at 4 p.m. use: 0 16 * * friday
 */
const tweet = cron.schedule('30 20 * * * *', () => {
    tweetScheduler()
});
tweet.start()

// setInterval(tweetScheduler, 100000)

/* setInterval( function(){ 
    var hour = new Date().getHours();
    if (hour === 10 || hour === 11 || hour === 3) {
        tweetScheduler
    }
}, 1000000); */

function tweetScheduler() {
    axios.get('https://statsapi.web.nhl.com/api/v1/draft/prospects')
        .then(response => {
            const data = response.data.prospects ? response.data : {}
            let tweet
            const random = Math.floor(Math.random() * 100);

            if (data && data.prospects.length) {
                for (let i = 0; i < data.prospects.length; i++) {
                    tweet = '🏒  Hockey Prospect Highlight  🏒  ' + data.prospects[i].fullName + ' - ' + data.prospects[i].birthCountry + ' - ' + data.prospects[i].height + ' - ' + data.prospects[i].weight + ' - ' + data.prospects[i].primaryPosition.name + '  🥅  #nhl #hockey #nhlprospects' + random
                }
                // console.log(data, 'data')
            } else {
                tweet = 'No prospect today'
            }

            // send tweet
            twitterClient.tweets.statusesUpdate({
                status: tweet
            }).then(response => {
                console.log('Tweeted', response)
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.error(err)
        })
}