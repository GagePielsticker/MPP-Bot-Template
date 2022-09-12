const Command = require('../command.js')

module.exports = class HelpCommand extends Command {
  constructor (client) {
    super('help', ['h'], 'A Help Command.', {
      usage: `${client.settings.prefix}help OR ${client.settings.prefix}h`
    })
    this.c = client
  }

  async run (client, msg) {
    client.mpp.sendMessage('Hey! This bot is currently under development. You can view the framework/code and use it for yourself here - https://github.com/GagePielsticker/MPP-Bot-Template')
  }
}