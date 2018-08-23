const level = require('level')

const database = (bot) => {
  const db = level('db', { valueEncoding: 'json' })
  bot.db = db
}

module.exports = database
