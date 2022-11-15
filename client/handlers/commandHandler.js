const fs = require("node:fs");
const path = require("node:path");
const AsciiTable = require("ascii-table");

module.exports = async (client) => {
  const table = new AsciiTable("Commands").setHeading("", "Commands", "Status");
  let index = 1;
  // Defining the Path for the command folder
  const commandsPath = path.join(__dirname, "../../commands");
  // Loading all files within the command folder that end with .js
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  // Looping through every file and appending it to the client.command Collection
  for (const file of commandFiles) {
    try {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      client.commands.set(command.data.name, command);
      table.addRow(index, command.data.name, "✔");
      index += 1;
    } catch (error) {
      table.addRow(index, command.data.name, "❌");
      index += 1;
    }
  }

  console.log(table.toString());
};
