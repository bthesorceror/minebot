const level = require('level')

const database = (bot) => {
  const db = level('db')
  bot.db = db
}

module.exports = database
