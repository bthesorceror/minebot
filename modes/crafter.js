const { EventEmitter } = require('events')
const autobind = require('auto-bind')
const Logger = require('./logger')

class Crafter extends EventEmitter {
  constructor (bot) {
    super()
    this.bot = bot
    this.currentMode = null

    autobind(this)

    process.nextTick(() => {
      this.bot.stocker.on('inventoryChanged', this.handleInventoryChange)
      this.switchMode()
    })
  }

  clearMode () {
    if (this.currentMode) {
      this.currentMode.destroy()
    }
  }

  async switchMode () {
    console.info('switching modes')
    this.clearMode()

    if (this.bot.stocker.craftingTableCount > 0) {
      console.log('I have a table')
      return this.emit('mode:change')
    }

    if (this.bot.stocker.woodPlankCount >= 4) {
      await this.bot.crafting.craft(58, 1)
      console.info('Crafted crafting table')
      return
    }

    if (this.bot.stocker.woodCount >= 1) {
      await this.bot.crafting.craft(5, 1)
      console.info('Crafted wood planks')
      return
    }

    console.info('Becoming logger')
    this.currentMode = new Logger(this.bot)
  }

  handleInventoryChange (change) {
    if (change <= 0) {
      return
    }

    this.switchMode()
  }

  destroy () {
    this.bot.removeListener('inventoryChanged', this.handleInventoryChange)
    this.clearMode()
  }
}

module.exports = Crafter
