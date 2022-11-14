/* Dependencies */
require('dotenv').config()
const MPPClient = require('multiplayerpianojs')
const Collection = require('@discordjs/collection').Collection

// Setup our custom client
let client = {
    commands: new Collection(),
    settings: require('./settings.json')
}
require('./engine/extends.js')(client)

client.settings.name = `${client.settings.name} ${client.settings.prefix}h`

if(!client.settings.MPP_TOKEN) {
    console.log(new Error('NO MPP TOKEN ENTERED, FORCE EXITING TO AVOID BAN.'))
    process.exit(1)
    return
}

client.mpp = new MPPClient(client.settings.MPP_TOKEN)

// Event handling
client.mpp.on('connected', () => {

    console.log('Connected to MPP.')
    client.mpp.setChannel(client.settings.defaultChannel)
    client.reloadCommands()
    client.mpp.sendMessage(`Bot has been deployed.`)
    client.mpp.setUser(client.settings.name, '#0000FF')
})

client.mpp.on('userJoin', async usr => {
    client.mpp.sendMessage(`Welcome ${usr.name}!`)
})

client.mpp.on('message', async msg => {

  if (!msg.content.startsWith(client.settings.prefix)) return

  await client.executeCommand(msg)
      .catch(e => client.mpp.sendMessage(`Error executing command: ${e}`))
      .then(() => console.log(`${msg.author.name} || ${msg.content}`))
})

// Connect the client
client.mpp.connect()