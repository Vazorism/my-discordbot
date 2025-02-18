const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('freaky')
        .setDescription("Shows a user's avatar")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to get avatar of')
                .setRequired(false)
        ),
    prefix: 'freaky',
    async execute(interactionOrMessage, args) {
        let user;

        // Handle slash command
        if (interactionOrMessage.isCommand && interactionOrMessage.options) {
            user = interactionOrMessage.options.getUser('user') || interactionOrMessage.user;
        } else {
            user = args.length ? interactionOrMessage.mentions.users.first() || 
                   interactionOrMessage.client.users.cache.get(args[0]) : 
                   interactionOrMessage.author;
        }

        if (!user) return interactionOrMessage.reply('❌ User not found!');

        const avatarEmbed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setFooter({ text: `Requested by ${interactionOrMessage.user?.username || interactionOrMessage.author.username}`, iconURL: interactionOrMessage.user?.displayAvatarURL() || interactionOrMessage.author.displayAvatarURL() })
            .setTimestamp();

        await interactionOrMessage.reply({ embeds: [avatarEmbed] });
    }
};
