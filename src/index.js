/* Dependencies */
require('dotenv').config()
const MPPClient = require('multiplayerpianojs')
const Collection = require('@discordjs/collection').Collection

// Setup our custom client
let client = {
    commands: new Collection(),
    settings: require('./settings.json'),
    mpp: new MPPClient(process.env.MPP_TOKEN)
}
require('./extends.js')(client)

if(process.env.ENVIRO === 'dev') client.settings.prefix = client.settings.devPrefix
if(process.env.ENVIRO === 'prod') client.settings.prefix = client.settings.prodPrefix

// Event handling
client.mpp.on('connected', () => {
    client.mpp.setChannel(client.settings.defaultChannel)
    client.mpp.setUser(`KhaiBot ${client.settings.prefix}h`)
    client.reloadCommands()
    client.mpp.sendMessage(`${process.env.ENVIRO} deployed.`)
})

client.mpp.on('message', async msg => {

  if (!msg.content.startsWith(client.settings.prefix)) return

  await client.executeCommand(msg)
      .catch(e => client.mpp.sendMessage(`Error executing command: ${e}`))
      .then(() => console.log(`${msg.author.name} || ${msg.content}`))
})

// Connect the client
client.mpp.connect()