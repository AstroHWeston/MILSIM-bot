const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        //client.user.setAvatar('https://cdn.discordapp.com/attachments/1215312117792505868/1215320301248708608/flustered-cute-furry-femboy-uwu-owo.gif?ex=65fc523b&is=65e9dd3b&hm=8e334e454b700b5d796096989d1004b89a71c3a95d3c06ce89601c63b2f8e824&');
        client.user.setStatus('idle');
        client.user.setActivity({
            name: 'with your emotions.',
            type: ActivityType.Playing,
        })
    },
};
