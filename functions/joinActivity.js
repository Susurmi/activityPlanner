const { activityEmbedBuilder } = require("../embeds/activityEmbed.js");

module.exports.joinActivity = async (interaction, client) => {
  const { message, customId } = interaction;
  const user = {
    userName: interaction.user.tag,
    userId: interaction.user.id,
  };
  const activity = await client.activities.find((x) => x.post === message.id);
  const participant = activity.participants.find(
    (x) => x.userId === interaction.user.id
  );
  if (customId === "signUp") {
    if (participant && participant != undefined) {
      return interaction.reply({
        content: "You are already part of this activity.",
        ephemeral: true,
      });
    }
    activity.participants.push(user);

    const newEmbed = await activityEmbedBuilder(activity);
    await message.edit({ embeds: [newEmbed] });

    return interaction.reply({
      content: "You succesfully signed up!",
      ephemeral: true,
    });
  }
  if (customId === "signOut") {
    if (interaction.user.id === activity.author.userId) {
      return interaction.reply({
        content:
          "If you want to delete the activity you need to delete the post as of right now.",
        ephemeral: true,
      });
    }
    if (!participant || participant === undefined) {
      return interaction.reply({
        content: "You are not part of this activity.",
        ephemeral: true,
      });
    }
    let index = activity.participants
      .map((x) => {
        return x.userId;
      })
      .indexOf(interaction.user.id);
    if (!activity.participants[index].userId === interaction.user.id) return;
    activity.participants.splice(index, 1);

    const newEmbed = await activityEmbedBuilder(activity);
    await message.edit({ embeds: [newEmbed] });

    return interaction.reply({
      content: "You succesfully signed out!",
      ephemeral: true,
    });
  }
};
