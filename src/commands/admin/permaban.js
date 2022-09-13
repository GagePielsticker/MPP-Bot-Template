const Command = require('../command.js')

module.exports = class PermaBan extends Command {
  constructor (client) {
    super('permaban', ['pb'], 'Permabans a user.', {
      usage: `${client.settings.prefix}permaban {userID}`,
      category: 'dev',
      requiresAdmin: true,
      requiresCrown: true
    })
  }

  async run (client, msg) {
    let args = msg.content.split(' ')

    if(args.length != 3) return client.mpp.sendMessage('Invalid amount of arguments.')
    
    client.addUserBan(args[1], args[2])
    client.mpp.ban(args[1], 1)

    client.mpp.sendMessage('🔨 Permaban')
    client.mpp.sendMessage(`User ${args[1]} has been permabanned from the channel. To undo this type ${client.settings.prefix}unperma ${args[1]}!`)
  }
}