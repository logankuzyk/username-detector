//TODO make proper AWS termination
//Add module exports
//Figure out a better way of detecting usernames
//Figure out a way to not scan the same posts over and over
//Figure out a way to make missing posts impossible

const dotenv = require('dotenv').config()
const Reddit = require('snoowrap')
const {createWorker} = require('tesseract.js')

let time = new Date ()
let start = time.getTime()

const reddit = new Reddit ({
    userAgent: process.env.USERAGENT,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
})

const worker = createWorker({
    logger: m => console.log(m)
})

async function moderate (submission) {
    comment = await submission.reply("Your post appears to contain a username. Please read the rules of the subreddit, remove the username, and try again. \n *Beep boop* \n [source](https://github.com/logankuzyk/username-detector) [author](https://old.reddit.com/u/C1RRU5)")
    await comment.distinguish()
    await submission.report("Detected username, beep boop.")
    await submission.remove()
}

async function scan (submission) {
    let image = await submission.url
    await worker.load()
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    let { data: { text } } = await worker.recognize(image)
    if (text.includes('u/')) {
        await moderate(submission)
        console.log("USERNAME FOUND")
        process.exit()
    } else {
        console.log("NO USERNAME")
        process.exit()
    }
}

async function parse (submission) {
    if (submission.url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
        scan(submission)
    } else {
        console.log('NOT AN IMAGE, EXITING')
    }
}

async function run () {
    post = await reddit.getSubreddit(process.env.SUBREDDIT).getNew({limit: 1})[0]
    parse(post)
    
}
