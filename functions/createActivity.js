const { activityEmbedBuilder } = require('../embeds/activityEmbed.js');
const { activityButtons } = require('../buttons/activityButtons.js');
const { convertToUnix } = require('../functions/timeUtil.js');
const Activity = require('../models/activityModel.js');

const createActivity = async (interaction, client) => {
  const img = interaction.options.get('image') ?? '';
  const date = interaction.options.get('date').value;
  const time = interaction.options.get('time').value;
  try {
    const newActivity = await Activity.create({
      author: {
        userName: interaction.user.tag,
        userId: interaction.user.id,
        iconUrl: interaction.user.avatarURL({ dynamic: true, size: 256 }),
      },
      title: interaction.options.get('title').value,
      time: await convertToUnix(date, time),
      description: interaction.options.get('description').value,
      image: img,
      post: 'undefined',
      channel: interaction.channel.id,
      participants: [
        {
          userName: interaction.user.tag,
          userId: interaction.user.id,
        },
      ],
    });
    const activityEmbed = await activityEmbedBuilder(newActivity, interaction);
    const msg = await interaction.channel.send({
      embeds: [activityEmbed],
      components: [activityButtons],
      fetchReply: true,
    });
    newActivity.post = msg.id;
    newActivity.channel = msg.channel;
    newActivity.save();
    client.activities.push(newActivity);
    return;
  } catch (error) {
    console.log(error);
    interaction.reply({ content: '❌ An error occured! ❌', ephemeral: true });
  }
};

module.exports = { createActivity };
