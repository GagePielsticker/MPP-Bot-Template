/* Dependencies */
require('dotenv').config()
const MPPClient = require('multiplayerpianojs')
const Collection = require('@discordjs/collection').Collection

// Setup our custom client
let client = {
    commands: new Collection(),
    settings: require('./settings.json')
}
require('./extends.js')(client)

if(process.env.ENVIRO === 'dev') {
    client.settings.prefix = client.settings.devPrefix
    process.env.MPP_TOKEN = process.env.MPP_DEV_TOKEN
    client.settings.name = `KhaiBot ${client.settings.prefix}h ${process.env.ENVIRO} instance`
}
if(process.env.ENVIRO === 'prod') {
    client.settings.prefix = client.settings.prodPrefix
    process.env.MPP_TOKEN = process.env.MPP_PROD_TOKEN
    client.settings.name = `KhaiBot ${client.settings.prefix}h`
}

client.mpp = new MPPClient(process.env.MPP_TOKEN)

// Event handling
client.mpp.on('connected', () => {
    client.mpp.setChannel(client.settings.defaultChannel)
    client.reloadCommands()
    client.mpp.sendMessage(`${process.env.ENVIRO} deployed.`)
    client.mpp.setUser(client.settings.name)
})

client.mpp.on('message', async msg => {

  if (!msg.content.startsWith(client.settings.prefix)) return

  await client.executeCommand(msg)
      .catch(e => client.mpp.sendMessage(`Error executing command: ${e}`))
      .then(() => console.log(`${msg.author.name} || ${msg.content}`))
})

// Connect the client
client.mpp.connect()