const Command = require('../command.js')
module.exports = class Example extends Command {
  constructor (client) {
    super('example', ['ex'], 'Example command file', {
      usage: `${client.settings.prefix}example OR ${client.settings.prefix}ex`,
      category: 'fun',
      requiresAdmin: true, //Is user on dev list in settings
      requiresCrown: true //Is user room owner
    })
  }

  async run (client, msg) {
    client.mpp.sendMessage('Example command executed :)')

  }
}