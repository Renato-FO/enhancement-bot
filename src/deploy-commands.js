const { REST, Routes } = require("discord.js")
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')


dotenv.config()
const commands = []
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
const token = process.env.BOT_TOKEN
const clientId = process.env.CLIENT_ID

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON())
}

const rest = new REST({ version: '10' }).setToken(token);

(
  async () => {
    try {
      console.log(`Started Refreshing application (/) commands...`)
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );

      console.log('Successfully reloaded application (/) commands ✔️')
    } catch (error) {
      console.error(error)
    }
  }
)();