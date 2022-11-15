const { EmbedBuilder } = require("discord.js");

module.exports.activityEmbedBuilder = async (activity) => {
  let participants = "";
  await activity.participants.forEach((element) => {
    participants += `${element.userName}\n`;
  });
  const embed = new EmbedBuilder()
    .setColor("Random")
    .setTitle(activity.title)
    .setAuthor({
      name: activity.author.userName,
      iconURL: activity.author.iconUrl,
    })
    .setDescription(activity.description)
    .addFields(
      {
        name: `📅 <t:${activity.time}:d>`,
        value: "\u200b",
        inline: true,
      },
      {
        name: `⏱ <t:${activity.time}:t>`,
        value: "\u200b",
        inline: true,
      },
      {
        name: `👥 ${activity.participants.length}`,
        value: "\u200b",
        inline: true,
      }
    )
    .addFields({
      name: `Participants:`,
      value: participants,
    })
    .setImage(activity.image)
    .toJSON();

  return embed;
};
