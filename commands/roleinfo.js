const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Shows information about a specific role')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to get info about')
                .setRequired(true)
        ),
    prefix: 'roleinfo',
    async execute(interactionOrMessage, args) {
        let role;

        // Handle Slash Command
        if (interactionOrMessage.isCommand && interactionOrMessage.options) {
            role = interactionOrMessage.options.getRole('role');
        } 
        // Handle Prefix Command
        else {
            if (!args.length) return interactionOrMessage.reply('❌ Please mention a role or provide its ID!');
            role = interactionOrMessage.guild.roles.cache.find(r => r.id === args[0] || r.name.toLowerCase() === args.join(' ').toLowerCase());
        }

        if (!role) return interactionOrMessage.reply('❌ Role not found!');

        // Get members with this role
        const membersWithRole = interactionOrMessage.guild.members.cache.filter(member => member.roles.cache.has(role.id));

        // Dangerous permissions to check
        const dangerousPerms = [
            PermissionsBitField.Flags.Administrator,
            PermissionsBitField.Flags.ManageGuild,
            PermissionsBitField.Flags.ManageRoles,
            PermissionsBitField.Flags.ManageChannels,
            PermissionsBitField.Flags.BanMembers,
            PermissionsBitField.Flags.KickMembers,
            PermissionsBitField.Flags.MentionEveryone
        ];

        // Get members with dangerous permissions
        const dangerousUsers = membersWithRole.filter(member =>
            member.permissions.has(dangerousPerms)
        );

        // Create embed
        const roleEmbed = new EmbedBuilder()
            .setColor(role.color || 'Random')
            .setTitle(`Role Info: ${role.name}`)
            .addFields(
                { name: '<:MGB_username:1335169837634162800> Role ID', value: role.id, inline: true },
                { name: '<:username15:1335169984720011298> Members', value: `${membersWithRole.size}`, inline: true },
                { name: '<a:a:1315183641500057601> Color', value: role.hexColor, inline: true },
                { name: '<:created:1335169299354226759> Created On', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:F>`, inline: true },
                { name: '🔒 Dangerous Users', value: dangerousUsers.size > 0 ? dangerousUsers.map(m => `- ${m.user.tag}`).join('\n') : '✅ No dangerous users found!', inline: false }
            )
            .setFooter({ text: `Requested by ${interactionOrMessage.user?.username || interactionOrMessage.author.username}`, iconURL: interactionOrMessage.user?.displayAvatarURL() || interactionOrMessage.author.displayAvatarURL() })
            .setTimestamp();

        await interactionOrMessage.reply({ embeds: [roleEmbed] });
    }
};
