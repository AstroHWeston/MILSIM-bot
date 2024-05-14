const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Bans a user from all US Navy servers.')
        .addSubcommand(subcommands =>
        subcommands
            .setName('add')
            .setDescription('Adds the user to the ban list for every navy server.')
            .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Who are you blacklisting?')
                .setRequired(true)
            )
            .addStringOption(option =>
            option
                .setName('type')
                .setDescription('What type of blacklist are you issuing?')
                .addChoices(
                    { name: 'Tier 1 Blacklist', value: 't1' },
                    { name: 'Tier 2 Blacklist', value: 't2' },
                    { name: 'Tier 3 Blacklist', value: 't3' }
                )
                .setRequired(true)
            )
            .addStringOption(option =>
                option
                .setName('reason')
                .setDescription('Why are you crossbanning this user?')
                .setRequired(true)
            )
            .addStringOption(option =>
            option
                .setName('approval')
                .setDescription('Who approved this blacklist?')
                .setRequired(true)
            )
            .addStringOption(option =>
                option
                    .setName('evidence')
                    .setDescription('Any supporting evidence to this blacklist.')
            )
        )
        .addSubcommand(subcommands =>
            subcommands
                .setName('remove')
                .setDescription('Unbans a user from all US Navy related servers.')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('Who are you unbanning?')
                        .setRequired(true)
                )
        ),

    async execute (interaction) {
        await interaction.deferReply()

        const discordId = interaction.options.getUser("user").id;
        const banReason = interaction.options.getString("reason");

        const permittedRoles = [];
        const canGlobalBan = interaction.user.id === '1071373709157351464';

        if (!canGlobalBan) {
            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription('You do not have permission to use this command.')
                        .setColor(Colors.Red)
                        .setFooter({
                            text: `United States Navy.`,
                            iconURL: interaction.guild.iconURL()
                        })
                        .setTimestamp()
                ]
            })
            return;
        }

        try {
            const member = await interaction.guild.members.fetch(discordId);
            const roles = member.roles.cache;
            roles.forEach(role => {
                permittedRoles.push(role.id);
            });

            if (permittedRoles.includes('1235067095687893102')) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Error')
                            .setDescription('You cannot ban a staff member.')
                            .setColor(Colors.Red)
                            .setFooter({
                                text: `United States Navy.`,
                                iconURL: interaction.guild.iconURL()
                            })
                            .setTimestamp()
                    ]
                })
                return;
            }

            if (interaction.options.getSubcommand() === 'add') {
                if (member) {
                    await member.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("US Navy Moderation")
                                .setDescription('You have been **globally banned** from all United States Navy servers.')
                                .setColor(Colors.Red)
                                .addFields(
                                    { name: 'Responsible moderator', value: `<@${interaction.user.id}>` },
                                    { name: 'Reason', value: banReason || "No Reason Provided." }
                                )
                                .setFooter({ text: "Naval Moderation" })
                                .setTimestamp()
                        ]
                    })
                }

                const guilds = interaction.client.guilds.cache.values();
                const errors = [];
                for (const guild of guilds) {
                    try {
                        await guild.members.ban(discordId, {
                            reason: `Crossbanned by ${interaction.member.nickname} ==> ${banReason || "No Reason Provided."}`
                        });
                    } catch (err) {
                        errors.push(err);
                    }
                }
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Success')
                            .setDescription(`<@${discordId}> (${discordId}) has been **globally banned** from all United States Navy servers.`)
                            .setColor(Colors.Green)
                            .addFields(
                                { name: "Reason", value: banReason || "No Reason Provided." },
                                { name: "Errors", value: errors.length > 0 && errors.join(",\n") || "None" }
                            )
                            .setFooter({
                                text: `United States Navy.`,
                                iconURL: interaction.guild.iconURL()
                            })
                            .setTimestamp()
                    ]
                })
            } else if (interaction.options.getSubcommand() === 'remove') {
                await interaction.guild.members.unban(discordId);
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Success')
                            .setDescription('User has been successfully unbanned.')
                            .setColor(Colors.Green)
                            .setFooter({
                                text: `United States Navy.`,
                                iconURL: interaction.guild.iconURL()
                            })
                            .setTimestamp()
                    ]
                })
            }
        } catch (err) {
            console.log(err);
        }
    }
}
