const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with the heart beat!'),
    async execute(interaction) {
        const embed = new EmbedBuilder().setDescription("`Pinging...`").setColor(Colors.Blue);
        const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
        const timestamp = interaction.createdTimestamp;
        const latency = `\`\`\`ini\n[ ${Math.floor(msg.createdTimestamp - timestamp)}ms ]\`\`\``;
        const apiLatency = `\`\`\`ini\n[ ${Math.round(interaction.client.ws.ping)}ms ]\`\`\``;
        embed
            .setTitle(`Pong! 🏓`)
            .setDescription(null)
            .addFields([
                { name: "Latency", value: latency, inline: true },
                { name: "API Latency", value: apiLatency, inline: true },
            ])
            .setTimestamp()
            .setFooter({ text: "USN API" });
        await msg.edit({ embeds: [embed] });
    }
};
