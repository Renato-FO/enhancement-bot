const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sovereign = require('../data/sovereign.json');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('soberana')
        .setDescription('Informações de Refino de armas Soberana')
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
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('cron')
                .setDescription("A cron foi comprada no ferreiro?")
                .setRequired(false)
        ),
    async execute(interaction) {
        let enhance = interaction.options.getString('refino'),
            fs = interaction.options.getString('fs'),
            cron = interaction.options.getBoolean('cron');

        let percentage, actualPercentage;

        percentage = (sovereign[enhance].initial + (sovereign[enhance].recommended * sovereign[enhance].add)).toFixed(4) + "%";

        const fields = [
            { name: 'PA +', value: (sovereign[sovereign[enhance].next].pa - sovereign[enhance].pa).toString(), inline: true },
            { name: 'Crons', value: sovereign[enhance].cron.toString(), inline: true },
            { name: 'FS Recomendado', value: sovereign[enhance].recommended.toString(), inline: true },
            { name: 'Chance', value: percentage, inline: true },
            { name: 'Agris', value: sovereign[enhance].agris.toString(), inline: true }
        ];


        if (cron !== null) {
            let cost = cron === true ? (sovereign[enhance].cron * 3000000) : (sovereign[enhance].cron * 2231481);
            let stone = 75000000

            fields.push({ name: 'Custo Cron', value: cost.toString(), inline: true });
            fields.push({ name: 'Custo Pedra', value: stone.toString(), inline: true });
            fields.push({ name: 'Custo Total', value: (cost + stone).toString(), inline: true });
        }

        if (fs && Number(fs) > sovereign[enhance].softcap) {
            let initial = sovereign[enhance].initial,
                softcap = sovereign[enhance].softcap,
                add = sovereign[enhance].add,
                after_softcap = sovereign[enhance].after_softcap,
                after = Number(fs) - softcap,
                percentage_softcap = initial + (softcap * add),
                percentage_after = (after * after_softcap),
                average;

            actualPercentage = (percentage_softcap + percentage_after).toFixed(4) + "%";
            average = (((sovereign[enhance].initial + (Number(fs) * sovereign[enhance].add))) / 100)
            average = Math.ceil(1 / average);

            fields.push({ name: 'FS Atual', value: fs, inline: true });
            fields.push({ name: 'Chance com FS', value: actualPercentage, inline: true });
            fields.push({ name: 'Média de Clicks', value: average, inline: true });

        } else if (fs && Number(fs) <= sovereign[enhance].softcap) {
            let average;
            let actualPercentage = (sovereign[enhance].initial + (Number(fs) * sovereign[enhance].add)).toFixed(4) + "%";
            average = (((sovereign[enhance].initial + (Number(fs) * sovereign[enhance].add))) / 100)
            average = Math.ceil(1 / average).toString();

            fields.push({ name: 'FS Atual', value: fs, inline: true });
            fields.push({ name: 'Chance com FS', value: actualPercentage, inline: true });
            fields.push({ name: 'Média de Clicks', value: average, inline: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#F7A600')
            .setTitle('Informações de Refino')
            .setDescription('Aqui estão os dados de refino')
            .setImage(sovereign[enhance].image)
            .addFields(fields)
            .setThumbnail('https://via.placeholder.com/100')
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};
