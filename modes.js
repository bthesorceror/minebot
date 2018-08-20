const modes = (bot, settings, initial = 'default') => {
  let currentMode = new settings[initial](bot)

  bot.on('chat', (username, message) => {
    const matcher = /^become ([a-zA-Z]+)$/
    const matches = message.match(matcher)

    if (!matches) {
      return
    }

    const Mode = settings[matches[1]]

    if (!Mode) {
      bot.chat(`I don't know ${matches[1]}`)
      return
    }

    currentMode.destroy()
    bot.chat(`I am switching to ${matches[1]} mode`)
    currentMode = new Mode(bot)
  })

  bot.on('error', (err) => {
    console.error(err)
    process.exit(1)
  })

  bot.on('end', () => {
    console.info('Connection ended.')
    process.exit(1)
  })
}

module.exports = modes
