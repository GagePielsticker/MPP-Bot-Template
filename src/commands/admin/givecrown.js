const Command = require('../command.js')

module.exports = class GiveCrown extends Command {
  constructor (client) {
    super('givecrown', ['gc'], 'Gives the crown to user.', {
      usage: `${client.settings.prefix}givecrown OR ${client.settings.prefix}gc`,
      category: 'dev',
      requiresAdmin: true,
      requiresCrown: true
    })
  }

  async run (client, msg) {
    client.mpp.sendMessage('🔨 Crown')
    client.mpp.giveCrown(msg.author.id)
    client.mpp.sendMessage(`Set \`${msg.author.name}\` as owner!`)
  }
}