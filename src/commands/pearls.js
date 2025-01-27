const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

// Função de scraping usando Axios e Regex
async function scrapeMarketData(volume) {
    try {
        // Fazendo a requisição à API
        const response = await axios.get(
            `https://apiv2.bdolytics.com/pt/SA/market/pearl-items?page=1&sort=${volume}`
        );

        // Extraindo os dados da resposta
        const items = response.data.data; // Supondo que os dados estejam no campo `data`

        // Pegando apenas os 10 primeiros e extraindo a propriedade `one_day_volume`
        const top10Volumes = items.slice(0, 10).map(item => ({
            name: item.name,
            volume: item[volume.split("_asc")[0]].toString(),
        }));
        console.log(top10Volumes)

        return top10Volumes
    } catch (error) {
        console.error('Erro ao buscar os dados:', error.message);
        return []
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pearls')
        .setDescription('Itens de Pérola mais vendidos!')
        .addStringOption(option =>
            option.setName('volume')
                .setDescription("Selecione o acessório")
                .setRequired(true)
                .addChoices(
                    { name: "24h", value: "one_day_volume_asc" },
                    { name: "Sete Dias", value: "seven_day_volume_asc" },
                    { name: "14 dias", value: "fourteen_day_volume_asc" },
                )),

    execute: async (interaction) => {
        // Fazendo o scraping
        let volume = interaction.options.getString('volume');
        const items = await scrapeMarketData(volume);
        let description;

        if (items.length === 0) {
            return message.channel.send('Não consegui encontrar itens. Tente novamente mais tarde.');
        }

        // Criando o conteúdo do Embed com os itens coletados
        const fields = items.map(item => ({ name: item.name, value: item.volume, inline: false }));

        switch (volume) {
            case "one_day_volume_asc":
                description = 'Itens de Pérola mais vendidos nas últimas 24 horas.';
                break;
            case "seven_day_volume_asc":
                description = 'Itens de Pérola mais vendidos nos últimos 7 dias.';
                break;
            case "fourteen_day_volume_asc":
                description = 'Itens de Pérola mais vendidos nos últimos 14 dias.';
                break;
        }

        // Construindo o Embed com os itens
        const embed = new EmbedBuilder()
            .setColor('#F7A600')
            .setTitle('Itens de Pérola Mais Vendidos')
            .setDescription(description)
            .addFields(fields)
            .setThumbnail('https://via.placeholder.com/100')
            .setTimestamp();

        // Enviando o Embed para o canal
        interaction.reply({ embeds: [embed] });
    },
};
