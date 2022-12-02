const Activity = require('../models/activityModel');

module.exports = {
  name: 'messageDelete',
  once: false,
  async execute(message, client) {
    const activity = await client.activities.find((x) => x.post === message.id);
    if (raidObject === undefined) return;
    try {
      const activitiesArray = client.activities;
      let index = activitiesArray
        .map((x) => {
          return x.id;
        })
        .indexOf(activity.post);
      activitiesArray.splice(index, 1);
      await Activity.findOneAndDelete({ post: message.id });
    } catch (error) {
      console.log(error);
    }
  },
};
