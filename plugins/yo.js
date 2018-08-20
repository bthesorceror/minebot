const yo = (bot) => {
  const sayYO = (username) => {
    bot.chat(`YO! ${username}`)
  }

  bot.sayYO = sayYO
}

module.exports = yo
