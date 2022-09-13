const Command = require('../command.js')

module.exports = class Eval extends Command {
  constructor (client) {
    super('eval', [], 'Evaluates a property on mpp lib.', {
      usage: `${client.settings.prefix}eval`,
      category: 'dev',
      requiresAdmin: true
    })
  }

  async run (client, msg) {
    let args = msg.content.split(' ')
    console.log(client.mpp[args[1]])
  }
}