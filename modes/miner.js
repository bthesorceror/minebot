const autobind = require('auto-bind')
const { EventEmitter } = require('events')
const Vec3 = require('vec3').Vec3

class Miner extends EventEmitter {
  constructor (bot, options = {resume: true}) {
    super()
    this.bot = bot
    this.running = true
    this.queue = []
    this.timeout = null

    autobind(this)

    this.bot.on('death', this.handleDeath)

    if (options.resume) {
      this.resume()
    } else {
      this.mine()
    }
  }

  async resume () {
    try {
      const {x, y, z} = await this.bot.db.get('last-mine-location')
      const lastLocation = new Vec3(x, y, z)
      const pathResult = this.bot.navigate.findPathSync(lastLocation)
      this.bot.navigate.walk(pathResult.path, () => {
        this.mine()
      })
    } catch (e) {
      console.error(e)
      this.mine()
    }
  }

  async storePosition () {
    const {x, y, z} = this.bot.entity.position

    await this.bot.db.put(
      'last-mine-location',
      {x, y, z}
    )
  }

  async changeMode () {
    this.emit('mode:change')
  }

  handleDeath () {
    this.changeMode(true)
  }

  queueWork () {
    const { position } = this.bot.entity

    this.queue.push(position.offset(-1, -1, 1))
    this.queue.push(position.offset(0, -1, 1))
    this.queue.push(position.offset(1, -1, 1))

    this.queue.push(position.offset(-1, 0, 1))
    this.queue.push(position.offset(0, 0, 1))
    this.queue.push(position.offset(1, 0, 1))

    this.queue.push(position.offset(-1, 1, 1))
    this.queue.push(position.offset(0, 1, 1))
    this.queue.push(position.offset(1, 1, 1))

    this.queueMine()
  }

  queueMine () {
    this.timeout = setTimeout(() => {
      this.mine()
    }, 100)
  }

  mine () {
    if (!this.running) {
      return
    }

    if (this.queue.length > 0) {
      const nextBlock = this.bot.blockAt(this.queue.pop())

      if (!this.bot.canDigBlock(nextBlock)) {
        return this.queueMine()
      }

      this.bot.dig(nextBlock, async (err) => {
        if (err) {
          console.error(err)
        }
        await this.storePosition()
        this.queueMine()
      })
    } else {
      const { position } = this.bot.entity
      const nextPosition = position.offset(0, -1, 1)
      const pathResult = this.bot.navigate.findPathSync(nextPosition)

      if (!pathResult) {
        return this.changeMode()
      }

      this.bot.navigate.walk(pathResult.path, (reason) => {
        if (reason !== 'arrived') {
          return this.changeMode()
        }

        this.queueWork()
      })
    }
  }

  destroy () {
    this.bot.removeListener('death', this.handleDeath)
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.running = false
  }
}

module.exports = Miner
