const {EventEmitter} = require('events')
const autobind = require('auto-bind')

class Logger extends EventEmitter {
  constructor (bot) {
    super()

    this.bot = bot
    this.timeout = null
    this.running = true

    this.distance = 4

    autobind(this)

    this.log()
  }

  post (message) {
    this.bot.chat(message)
  }

  again () {
    if (!this.running) {
      return
    }
    this.timeout = setTimeout(this.log, 10)
  }

  log () {
    this.timeout = null
    const block = this.bot.findBlock({
      point: this.bot.entity.position,
      matching: (block) => (
        block.material === 'wood'
      ),
      maxDistance: this.distance
    })

    if (!block) {
      if (this.distance < 32) {
        this.distance = this.distance * 2
      }
      return this.again()
    }

    const pathResult = this.bot.navigate.findPathSync(block.position, {
      endRadius: 2
    })

    if (!pathResult) {
      return this.again()
    }

    this.distance = 4
    this.bot.navigate.walk(pathResult.path, (reason) => {
      if (reason !== 'arrived') {
        console.info(`Navigation interrupted ${reason}`)
        return this.again()
      }

      this.bot.dig(block, this.again)
    })
  }

  destroy () {
    this.running = false
    this.bot.stopDigging()
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }
}

module.exports = Logger
