const CronJob = require('cron').CronJob
const bot = require('./bot')

job = new CronJob('* * * * *', bot.run)

job.start()