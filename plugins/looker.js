const { EventEmitter } = require('events')

class Looker extends EventEmitter {
  constructor (bot) {
    super()
    this.bot = bot
  }

  async lookAt (position, force = false) {
    return new Promise((resolve) => {
      this.bot.lookAt(position, force, resolve)
    })
  }
}

const looker = (bot) => {
  bot.looker = new Looker(bot)
}

module.exports = looker
