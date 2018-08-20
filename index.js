const mineflayer = require('mineflayer')
const modes = require('./modes')

// Plugins
const finder = require('./plugins/finder')
const watch = require('./plugins/watch')
const navigate = require('mineflayer-navigate')(mineflayer)
const yo = require('./plugins/yo')

// Modes
const Default = require('./modes/default')
const Hunter = require('./modes/hunter')

const username = 'BRBot'
const bot = mineflayer.createBot({ username })

bot.loadPlugin(yo)
bot.loadPlugin(watch)
bot.loadPlugin(navigate)
bot.loadPlugin(finder)

bot.once('spawn', () => {
  modes(bot, {
    default: Default,
    hunter: Hunter
  })
})

console.info('Starting...')
console.info('hold on to your butts ...')
