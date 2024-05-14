const { Events, EmbedBuilder, Colors} = require('discord.js');
const {setTimeout: wait} = require("node:timers/promises");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.log(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.log(error);

            const replied = interaction.replied
            const replyData = {
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Error')
                        .setDescription('There was an error while executing this command!')
                        .setColor(Colors.Red)
                        .setFooter({
                            text: `United States Navy.`,
                            iconURL: interaction.guild.iconURL()
                        })
                        .setTimestamp()
                ]
            }

            if (replied) {
                return interaction.editReply(replyData);
            } else {
                return interaction.reply(replyData);
            }
        }
    },
};
