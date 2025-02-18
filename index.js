const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const { filterMessage } = require('./messageFilter'); 

// Initialize the bot client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data && command.execute) {
        client.commands.set(command.data.name, command); // Slash commands
    }
    if (command.prefix) {
        client.commands.set(command.prefix, command); // Prefix commands
    }
}

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    // Set presence to "Playing Unknown"
    client.user.setPresence({
        activities: [{ name: 'Unknown', type: 0 }], // type: 0 = Playing
        status: 'idle' // Can be 'online', 'dnd', 'idle', or 'invisible'
    });

    console.log('🎮 Presence set to Playing Unknown');
});

// Slash command handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ There was an error executing this command.', ephemeral: true });
    }
});

// Prefix command handler
client.on('messageCreate', async message => {
    if (!message.content.startsWith('=') || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('❌ There was an error executing this command.');
    }
});

// Message filter for blacklisted words
client.on('messageCreate', async message => {
    filterMessage(message);
});

client.login(process.env.TOKEN);
