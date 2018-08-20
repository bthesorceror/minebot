const autobind = require('auto-bind')

class Default {
  constructor (bot) {
    this.bot = bot
    autobind(this)
    this.addListeners()
  }

  handlePlayerJoin (player) {
    this.bot.sayYO(player.username)
  }

  handleChat (username, message) {
    const player = this.bot.finder.findUserByUsername(username)

    if (player && message === 'find me') {
      this.bot.navigate.stop()
      this.bot.chat(`Imma coming for you ${username}`)
      this.bot.navigate.to(player.position)
    }
  }

  handleSpawn () {
    this.bot.chat('YO! I am alive')
  }

  destroy () {
    this.removeListeners()
  }

  removeListeners () {
    this.bot.removeListener('chat', this.handleChat)
    this.bot.removeListener('spawn', this.handleSpawn)
    this.bot.removeListener('playerJoined', this.handlePlayerJoin)
  }

  addListeners () {
    this.bot.on('chat', this.handleChat)
    this.bot.on('playerJoined', this.handlePlayerJoin)
    this.bot.on('spawn', this.handleSpawn)
  }
}

module.exports = Default
