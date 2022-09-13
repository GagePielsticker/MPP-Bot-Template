const Command = require('../command.js')
module.exports = class MyInfo extends Command {
  constructor (client) {
    super('myinfo', ['mi','userinfo'], 'Get user info', {
      usage: `${client.settings.prefix}myinfo OR ${client.settings.prefix}mi OR ${client.settings.prefix}userinfo`,
      category: 'gen'
    })
  }

  async run (client, msg) {
    client.mpp.sendMessage('😃 User Information')
    client.mpp.sendMessage(`ID: ${msg.author.id}`)
    client.mpp.sendMessage(`COLOR: ${msg.author.color}`)
    client.mpp.sendMessage(`NAME: ${msg.author.name}`)
  }
}