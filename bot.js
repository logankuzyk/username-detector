const dotenv = require('dotenv').config()
const Reddit = require('snoowrap')
const Tesseract = require('tesseract.js')

let time = new Date ()
let start = time.getTime()

const reddit = new Reddit ({
    userAgent: process.env.USERAGENT,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
})

async function moderate (submission) {
    comment = await submission.reply("Your post appears to contain a username. Please read the rules of the subreddit, remove the username, and try again. \n *Beep boop* \n [source](https://github.com/logankuzyk/username-detector) [author](https://old.reddit.com/u/C1RRU5)")
    await comment.distinguish()
    await submission.report("Detected username, beep boop.")
    await submission.remove()
}

async function scan (submission) {
    let image = await submission.url
    await Tesseract.recognize(
        image,
        'eng',
    { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        if (text.includes('u/')) {
            moderate(submission);
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
        console.log('NOT AN IMAGE, EXITING')
        return
    }
}

async function update () {
    post = await reddit.getSubreddit(process.env.SUBREDDIT).getNew({limit: 1})[0]
    parse(post)
}

module.exports.run = async event => {
    update()
}
