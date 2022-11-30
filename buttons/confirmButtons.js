const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const activityButtons = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel('✔')
      .setStyle(ButtonStyle.Success)
  )
  .addComponents(
    new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('❌')
      .setStyle(ButtonStyle.Danger)
  );

module.exports = { activityButtons };
