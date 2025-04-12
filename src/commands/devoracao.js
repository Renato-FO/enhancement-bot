const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const tabelaDevoracoes = [
    { min: 100, max: 101, valor: 26 },
    { min: 102, max: 105, valor: 25 },
    { min: 106, max: 108, valor: 24 },
    { min: 109, max: 111, valor: 23 },
    { min: 112, max: 115, valor: 22 },
    { min: 116, max: 119, valor: 21 },
    { min: 120, max: 124, valor: 20 },
    { min: 125, max: 129, valor: 19 },
    { min: 130, max: 135, valor: 18 },
    { min: 136, max: 141, valor: 17 },
    { min: 142, max: 148, valor: 16 },
    { min: 149, max: 156, valor: 15 },
    { min: 157, max: 165, valor: 14 },
    { min: 166, max: 175, valor: 13 },
    { min: 176, max: 187, valor: 12 },
    { min: 188, max: 196, valor: 11 },
    { min: 197, max: 206, valor: 10 },
    { min: 207, max: 217, valor: 9 },
    { min: 218, max: 235, valor: 8 },
    { min: 236, max: 254, valor: 7 },
    { min: 255, max: 269, valor: 6 },
    { min: 270, max: 291, valor: 5 },
    { min: 292, max: 296, valor: 4 },
    { min: 297, max: 297, valor: 3 },
    { min: 298, max: 298, valor: 2 },
    { min: 299, max: 299, valor: 1 },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('devoracao')
        .setDescription('Calcula a quantidade de devorações necessárias para alcançar um FS desejado.')
        .addIntegerOption(option =>
            option.setName('fs_atual')
                .setDescription('Failstack atual')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('fs_desejado')
                .setDescription('Failstack desejado')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('devoracoes_possui')
                .setDescription('Quantidade de devorações que possui')
                .setRequired(false)),

    async execute(interaction) {
        const fsAtual = interaction.options.getInteger('fs_atual');
        const fsDesejado = interaction.options.getInteger('fs_desejado');
        const devoracoesPossui = interaction.options.getInteger('devoracoes_possui') || null;

        if (fsDesejado <= fsAtual) {
            return interaction.reply({ content: 'O FS desejado deve ser maior que o atual.', ephemeral: true });
        }

        let totalDevoracoes = 0;
        let fs = fsAtual;

        while (fs < fsDesejado) {
            const devoracao = tabelaDevoracoes.find(range => fs >= range.min && fs <= range.max);
            if (!devoracao) break;

            fs += devoracao.valor;
            totalDevoracoes++;
        }

        let fsComDevoracoes = fsAtual;
        if (devoracoesPossui !== null) {
            let devoracoesUsadas = 0;
            while (devoracoesUsadas < devoracoesPossui) {
                const devoracao = tabelaDevoracoes.find(range => fsComDevoracoes >= range.min && fsComDevoracoes <= range.max);
                if (!devoracao) break;

                fsComDevoracoes += devoracao.valor;
                devoracoesUsadas++;
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#F7A600')
            .setTitle('Cálculo de Devorações')
            .setDescription(`Para ir de **${fsAtual} FS** para **${fsDesejado} FS**, você precisará de:`)
            .addFields({ name: 'Total de Devorações', value: `${totalDevoracoes}`, inline: true })
            .setThumbnail('https://via.placeholder.com/100')
            .setTimestamp();

        if (devoracoesPossui !== null) {
            embed.addFields({ name: `FS que pode alcançar`, value: `${fsComDevoracoes}`, inline: true });
        }

        return interaction.reply({ embeds: [embed] });
    },
};
