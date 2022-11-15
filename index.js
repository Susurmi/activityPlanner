require("dotenv").config();
const { ExtendedClient } = require("./client/index.js");

// defining all needed variables for the bot

const URI = process.env.MONGODB_URI;
const TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CLIENT_ID = process.env.CLIENT_ID;

//creating a new bot client instance and starting it

const Bot = new ExtendedClient();

Bot.startUp(TOKEN, CLIENT_ID, GUILD_ID, URI);
