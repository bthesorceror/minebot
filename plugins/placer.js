class Placer {
  constructor (bot) {
    this.bot = bot
  }

  async placeBlock (refBlock, direction) {
    await this.bot.looker.lookAt(refBlock.position)

    return new Promise((resolve, reject) => {
      this.bot.placeBlock(refBlock, direction, (err) => {
        if (err) {
          return reject(err)
        }

        console.info('Placed block')
        resolve()
      })
    })
  }
}

const placer = (bot) => {
  bot.placer = new Placer(bot)
}

module.exports = placer
