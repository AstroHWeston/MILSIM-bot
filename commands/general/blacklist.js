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
                        .setDescription('Who are you unblacklisting?')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('reason')
                        .setDescription('Why is this user being unblacklisted?')
                        .setRequired(true)
                )
        ),

    async execute (interaction) {
        await interaction.deferReply()

        const discordId = interaction.options.getUser("user").id;
        const banReason = interaction.options.getString("reason");
        const approval = interaction.options.getString("approval");

        const permittedRoles = ['908762647527292959', '1030271767199101040', '1224496902632898681'];
        const canGlobalBan = interaction.member.roles.cache.hasAny(...permittedRoles);

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
            if (interaction.options.getSubcommand() === 'add') {
                let blacklistEmbed = new EmbedBuilder()
                    .setTitle("US Navy Moderation")
                    .setColor(Colors.Red)
                    .addFields(
                        { name: 'Responsible moderator', value: `<@${interaction.user.id}>`, inline: true },
                        { name: 'Approval', value: approval, inline: true }
                    )
                    .setFooter({ text: "Naval Moderation" })
                    .setTimestamp()

                const date = new Date();

                if (interaction.options.getString("type") === 't1') {
                    date.setMonth(date.getMonth() + 2);
                    const unixTimestamp = Math.floor(date.getTime() / 1000);
                    blacklistEmbed
                        .setDescription(`You have been **blacklisted** from the United States Navy. You may appeal this blacklist in 2 months (<t:${unixTimestamp}:D>) by joining the [USN Appeals Server](https://discord.gg/7TM4fe4Uxe). If you don't choose to appeal, you will be automatically unbanned on <t:${unixTimestamp + 2678400}:D>.`)
                        .addFields(
                            { name: 'Blacklist Tier', value: 'Tier 1', inline: true },
                            { name: 'Reason', value: banReason || "No Reason Provided.", inline: true },
                        )
                } else if (interaction.options.getString("type") === 't2') {
                    date.setMonth(date.getMonth() + 9);
                    const unixTimestamp = Math.floor(date.getTime() / 1000);
                    blacklistEmbed
                        .setDescription(`You have been **blacklisted** from the United States Navy. You may appeal this blacklist in 9 months (<t:${unixTimestamp}:D>) by joining the [USN Appeals Server](https://discord.gg/7TM4fe4Uxe). If you don't choose to appeal, you will be automatically unbanned on <t:${unixTimestamp + 8035200}:D>.`)
                        .addFields(
                            { name: 'Blacklist Tier', value: 'Tier 2', inline: true },
                            { name: 'Reason', value: banReason || "No Reason Provided.", inline: true },
                        )
                } else if (interaction.options.getString("type") === 't3') {
                    blacklistEmbed
                        .setDescription(`You have been **__permanently__ blacklisted** from the United States Navy. This blacklist is unappealable and the decision is final.`)
                        .addFields(
                            { name: 'Blacklist Tier', value: 'Tier 3', inline: true },
                            { name: 'Reason', value: banReason || "No Reason Provided.", inline: true },
                        )
                }
                const member = interaction.options.getMember("user");
                if (member?.roles.cache.hasAny(...permittedRoles)) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Error')
                                .setDescription('You cannot blacklist a member of OPNAV+.')
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
                if (member) {
                    await member.send({
                        embeds: [
                            blacklistEmbed
                        ]
                    })
                }

                const guilds = interaction.client.guilds.cache.values();
                const errors = [];
                for (const guild of guilds) {
                    if (guild.id === '1091013496096968704') continue;
                    try {
                        await guild.members.ban(discordId, {
                            reason: `Blacklisted by ${interaction.member.nickname} ==> ${banReason || "No Reason Provided."}`
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
                const guilds = interaction.client.guilds.cache.values();
                const errors = [];
                for (const guild of guilds) {
                    try {
                        await guild.members.unban(discordId, {
                            reason: `Unblacklisted by ${interaction.member.nickname} ==> ${banReason || "No Reason Provided."}`
                        });
                    } catch (err) {
                        errors.push(err);
                    }
                }
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Success')
                            .setDescription('User has been successfully unblacklisted.')
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
            }
        } catch (err) {
            console.log(err);
        }
    }
}
