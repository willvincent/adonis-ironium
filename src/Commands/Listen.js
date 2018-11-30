'user strict'

const { Command } = require('@adonisjs/ace')

class Listen extends Command {
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
    return 'ironium:listen'
  }

  static get description () {
    return 'Start the ironium listener.'
  }

  handle () {
    return this.Ironium.listen()
  }
}

module.exports = Listen
