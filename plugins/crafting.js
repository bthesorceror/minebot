const _ = require('lodash')
const autobind = require('auto-bind')
const { EventEmitter } = require('events')

class Crafting extends EventEmitter {
  constructor (bot) {
    super()

    this.bot = bot
    autobind(this)
  }

  async craft (itemType, count) {
    const recipe = _.get(this.bot.recipesAll(itemType), '0')

    if (!recipe) {
      throw new Error('No recipes available.')
    }

    await this.bot.looker.lookAt(this.bot.entity.position.offset(0, 3, 0))

    return new Promise(resolve => {
      this.bot.craft(recipe, count, null, resolve)
    })
  }
}

const crafting = (bot) => {
  bot.crafting = new Crafting(bot)
}

module.exports = crafting
