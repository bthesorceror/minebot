const _ = require('lodash')
const { EventEmitter } = require('events')

class Finder extends EventEmitter {
  constructor (bot) {
    super()

    this.bot = bot
  }

  findUserByUsername (username) {
    return _.find(this.bot.entities, (entity) => (
      entity.username && entity.username === username
    ))
  }

  findNearbyDirtBlock () {
    return this.bot.findBlock({
      point: this.bot.entity.position,
      matching: (b) => b.type in [2, 3],
      maxDistance: 1
    })
  }
}

const finder = (bot) => {
  bot.finder = new Finder(bot)
}

module.exports = finder
