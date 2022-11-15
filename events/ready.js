const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`${client.user.tag} hat sich eingeloggt!`);

    client.user.setPresence({
      activities: [{ name: `Slashcommands!`, type: ActivityType.Listening }],
      status: "online",
    });
  },
};
