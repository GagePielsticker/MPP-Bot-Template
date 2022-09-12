module.exports = class Command {
    constructor (name, aliases, description, opts) {
      this.usage = opts.usage || ''
      this.name = name
      this.aliases = aliases
      this.description = description
    }
  }