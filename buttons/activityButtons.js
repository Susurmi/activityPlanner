const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const activityButtons = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId("signUp")
      .setLabel("✔")
      .setStyle(ButtonStyle.Success)
  )
  .addComponents(
    new ButtonBuilder()
      .setCustomId("signOut")
      .setLabel("❌")
      .setStyle(ButtonStyle.Danger)
  );

module.exports = { activityButtons };
