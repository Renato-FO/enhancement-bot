const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('data')
        .setDescription('Itens de Pérola!'),
    execute(message) {
        const embed = new EmbedBuilder()
            .setColor('#F7A600')
            .setTitle('Dados do Dia')
            .setDescription('Aqui estão os dados mais recentes coletados pelo bot.')
            .addFields(
                { name: 'Dado 1', value: 'Valor 1', inline: true },
                { name: 'Dado 2', value: 'Valor 2', inline: true },
            )
            .setThumbnail('https://via.placeholder.com/100')
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
