const fs = require("node:fs");
const path = require("node:path");
const AsciiTable = require("ascii-table");

module.exports = async (client) => {
  const table = new AsciiTable("Events").setHeading("", "Event", "Status");
  // defining the path for the event Folder
  const eventsPath = path.join(__dirname, "../../events");
  // Loading all files within the event folder that end with .js
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));
  let index = 1;
  // Looping through every file  and appending it
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    try {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
      table.addRow(index, event.name, "✔");
      index += 1;
    } catch (err) {
      console.log(err);
      table.addRow(index, event.name, "❌");
      index += 1;
    }
  }

  console.log(table.toString());
};
