require('dotenv').config();
const { REST, Routes } = require('discord.js');
Routes.applicationGuildCommands(process.env.CLIENT_ID, '1290012219085557853')

const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🚀 Deploying application (/) commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID), // Use this for global commands
            { body: commands }
        );
        console.log('✅ Successfully registered slash commands.');
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
})();
