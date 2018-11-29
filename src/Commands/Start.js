'user strict'

const { Command } = require('@adonisjs/ace')

class Start extends Command {
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
    return 'ironium:start'
  }

  static get description () {
    return 'Start the ironium listener.'
  }

  handle () {
    return this.Ironium.start()
  }
}

module.exports = Start
