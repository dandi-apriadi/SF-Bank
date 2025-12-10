import { Client, GatewayIntentBits, EmbedBuilder, REST, Routes } from 'discord.js';
import { Alliance } from '../models/allianceModel.js';
import MemberContribution from '../models/memberContributionModel.js';
import { User } from '../models/index.js';
import { Op } from 'sequelize';

class DiscordBot {
    constructor(token) {
        this.token = token;
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        });

        this.setupEventHandlers();
        this.registerCommands();
    }

    setupEventHandlers() {
        this.client.once('ready', () => {
            console.log(`✅ Discord Bot is ready! Logged in as ${this.client.user.tag}`);
            console.log(`📡 Bot is active in ${this.client.guilds.cache.size} server(s)`);
        });

        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            const { commandName } = interaction;

            try {
                if (commandName === 'bank-alliance') {
                    await this.handleBankAlliance(interaction);
                } else if (commandName === 'report-user') {
                    await this.handleReportUser(interaction);
                }
            } catch (error) {
                console.error('Error handling command:', error);
                const errorMessage = 'Terjadi kesalahan saat memproses command. Silakan coba lagi nanti.';
                
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: errorMessage, ephemeral: true });
                } else {
                    await interaction.reply({ content: errorMessage, ephemeral: true });
                }
            }
        });

        this.client.on('error', (error) => {
            console.error('Discord client error:', error);
        });
    }

    async registerCommands() {
        const commands = [
            {
                name: 'bank-alliance',
                description: 'Menampilkan daftar aliansi dengan informasi RSS bank',
            },
            {
                name: 'report-user',
                description: 'Menampilkan laporan lengkap kontribusi RSS user',
                options: [
                    {
                        name: 'user_id',
                        type: 4, // INTEGER
                        description: 'ID User yang ingin dilihat laporannya',
                        required: true,
                    }
                ]
            }
        ];

        const rest = new REST({ version: '10' }).setToken(this.token);

        try {
            console.log('🔄 Registering Discord slash commands...');
            
            await rest.put(
                Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
                { body: commands }
            );

            console.log('✅ Discord slash commands registered successfully!');
        } catch (error) {
            console.warn('⚠️  Failed to register Discord commands. Please check your DISCORD_TOKEN and DISCORD_CLIENT_ID.');
            throw error; // Re-throw to be caught by start() method
        }
    }

    async handleBankAlliance(interaction) {
        await interaction.deferReply();

        try {
            // Fetch all alliances
            const alliances = await Alliance.findAll({
                order: [['name', 'ASC']]
            });

            if (!alliances || alliances.length === 0) {
                return await interaction.editReply({
                    content: '❌ Tidak ada aliansi yang terdaftar di database.'
                });
            }

            // Calculate resources for each alliance
            const allianceData = await Promise.all(alliances.map(async (alliance) => {
                const contributions = await MemberContribution.findAll({
                    where: { alliance_id: alliance.id }
                });

                let totalFood = 0;
                let totalWood = 0;
                let totalStone = 0;
                let totalGold = 0;

                contributions.forEach(contrib => {
                    totalFood += parseInt(contrib.food) || 0;
                    totalWood += parseInt(contrib.wood) || 0;
                    totalStone += parseInt(contrib.stone) || 0;
                    totalGold += parseInt(contrib.gold) || 0;
                });

                const totalRss = totalFood + totalWood + totalStone + totalGold;
                const memberCount = await User.count({
                    where: { alliance_id: alliance.id }
                });

                return {
                    name: alliance.name,
                    tag: alliance.tag || 'N/A',
                    leader: alliance.leader || 'N/A',
                    members: memberCount,
                    food: totalFood,
                    wood: totalWood,
                    stone: totalStone,
                    gold: totalGold,
                    totalRss: totalRss
                };
            }));

            // Sort by total RSS descending
            allianceData.sort((a, b) => b.totalRss - a.totalRss);

            // Create embeds (Discord has a limit of 25 fields per embed)
            const embeds = [];
            const itemsPerEmbed = 10;

            for (let i = 0; i < allianceData.length; i += itemsPerEmbed) {
                const chunk = allianceData.slice(i, i + itemsPerEmbed);
                
                const embed = new EmbedBuilder()
                    .setColor('#FFD700') // Gold color for medieval theme
                    .setTitle(`🏰 Bank Alliance - Kingdom 3946 (${i + 1}-${Math.min(i + itemsPerEmbed, allianceData.length)} of ${allianceData.length})`)
                    .setDescription('Daftar aliansi dengan total RSS yang tersimpan di bank')
                    .setTimestamp()
                    .setFooter({ text: 'Kingdom 3946 Bank System' });

                chunk.forEach((alliance, index) => {
                    const rank = i + index + 1;
                    const rssFormatted = this.formatNumber(alliance.totalRss);
                    const foodFormatted = this.formatNumber(alliance.food);
                    const woodFormatted = this.formatNumber(alliance.wood);
                    const stoneFormatted = this.formatNumber(alliance.stone);
                    const goldFormatted = this.formatNumber(alliance.gold);

                    embed.addFields({
                        name: `${rank}. ${alliance.name} [${alliance.tag}]`,
                        value: `👑 Leader: ${alliance.leader}\n` +
                               `👥 Members: ${alliance.members}\n` +
                               `🌾 Food: ${foodFormatted}\n` +
                               `🪵 Wood: ${woodFormatted}\n` +
                               `🪨 Stone: ${stoneFormatted}\n` +
                               `💰 Gold: ${goldFormatted}\n` +
                               `📊 **Total RSS: ${rssFormatted}**`,
                        inline: false
                    });
                });

                embeds.push(embed);
            }

            // Send first embed
            await interaction.editReply({ embeds: [embeds[0]] });

            // Send additional embeds as follow-ups if needed
            for (let i = 1; i < embeds.length; i++) {
                await interaction.followUp({ embeds: [embeds[i]] });
            }

        } catch (error) {
            console.error('Error in handleBankAlliance:', error);
            await interaction.editReply({
                content: '❌ Terjadi kesalahan saat mengambil data aliansi.'
            });
        }
    }

    async handleReportUser(interaction) {
        await interaction.deferReply();

        try {
            const userId = interaction.options.getInteger('user_id');

            // Fetch user data
            const user = await User.findByPk(userId, {
                attributes: ['id', 'name', 'email', 'role', 'alliance_id']
            });

            if (!user) {
                return await interaction.editReply({
                    content: `❌ User dengan ID **${userId}** tidak ditemukan di database.`
                });
            }

            // Fetch user's alliance
            let allianceName = 'Belum bergabung alliance';
            if (user.alliance_id) {
                const alliance = await Alliance.findByPk(user.alliance_id);
                if (alliance) {
                    allianceName = `${alliance.name} [${alliance.tag || 'N/A'}]`;
                }
            }

            // Fetch all contributions from this user
            const contributions = await MemberContribution.findAll({
                where: { member_id: userId },
                order: [['week', 'ASC']]
            });

            if (!contributions || contributions.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#FF6347') // Tomato red for no data
                    .setTitle(`📊 Report User - ${user.name}`)
                    .setDescription('User ini belum memiliki riwayat kontribusi RSS.')
                    .addFields(
                        { name: '👤 User ID', value: `${user.id}`, inline: true },
                        { name: '📧 Email', value: user.email || 'N/A', inline: true },
                        { name: '🏰 Alliance', value: allianceName, inline: false }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Kingdom 3946 Bank System' });

                return await interaction.editReply({ embeds: [embed] });
            }

            // Calculate totals
            let totalFood = 0;
            let totalWood = 0;
            let totalStone = 0;
            let totalGold = 0;
            let totalRss = 0;

            contributions.forEach(contrib => {
                totalFood += parseInt(contrib.food) || 0;
                totalWood += parseInt(contrib.wood) || 0;
                totalStone += parseInt(contrib.stone) || 0;
                totalGold += parseInt(contrib.gold) || 0;
                totalRss += parseInt(contrib.total_rss) || 0;
            });

            // Create main embed
            const mainEmbed = new EmbedBuilder()
                .setColor('#4169E1') // Royal blue for user report
                .setTitle(`📊 Report User - ${user.name}`)
                .setDescription(`Laporan lengkap kontribusi RSS dari **${user.name}**`)
                .addFields(
                    { name: '👤 User ID', value: `${user.id}`, inline: true },
                    { name: '📧 Email', value: user.email || 'N/A', inline: true },
                    { name: '🏰 Alliance', value: allianceName, inline: false },
                    { name: '📅 Total Weeks', value: `${contributions.length} week(s)`, inline: true },
                    { name: '🎯 Role', value: user.role || 'Member', inline: true },
                    { name: '\u200B', value: '\u200B', inline: false }, // Spacer
                    { name: '📊 **TOTAL KONTRIBUSI**', value: '\u200B', inline: false },
                    { name: '🌾 Total Food', value: this.formatNumber(totalFood), inline: true },
                    { name: '🪵 Total Wood', value: this.formatNumber(totalWood), inline: true },
                    { name: '🪨 Total Stone', value: this.formatNumber(totalStone), inline: true },
                    { name: '💰 Total Gold', value: this.formatNumber(totalGold), inline: true },
                    { name: '📈 **Grand Total RSS**', value: `**${this.formatNumber(totalRss)}**`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Kingdom 3946 Bank System' });

            await interaction.editReply({ embeds: [mainEmbed] });

            // Create detailed weekly breakdown (if there are contributions)
            if (contributions.length > 0) {
                const detailEmbeds = [];
                const weeksPerEmbed = 10;

                for (let i = 0; i < contributions.length; i += weeksPerEmbed) {
                    const chunk = contributions.slice(i, i + weeksPerEmbed);
                    
                    const detailEmbed = new EmbedBuilder()
                        .setColor('#9370DB') // Medium purple for details
                        .setTitle(`📅 Weekly Breakdown (Week ${chunk[0].week}-${chunk[chunk.length - 1].week})`)
                        .setDescription(`Detail kontribusi per minggu untuk **${user.name}**`);

                    chunk.forEach(contrib => {
                        const weekRss = parseInt(contrib.total_rss) || 0;
                        detailEmbed.addFields({
                            name: `Week ${contrib.week} - ${contrib.date}`,
                            value: `🌾 Food: ${this.formatNumber(contrib.food)}\n` +
                                   `🪵 Wood: ${this.formatNumber(contrib.wood)}\n` +
                                   `🪨 Stone: ${this.formatNumber(contrib.stone)}\n` +
                                   `💰 Gold: ${this.formatNumber(contrib.gold)}\n` +
                                   `📊 Total: **${this.formatNumber(weekRss)}**`,
                            inline: true
                        });
                    });

                    detailEmbeds.push(detailEmbed);
                }

                // Send detail embeds
                for (const embed of detailEmbeds) {
                    await interaction.followUp({ embeds: [embed] });
                }
            }

        } catch (error) {
            console.error('Error in handleReportUser:', error);
            await interaction.editReply({
                content: '❌ Terjadi kesalahan saat mengambil data user.'
            });
        }
    }

    formatNumber(num) {
        if (!num || num === 0) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    async start() {
        try {
            await this.client.login(this.token);
            console.log('🚀 Discord Bot started successfully!');
        } catch (error) {
            console.error('❌ Failed to start Discord Bot:', error);
            throw error;
        }
    }

    async stop() {
        try {
            this.client.destroy();
            console.log('🛑 Discord Bot stopped successfully!');
        } catch (error) {
            console.error('❌ Failed to stop Discord Bot:', error);
            throw error;
        }
    }
}

export default DiscordBot;
