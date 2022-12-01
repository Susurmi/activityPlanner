const { SlashCommandBuilder } = require('discord.js');
const { activityEmbedBuilder } = require('../embeds/activityEmbed.js');
const { activityButtons } = require('../buttons/activityButtons.js');
const Activity = require('../models/activityModel');
const moment = require('moment');
moment.locale('de');

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
    try {
      const img = interaction.options.get('image');
      if (!interaction.options.get('image')) img = '';
      const unixDate = await moment(
        interaction.options.get('date').value +
          ' ' +
          interaction.options.get('time').value,
        'DD/MM/YYYY hh:mm'
      ).unix();
      const activity = {
        author: {
          userName: interaction.user.tag,
          userId: interaction.user.id,
          iconUrl: interaction.user.avatarURL({ dynamic: true, size: 256 }),
        },
        title: interaction.options.get('title').value,
        time: unixDate,
        description: interaction.options.get('description').value,
        image: img(),
        post: '',
        channel: '',
        participants: [
          {
            userName: interaction.user.tag,
            userId: interaction.user.id,
          },
        ],
      };

      const activityEmbed = await activityEmbedBuilder(activity);
      await interaction.reply({
        content: 'Activity Post has been created, sending ...',
        ephemeral: true,
      });
      const msg = await interaction.channel.send({
        embeds: [activityEmbed],
        components: [activityButtons],
        fetchReply: true,
      });
      activity.post = msg.id;
      activity.channel = msg.channel;
      const newActivity = await Activity.create(activity);
      newActivity.save();
      client.activities.push(activity);
    } catch (error) {
      console.log(error);
      interaction.reply('❌ An error occured! ❌');
    }
  },
};
