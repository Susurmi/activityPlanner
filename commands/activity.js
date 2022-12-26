const { SlashCommandBuilder } = require('discord.js');
const { createActivity } = require('../functions/createActivity.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('activity')
    .setDescription('Create an activity for members to join.')
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('What activity do you want to do?')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('date')
        .setDescription('Date the activity is happening at. Format: TT/MM/JJJJ')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('time')
        .setDescription('Start time for the event. Format: HH:MM')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('Describe the activity.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('image')
        .setDescription('Display an image of your activity.')
    ),
  async execute(interaction, client) {
    await createActivity(interaction, client).then((afzer) => {
      interaction.reply({
        content: 'Activity Post has been created, sending ...',
        ephemeral: true,
      });
    });
  },
};
