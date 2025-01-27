const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const kharazad = require('../data/kharazad.json');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('kharazad')
        .setDescription('Informações de Refino de acessórios kharazad')
        .addStringOption(option =>
            option.setName('acessorio')
                .setDescription("Selecione o acessório")
                .setRequired(true)
                .addChoices(
                    { name: "Anel", value: "ring" },
                    { name: "Brinco", value: "earing" },
                    { name: "Cinto", value: "belt" },
                    { name: "Colar", value: "necklace" }
                ))
        .addStringOption(option =>
            option.setName('refino')
                .setDescription("Selecione o Refino")
                .setRequired(true)
                .addChoices(
                    { name: "BASE > PRI(I)", value: "base" },
                    { name: "PRI(I) > DUO(II)", value: "pri" },
                    { name: "DUO(II) > TRI(III)", value: "duo" },
                    { name: "TRI(III) > TET(IV)", value: "tri" },
                    { name: "TET(IV) > PEN(V)", value: "tet" },
                    { name: "PEN(V) > HEX(VI)", value: "pen" },
                    { name: "HEX(VI) > HEP(VII)", value: "hex" },
                    { name: "HEP(VII) > OCTA(VIII)", value: "hep" },
                    { name: "OCTA(VIII) > ENE(IX)", value: "octa" },
                    { name: "ENE(IX) > DEC(X)", value: "ene" }
                ))
        .addStringOption(option =>
            option.setName('fs')
                .setDescription("Digite o FS atual")
                .setRequired(false)),
    async execute(interaction) {
        let acc = interaction.options.getString('acessorio'),
            enhance = interaction.options.getString('refino'),
            fs = interaction.options.getString('fs');

        let percentage, actualPercentage;

        percentage = (kharazad[acc][enhance].initial + (kharazad[acc][enhance].recommended * kharazad[acc][enhance].add)).toFixed(4) + "%";

        const fields = [
            { name: 'PA +', value: (kharazad[acc][kharazad[acc][enhance].next].pa - kharazad[acc][enhance].pa).toString(), inline: true },
            { name: 'Crons', value: kharazad[acc][enhance].cron.toString(), inline: true },
            { name: 'FS Recomendado', value: kharazad[acc][enhance].recommended.toString(), inline: true },
            { name: 'Chance', value: percentage, inline: true },
            { name: 'Agris', value: kharazad[acc][enhance].agris.toString(), inline: true },
            { name: 'Madrugada Gastos', value: kharazad[acc][enhance].essence.toString(), inline: true },
        ];

        if (fs && Number(fs) > kharazad[acc][enhance].softcap) {
            let initial = kharazad[acc][enhance].initial,
                softcap = kharazad[acc][enhance].softcap,
                add = kharazad[acc][enhance].add,
                after_softcap = kharazad[acc][enhance].after_softcap,
                after = Number(fs) - softcap,
                percentage_softcap = initial + (softcap * add),
                percentage_after = (after * after_softcap);

            actualPercentage = (percentage_softcap + percentage_after).toFixed(4) + "%";
            fields.push({ name: 'Chance com FS', value: actualPercentage, inline: true });
            fields.push({ name: 'FS Atual', value: fs, inline: true });

        } else if (fs && Number(fs) <= kharazad[acc][enhance].softcap) {
            let actualPercentage = (kharazad[acc][enhance].initial + (Number(fs) * kharazad[acc][enhance].add)).toFixed(4) + "%";

            fields.push({ name: 'FS Atual', value: fs, inline: true });
            fields.push({ name: 'Chance com FS', value: actualPercentage, inline: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#F7A600')
            .setTitle('Informações de Refino')
            .setDescription('Aqui estão os dados de refino')
            .setImage(kharazad[acc][enhance].image)
            .addFields(fields)
            .setThumbnail('https://via.placeholder.com/100')
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};
