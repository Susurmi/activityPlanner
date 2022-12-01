require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const Activity = require('../models/activityModel');
const {
  eventHandler,
  deployCommands,
  commandHandler,
} = require('./handlers/index.js');

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
      .then(console.log('Datenbank verbunden'))
      .catch((err) => console.log(err));
  }

  async getActivitys(client) {
    const allEvents = await Activity.find();
    client.activities = allEvents;
    if (!allEvents) return;
    client.on('ready', () => {
      allEvents.forEach(async (element) => {
        try {
          const eventChannel = await client.channels.cache.get(element.channel);
          await eventChannel.messages.fetch(element.post);
        } catch (error) {
          Activity.deleteOne({ post: element.post });
        }
      });
    });
    console.log('Geladene Events:' + allEvents.length);
  }

  // automatet startup function that connects to the DB and loads all events/commands and registers them at the discord API
  async startUp(token, clientID, guildID, URI) {
    await this.connectDB(URI);
    await deployCommands(clientID, guildID, token);
    await eventHandler(this);
    await commandHandler(this);
    this.login(token);
    await this.getActivitys(this);
  }
}

exports.ExtendedClient = ExtendedClient;
