const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const os = require("node:os");
const moment = require('moment');
require('moment-duration-format');
const child_process = require("node:child_process");

function formatDuration(duration) {
    return moment.duration(duration).format("d[ Days]・h[ Hrs]・m[ Mins]・s[ Secs]");
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Shows information about the bot.'),

    async execute(interaction) {
        const client = interaction.client;

        let gitHash = "unknown";
        try {
            gitHash = child_process
                .execSync("git rev-parse HEAD")
                .toString()
                .trim();
        } catch (e) {
            gitHash = "unknown";
        }

        const statsEmbed = new EmbedBuilder()
            .setTitle(`USN Supercomputer Information`)
            .setColor(Colors.Green)
            .setDescription(`This bot was created by <@1071373709157351464>. If you have any questions or concerns, please contact AstroHWeston!`)
            .setFields([
                {
                    name: "General Stats",
                    value: `\`\`\`yml\nName: ${client.user.tag}\nID: ${client.user.id}\`\`\``,
                    inline: true,
                },
                {
                    name: "Bot Stats",
                    value: `\`\`\`yml\nGuilds: ${client.guilds.cache.size}\nUptime: ${formatDuration(client.uptime)}\nNodeJS: ${process.version}\nMemory Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`\`\``,
                    inline: true,
                },
                {
                    name: "System Stats",
                    value: `\`\`\`yml\nOS: ${os.platform() + " " + os.release()}\nArch: ${os.machine()}\nUptime: ${formatDuration(os.uptime() * 1000)}\n\`\`\``,
                    inline: false,
                },
                {
                    name: "Build Stats",
                    value: `\`\`\`yml\nMainframe: v1.0.0\nBuild: ${gitHash}\n\`\`\``,
                    inline: false,
                },
            ])
            .setTimestamp()
            .setFooter({text: `Supercomputer Information`});
        await interaction.reply({
            embeds: [
                statsEmbed
            ],
        })
    }
}
