const dotenv = require('dotenv').config()
const Reddit = require('snoowrap')
const Tesseract = require('tesseract.js')

// let post = {}
let time = new Date ()
let start = time.getTime()

const reddit = new Reddit ({
    userAgent: process.env.USERAGENT,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
})

// async function moderate (submission) {
//     this.reddit.post('/api/comment', {
//         api_type: 'json',
//         text: 'Your image seems to contain a reddit username. Please read the rules of the subreddit, censor your image, and try again.'
        
//     })
// }

async function scan (submission) {
    let image = await submission.url
    await Tesseract.recognize(
        image,
        'eng',
    { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        if (text.includes('u/')) {
            // moderate(submission);
            console.log("USERNAME FOUND")
        } else {
            console.log("NO USERNAME")
        }
    })
}

async function parse (submission) {
    if (submission.url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
        scan(submission)
    } else {
        console.log('not an image')
        return
    }
}

async function update () {
    post = await reddit.getSubreddit('dankmemes').getNew({limit: 1})[0]
    parse(post)
}

update()

console.log(time.getTime() - start)
