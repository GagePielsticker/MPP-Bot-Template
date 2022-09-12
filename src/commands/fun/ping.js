const Command = require('../command.js')

module.exports = class InviteCommand extends Command {
  constructor (client) {
    super('ping', [], 'A ping Command.', {
      usage: `!ping`
    })
    this.c = client
  }

  async run (client, msg) {
    client.mpp.sendMessage('Pong.')
  }
}