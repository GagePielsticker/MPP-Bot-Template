const Command = require('../command.js')

module.exports = class ReloadCommand extends Command {
  constructor (client) {
    super('reload', [], 'Reloads the command handler.', {
      usage: `${client.settings.prefix}reload`
    })
    this.c = client
    this.requiresAdmin = true
  }

  async run (client, msg) {
    client.mpp.sendMessage('Reloading command handler...')
    client.reloadCommands().then(() => {
        client.mpp.sendMessage('Command handler refreshed!')
    })
  }
}