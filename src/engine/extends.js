const fs = require('fs')
const path = require('path')

module.exports = client => {
    const promiseReaddir = (dir) => {
        return new Promise((resolve, reject) => {
          fs.readdir(dir, (err, files) => {
            if (err) return reject(err)
            resolve(files)
          })
        })
      }
       /**
   * Reloads commands into the commands array
   */
    client.reloadCommands = async () => {
        const promises = []
        let cmdFolders = promiseReaddir(path.resolve(__dirname, '../commands')).catch(console.log)
        promises.push(cmdFolders)
        cmdFolders = await cmdFolders
        cmdFolders.forEach(async folder => {
        if (folder.endsWith('.js')) return
        let commands = promiseReaddir(path.resolve(__dirname, '../commands', folder)).catch(console.log)
        promises.push(commands)
        commands = await commands
        if (!commands) return
        commands.forEach(cmd => {
            delete require.cache[require.resolve(path.resolve(__dirname, '../commands', folder, cmd))]
            const Command = require(path.resolve(__dirname, '../commands', folder, cmd))
            client.commands.set(cmd, new Command(client))
        })
        })

        await Promise.all(promises)
        .then(() => console.log('Loaded all commands'))
        .catch(err => console.log(`Error while loading commands: ${err}`))
    }

     /**
   * Executes Command, requires message object
   * @param {Object} msg
   */
  client.executeCommand = async msg => {
    const args = msg.content.slice(client.settings.prefix.length).split(' ')
    const command = args.shift().toLowerCase()
    const cmd = client.commands.find(x => x.name === command || x.aliases.includes(command))
    if (!cmd) return

    if(cmd.requiresAdmin && !client.settings.bot_admins.includes(msg.author.id)) return client.mpp.sendMessage('You need admin perms to use this command.')

    if(cmd.requiresCrown && !client.mpp.hasCrown) return client.mpp.sendMessage('I can\'t run this without the room crown!')

    cmd.run(client, msg)
  }

}