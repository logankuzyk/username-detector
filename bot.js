const Reddit = require('reddit')
const Tesseract = require('tesseract.js')
const dotenv = require('dotenv').config()

class Bot {
    constructor() {
        this.reddit = new Reddit({
            username: process.env.USERNAME,
            password: process.env.PASSWORD,
            appId: process.env.CLIENT_ID,
            appSecret: process.env.CLIENT_SECRET,
            userAgent: process.env.USERAGENT
        })
        this.ocr = Tesseract
        this.time = new Date()
    }

    listen() {

    }

    process() {

    }

    comment() {

    }
}