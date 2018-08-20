const watch = (bot) => {
  let currentlyWatching = ''

  const watchUser = (username) => {
    currentlyWatching = username
  }

  const clearWatch = () => {
    currentlyWatching = ''
  }

  bot.on('entityMoved', (entity) => {
    if (entity.username && entity.username === currentlyWatching) {
      bot.lookAt(entity.position)
    }
  })

  bot.watchUser = watchUser
  bot.clearWatch = clearWatch
}

module.exports = watch
