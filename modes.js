const autobind = require('auto-bind')

class ModeSelector {
  constructor (bot, settings, initial = 'default') {
    this.bot = bot
    this.currentMode = null
    this.settings = settings
    this.initial = initial

    bot.stocker.on('inventoryChanged', () => {
      console.log('INVENTORY CHANGED')
    })

    autobind(this)

    this.bot.on('error', this.handleError)
    this.bot.on('end', this.handleEnd)
    this.bot.on('chat', this.handleChat)

    this.changeMode(initial)
  }

  changeMode (key, options = {}) {
    const Mode = this.getModeClass(key)

    if (!Mode) {
      return this.bot.chat(`I don't know ${key}`)
    }

    if (this.currentMode) {
      this.currentMode.destroy()
      this.currentMode.removeListener('mode:change', this.handleModeChange)
    }

    this.bot.chat(`I am switching to ${key} mode`)
    this.currentMode = new Mode(this.bot, options)

    this.currentMode.once('mode:change', this.handleModeChange)
  }

  getNextMode () {
    return { key: this.initial, options: {} }
  }

  getModeClass (key) {
    return this.settings[key]
  }

  handleModeChange () {
    const next = this.getNextMode()
    this.changeMode(next.key, next.options)
  }

  handleChat (_username, message) {
    const matcher = /^become ([a-zA-Z]+)$/
    const matches = message.match(matcher)

    if (!matches) {
      return
    }

    this.changeMode(matches[1])
  }

  handleError (error) {
    console.error(error)
    process.exit(1)
  }

  handleEnd () {
    console.info('Connection closed.')
    process.exit(0)
  }
}

const modes = (bot, settings, initial = 'default') => {
  return new ModeSelector(bot, settings, initial)
}

module.exports = modes
