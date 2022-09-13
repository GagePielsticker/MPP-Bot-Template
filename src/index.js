/* Dependencies */
require('dotenv').config()
const MPPClient = require('multiplayerpianojs')
const Collection = require('@discordjs/collection').Collection

// Setup our custom client
let client = {
    commands: new Collection(),
    settings: require('./settings.json'),
    database: undefined,
    chatBotUsers: []
}
require('./engine/extends.js')(client)
require('./engine/mongo.js')(client)

if(process.env.ENVIRO === 'dev') {
    client.settings.prefix = client.settings.devPrefix
    process.env.MPP_TOKEN = process.env.MPP_DEV_TOKEN
    client.settings.defaultChannel = '✧𝓓𝓔𝓥 𝓡𝓸𝓸𝓶✧'
    client.settings.name = `🌌 GalaxyTest ${client.settings.prefix}h`
}
if(process.env.ENVIRO === 'prod') {
    client.settings.prefix = client.settings.prodPrefix
    process.env.MPP_TOKEN = process.env.MPP_PROD_TOKEN
    client.settings.name = `🌌 GalaxySim ${client.settings.prefix}h`
}

client.mpp = new MPPClient(process.env.MPP_TOKEN)

// Connect to our database
client.settings.mongo.database = `${client.settings.mongo.database}-${process.env.ENVIRO}`
console.log('Attempting to connect database...')
client.connectDb()
    .then(() => console.log(`Database :: ${client.settings.mongo.database}-${process.env.ENVIRO} :: Connected!`))
    .catch(e => {
        console.log(e)
        process.exit(1)
    })

// Event handling
client.mpp.on('connected', () => {

    console.log('Connected to MPP.')
    client.mpp.setChannel(client.settings.defaultChannel)
    client.reloadCommands()
    client.mpp.sendMessage(`${process.env.ENVIRO} deployed onto server.`)
    client.mpp.setUser(client.settings.name, '#0000FF')
})

client.mpp.on('userJoin', async usr => {

    //If user is in ban collection of database, ban. (Means he is permabanned)
    let banStatus = await client.checkUserBan(usr.id)
    if(banStatus) return client.mpp.ban(usr.id, 1)
})

client.mpp.on('message', async msg => {

  if (!msg.content.startsWith(client.settings.prefix)) return

  await client.executeCommand(msg)
      .catch(e => client.mpp.sendMessage(`Error executing command: ${e}`))
      .then(() => console.log(`${msg.author.name} || ${msg.content}`))
})

// Connect the client
client.mpp.connect()