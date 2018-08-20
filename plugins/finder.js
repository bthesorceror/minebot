const _ = require('lodash')

const finder = (bot) => {
  const obj = {
    findUserByUsername (username) {
      return _.find(bot.entities, (entity) => entity.username && entity.username === username)
    }
  }

  bot.finder = obj
}

module.exports = finder
