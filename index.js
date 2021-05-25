require('dotenv').config()
const {
    TwitterClient
} = require('twitter-api-client')
const axios = require('axios')

const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

axios.get('https://statsapi.web.nhl.com/api/v1/draft/prospects')
    .then(response => {
        const data = response.data.prospects ? response.data : {}
        let tweet
        if (data && data.prospects.length) {
            //tweet the first event in the array
            tweet = '🏒  Hockey Prospect Highlight  🏒  ' + data.prospects[0].fullName + ' - ' + data.prospects[0].birthCountry + ' - ' + data.prospects[0].height + ' - ' + data.prospects[0].weight + ' - ' + data.prospects[0].primaryPosition.name + '  🥅  #nhl #hockey #nhlprospects'
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