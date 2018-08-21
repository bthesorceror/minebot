const modes = (bot, settings, initial = 'default') => {
  let currentMode = null

  const nextMode = () => {
    return initial
  }

  const changeMode = (mode) => {
    const Mode = settings[mode]

    if (!Mode) {
      bot.chat(`I don't know ${mode}`)
      return
    }

    if (currentMode) {
      currentMode.destroy()
      currentMode.removeAllListeners('mode:change')
    }

    bot.chat(`I am switching to ${mode} mode`)
    currentMode = new Mode(bot)

    currentMode.once('mode:change', () => {
      changeMode(nextMode())
    })
  }

  changeMode(initial)

  bot.on('chat', (_username, message) => {
    const matcher = /^become ([a-zA-Z]+)$/
    const matches = message.match(matcher)

    if (!matches) {
      return
    }

    changeMode(matches[1])
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
