const { SlashCommandBuilder } = require('discord.js');
const { activityEmbedBuilder } = require('../embeds/activityEmbed.js');
const { activityButtons } = require('../buttons/activityButtons.js');
const { convertToUnix } = require('../functions/timeUtil.js');
const Activity = require('../models/activityModel.js');

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
      const img = interaction.options.get('image') ?? '';
      const date = interaction.options.get('date').value;
      const time = interaction.options.get('time').value;
      const unixTimestamp = convertToUnix(date, time);
      const newActivity = await Activity.create({
        author: {
          userName: interaction.user.tag,
          userId: interaction.user.id,
          iconUrl: interaction.user.avatarURL({ dynamic: true, size: 256 }),
        },
        title: interaction.options.get('title').value,
        time: unixTimestamp,
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
      });
      const activityEmbed = await activityEmbedBuilder(newActivity);
      interaction.reply({
        content: 'Activity Post has been created, sending ...',
        ephemeral: true,
      });
      const msg = await interaction.channel.send({
        embeds: [activityEmbed],
        components: [activityButtons],
        fetchReply: true,
      });
      newActivity.post = msg.id;
      newActivity.channel = msg.channel;
      newActivity.save();
      client.activities.push(newActivity);
    } catch (error) {
      console.log(error);
      interaction.reply('❌ An error occured! ❌');
    }
  },
};
