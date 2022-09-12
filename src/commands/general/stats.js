const Command = require('../command.js')
const si = require('systeminformation')

module.exports = class StatsCommand extends Command {
  constructor (client) {
    super('stats', ['s', 'stat'], 'Get\'s stats for the bot', {
      usage: `${client.settings.prefix}stats OR ${client.settings.prefix}s`,
      category: 'gen'
    })
  }

  async run (client, msg) {
    const cpu = await si.cpu()
    const mem = await si.mem()
    const operating = await si.osInfo()
    client.mpp.sendMessage('ㅤ')

    client.mpp.sendMessage('📊 Statistics')
    client.mpp.sendMessage('INFO :: Bot is currently under development. Feel free to contribute!')
    client.mpp.sendMessage(`DEPLOYMENT :: ${process.env.ENVIRO}`)
    client.mpp.sendMessage(`RAM :: ${Math.floor(mem.used / 1000000000)}gb/${Math.floor(mem.total / 1000000000)}gb`)
    client.mpp.sendMessage(`CPU :: ${cpu.cores} Cores`)
    client.mpp.sendMessage(`PLATFORM :: ${operating.platform}`)
    client.mpp.sendMessage(`Language :: NodeJS using ${client.settings.libraryURL}`)
    client.mpp.sendMessage(`Support :: Join my discord @ ${client.settings.discordURL}`)
    client.mpp.sendMessage(`Github :: Contribute to the code @ ${client.settings.githubURL}`)
    client.mpp.sendMessage('ㅤ')
  }
}