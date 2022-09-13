/** Dependencies */
const MongoClient = require('mongodb').MongoClient

module.exports = client => {
  /**
   * Connects mongoDB Database and appends it on client.db
   */
  client.connectDb = () => {
    return new Promise((resolve, reject) => {
      const { host, port, database, username, password } = client.settings.mongo
      MongoClient.connect(`mongodb://${username ? `${username}:${password}@` : ''}${host}:${port}`, { useNewUrlParser: true }, async (err, data) => {
        if (err) return reject(`Error connecting to db: ${err}`)
        client.database = await data.db(database)

        //Index stuff to auto expire record
        await client.database.collection('bans').createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )
        .catch (console.log)


        resolve()
      })
    })
  }

  /**
   * Checks if user is perma banned or not
   * @param {String} id 
   * @returns Boolean
   */
  client.checkUserBan = async id => {
    let user = await client.database.collection('bans').findOne({ id })
    if(!user) return false
    return true
  }

  /**
   * adds user ban to database
   * @param {String} id 
   * @param {Int} seconds 
   */
  client.addUserBan = async (id, seconds) => {
    return await client.database.collection('bans').updateOne({ id }, {
      $set: {
        id: id,
        banDate: +new Date(),
        expireAt: new Date(new Date().getTime() + (seconds * 1000))
      }
    }, {
      upsert: true
    })
  }

  /**
   * Removes user ban from database
   * @param {String} id 
   * @returns 
   */
  client.removeUserBan = async id => {
    return await client.database.collection('bans').removeOne({ id })
  }
}