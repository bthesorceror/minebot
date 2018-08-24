const autobind = require('auto-bind')
const _ = require('lodash')
const { EventEmitter } = require('events')

class Stocker extends EventEmitter {
  constructor (bot) {
    super()

    this.bot = bot

    autobind(this)

    this.storeCurrentInventory()
    this.bot.inventory.on('windowUpdate', this.handleWindowUpdate)
  }

  storeCurrentInventory () {
    this.items = this.bot.inventory.items()
  }

  handleWindowUpdate () {
    const currentItems = this.bot.inventory.items()

    const oldCount = _.sumBy(this.items, 'count')
    const newCount = _.sumBy(currentItems, 'count')

    if (oldCount !== newCount) {
      this.items = currentItems
      this.emit('inventoryChanged')
    }
  }

  equipItem (item, place = 'hand') {
    return new Promise((resolve, reject) => {
      this.bot.equip(item, place, (err) => {
        if (err) {
          return reject(err)
        }

        resolve()
      })
    })
  }

  getItem (itemType) {
    return this.bot
      .inventory
      .items()
      .find((item) => item.type === itemType)
  }

  get woodPlankCount () {
    return this.count(5)
  }

  get woodCount () {
    return this.count(17)
  }

  get craftingTableCount () {
    return this.count(58)
  }

  count (itemType) {
    return _.reduce(this.bot.inventory.items(), (acc, item) => {
      if (item.type === itemType) {
        return acc + item.count
      }

      return acc
    }, 0)
  }
}

const stocker = (bot) => {
  bot.stocker = new Stocker(bot)
}

module.exports = stocker
