require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const mongoose = require("mongoose");
const {
  eventHandler,
  deployCommands,
  commandHandler,
} = require("./handlers/index.js");

class ExtendedClient extends Client {
  // creating a command collection needed by the commandHandler
  commands = new Collection();

  // creating Collections/Array needed as cache memory for Commands
  activities = [];

  // Set up all intents needed for the bot to operate here
  constructor(options) {
    super({
      intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.Guilds,
      ],
    });
  }

  // connect to mongoDB
  async connectDB(URI) {
    await mongoose
      .connect(URI)
      .then(console.log("Datenbank verbunden"))
      .catch((err) => console.log(err));
  }

  // automatet startup function that connects to the DB and loads all events/commands and registers them at the discord API
  async startUp(token, clientID, guildID, URI) {
    await this.connectDB(URI);
    await deployCommands(clientID, guildID, token);
    await eventHandler(this);
    await commandHandler(this);
    this.login(token);
  }
}

exports.ExtendedClient = ExtendedClient;
