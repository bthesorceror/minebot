const _ = require('lodash')
const { EventEmitter } = require('events')

class Crafting extends EventEmitter {
  constructor (bot) {
    super()

    this.bot = bot
  }

  async craft (itemType, count) {
    const recipe = _.get(this.bot.recipesAll(itemType), '0')

    if (!recipe) {
      throw new Error('No recipes available.')
    }

    await new Promise(resolve => {
      console.info('crafting planks')
      this.bot.craft(recipe, count, null, resolve)
    })
  }
}

const crafting = (bot) => {
  bot.crafting = new Crafting()
}

module.exports = crafting
