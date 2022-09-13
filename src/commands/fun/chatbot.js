const Command = require('../command.js')
const cleverbot = require("cleverbot-free")

module.exports = class InviteCommand extends Command {
  constructor (client) {
    super('chatbot', [], 'A cleverbot implementation.', {
      usage: `${client.settings.prefix}chatbot`,
      category: 'fun'
    })
  }

  async run (client, msg) {
    let curUsr = msg.author.id
    let chat = []
    if(client.chatBotUsers.includes(curUsr)) return client.mpp.sendMessage('You already have a chatbot initiated. Please wait for it do close.')

    client.mpp.sendMessage(`Initiating chatbot. Feel free to say hi @${msg.author.id}! (Bot expires in ${client.settings.chatBotLifeMS / 1000} seconds)`)

    let msgHandler = chatMsg => {
        if(chatMsg.content.startsWith(client.settings.prefix)) return
        if(chatMsg.author.id != curUsr) return
        cleverbot(chatMsg.content, [chat])
        .then(response => {
            chat.push(chatMsg.content)
            chat.push(response)
            client.mpp.sendMessage(`@${msg.author.id} : ${response}`)
        })
        .catch(console.log)
    }

    client.mpp.on('message', msgHandler)

    setTimeout(() => {
        client.mpp.removeListener('message', msgHandler)
        client.mpp.sendMessage(`@${msg.author.id} Your chatbot has expired.`)
        return
    }, client.settings.chatBotLifeMS)
    
  }
}