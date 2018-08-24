const mineflayer = require('mineflayer')
const modes = require('./modes')

// Plugins
const finder = require('./plugins/finder')
const watch = require('./plugins/watch')
const navigate = require('mineflayer-navigate')(mineflayer)
const yo = require('./plugins/yo')
const database = require('./plugins/database')
const looker = require('./plugins/looker')
const placer = require('./plugins/placer')
const crafting = require('./plugins/crafting')
const stocker = require('./plugins/stocker')

// Modes
const Default = require('./modes/default')
const Hunter = require('./modes/hunter')
const Logger = require('./modes/logger')
const Miner = require('./modes/miner')

const username = 'BRBot'
const bot = mineflayer.createBot({ username })

bot.loadPlugin(yo)
bot.loadPlugin(watch)
bot.loadPlugin(navigate)
bot.loadPlugin(finder)
bot.loadPlugin(database)
bot.loadPlugin(looker)
bot.loadPlugin(placer)
bot.loadPlugin(crafting)
bot.loadPlugin(stocker)

bot.once('spawn', () => {
  modes(bot, {
    default: Default,
    hunter: Hunter,
    logger: Logger,
    miner: Miner
  })
})

console.info('Starting...')
console.info('hold on to your butts ...')
