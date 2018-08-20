const _ = require('lodash')
const autobind = require('auto-bind')

const log = {
  info (...args) {
    // NO OP
    // console.info.apply(console, args)
  }
}

const END_RADIUS = 3
const CLEAR_HUNTING_TIMEOUT = 100
// const TIMEOUT = 10
const MAX_DISTANCE = 100

class CappedList {
  constructor (size) {
    this.size = size
    this.internal = []
  }

  push (item) {
    if (this.internal.length < this.size) {
      this.internal.push(item)
      return
    }

    this.internal = [...this.internal.slice(1), item]
  }

  includes (item) {
    return item in this.internal
  }
}

class Hunter {
  constructor (bot) {
    this.bot = bot
    this.hunting = null
    this.timeout = null
    this.history = new CappedList(1000)

    autobind(this)
    this.attachEvents()
    this.findTarget()
  }

  clearHunting () {
    if (this.timeout) {
      return
    }

    this.hunting = null
    this.timeout = setTimeout(() => {
      this.findTarget()
      this.timeout = null
    }, CLEAR_HUNTING_TIMEOUT)
  }

  isHuntable (entity) {
    return entity.type === 'mob' &&
      entity.position.distanceTo(this.bot.entity.position) < MAX_DISTANCE &&
      !this.history.includes(entity)
  }

  handleArrived () {
    log.info('Arrived at entity')
    if (!this.hunting) {
      return this.clearHunting()
    }

    const entity = this.bot.entities[this.hunting]
    if (!entity) {
      return this.clearHunting()
    }

    log.info('Entity', this.hunting, _.get(entity, 'id'))
    this.bot.attack(entity)
    this.navigateTo(entity)
  }

  handleCannotFind () {
    log.info('Cannot find path')
    this.clearHunting()
  }

  findTarget () {
    log.info('Searching for target')
    const target = _.find(this.bot.entities, this.isHuntable)

    if (!target) {
      log.info('Could not find target')
      return setTimeout(this.findTarget, 100)
    }

    log.info('Found target')
    this.history.push(target)

    this.hunting = target.id
    this.navigateTo(target)
  }

  handleEntityGone (entity) {
    if (this.hunting && this.hunting === entity.id) {
      log.info('Entity is gone')
      this.clearHunting()
    }
  }

  handleSpawn () {
    this.clearHunting()
  }

  handleDeath () {
    this.clearTimeout()
    this.hunting = null
  }

  navigateTo (entity) {
    this.bot.navigate.to(entity.position, { endRadius: END_RADIUS })
  }

  attachEvents () {
    this.bot.on('spawn', this.handleSpawn)
    this.bot.on('death', this.handleDeath)
    this.bot.on('entityGone', this.handleEntityGone)

    this.bot.navigate.on('arrived', this.handleArrived)
    this.bot.navigate.on('cannotFind', this.handleCannotFind)
  }

  removeEvents () {
    this.bot.removeListener('spawn', this.handleSpawn)
    this.bot.removeListener('death', this.handleDeath)
    this.bot.removeListener('entityGone', this.handleEntityGone)

    this.bot.navigate.removeListener('arrived', this.handleArrived)
    this.bot.navigate.removeListener('cannotFind', this.handleCannotFind)
  }

  clearTimeout () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  destroy () {
    this.clearTimeout()
    this.removeEvents()
  }
}

module.exports = Hunter
