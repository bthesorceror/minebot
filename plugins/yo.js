const autobind = require('auto-bind')

class YO {
  constructor (bot) {
    this.bot = bot

    autobind(this)
  }

  chat (message) {
    this.bot.chat(`YO! ${message}`)
  }
}
const yo = (bot) => {
  bot.yo = new YO(bot)
}

module.exports = yo
