require('dotenv').config()
const {
    TwitterClient
} = require('twitter-api-client')
const axios = require('axios')
// const cron = require('node-cron')

const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

// setInterval(tweetScheduler, 100000)

setTimeout( function(){ 
    var hour = new Date().getHours();
    if (hour === 10 || hour === 11 || hour === 3) {
        tweetScheduler
    }
}, 100000);

function tweetScheduler() {
    axios.get('https://statsapi.web.nhl.com/api/v1/draft/prospects')
        .then(response => {
            const data = response.data.prospects ? response.data : {}
            let tweet
            let count = 0 

            /* function counter() {
                return ++count
            } */

            const random = Math.floor(Math.random() * 100);

            // console.log(random);

            if (data && data.prospects.length) {
                // console.log(data, 'data')
                tweet = '🏒  Hockey Prospect Highlight  🏒  ' + data.prospects[0].fullName + ' - ' + data.prospects[0].birthCountry + ' - ' + data.prospects[0].height + ' - ' + data.prospects[0].weight + ' - ' + data.prospects[0].primaryPosition.name + random +  '  🥅  #nhl #hockey #nhlprospects'
                //tweet the first event in the array
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