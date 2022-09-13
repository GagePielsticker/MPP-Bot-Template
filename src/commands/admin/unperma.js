const Command = require('../command.js')

module.exports = class UnPerma extends Command {
  constructor (client) {
    super('unperma', ['ub'], 'Un-permabans a user.', {
      usage: `${client.settings.prefix}unperma {userID}`,
      category: 'dev',
      requiresAdmin: true,
      requiresCrown: true
    })
  }

  async run (client, msg) {
    let args = msg.content.split(' ')

    if(args.length != 2) return client.mpp.sendMessage('Invalid amount of arguments.')
    
    client.removeUserBan(args[1])
    client.mpp.unban(args[1], 3600000)

    client.mpp.sendMessage('ㅤ')
    client.mpp.sendMessage('🔨 Un-PermaBan')
    client.mpp.sendMessage(`User ${args[1]} has been unbanned from the channel. To undo this type ${client.settings.prefix}unperma {ID}!`)
    client.mpp.sendMessage('ㅤ')
  }
}