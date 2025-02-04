const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const tabelaDevoracoes = [
    { min: 100, max: 105, valor: 15 },
    { min: 106, max: 109, valor: 14 },
    { min: 110, max: 116, valor: 13 },
    { min: 117, max: 121, valor: 12 },
    { min: 122, max: 129, valor: 11 },
    { min: 130, max: 139, valor: 10 },
    { min: 140, max: 151, valor: 9 },
    { min: 152, max: 164, valor: 8 },
    { min: 165, max: 183, valor: 7 },
    { min: 184, max: 198, valor: 6 },
    { min: 199, max: 218, valor: 5 },
    { min: 219, max: 249, valor: 4 },
    { min: 250, max: 279, valor: 3 },
    { min: 280, max: 298, valor: 2 },
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

        // Modo normal: Calcula devorações para atingir o FS desejado
        while (fs < fsDesejado) {
            const devoracao = tabelaDevoracoes.find(range => fs >= range.min && fs <= range.max);
            if (!devoracao) break;

            fs += devoracao.valor;
            totalDevoracoes++;
        }

        // Se o usuário informou devorações que possui, calcula até onde chega
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
