'user strict'

const { Command } = require('@adonisjs/ace')

class Stop extends Command {
  static get inject () {
    return [
      'Adonis/Addons/Ironium'
    ]
  }

  constructor (Ironium) {
    super()
    this.Ironium = Ironium
  }

  static get signature () {
    return 'ironium:stop'
  }

  static get description () {
    return 'Stop the ironium listener.'
  }

  handle () {
    return this.Ironium.stop()
  }
}

module.exports = Stop
