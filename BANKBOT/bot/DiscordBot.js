import { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, AttachmentBuilder } from 'discord.js';
import { Op } from 'sequelize';
import Alliance from '../models/Alliance.js';
import MemberContribution from '../models/MemberContribution.js';
import User from '../models/User.js';
import { generateBankRankReport, generateUserDetailReport } from '../utils/excelReportGenerator.js';

class DiscordBot {
    constructor(token, clientId) {
        this.token = token;
        this.clientId = clientId;
        this.isTestMode = process.env.BOT_TEST_MODE === 'true';
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        });

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.client.once('ready', () => {
            console.log(`✅ Discord Bot is ready! Logged in as ${this.client.user.tag}`);
            console.log(`📡 Bot is active in ${this.client.guilds.cache.size} server(s)`);
            console.log(`🎮 Commands available: /bank-alliance, /report-user, /bank-rank, /download-report`);
        });

        this.client.on('interactionCreate', async (interaction) => {
            // Handle autocomplete interactions
            if (interaction.isAutocomplete()) {
                const { commandName, options } = interaction;

                if (commandName === 'report-user') {
                    const focusedValue = options.getFocused(true);
                    if (focusedValue.name === 'username') {
                        try {
                            const choices = await this.getUsernameChoices(focusedValue.value);
                            await interaction.respond(choices);
                        } catch (error) {
                            console.error('Error handling autocomplete:', error);
                            await interaction.respond([]);
                        }
                    }
                }
                return;
            }

            if (!interaction.isChatInputCommand()) return;

            const { commandName } = interaction;

            try {
                if (commandName === 'bank-alliance') {
                    await this.handleBankAlliance(interaction);
                } else if (commandName === 'report-user') {
                    await this.handleReportUser(interaction);
                } else if (commandName === 'bank-rank') {
                    await this.handleBankRank(interaction);
                } else if (commandName === 'download-report') {
                    await this.handleDownloadReport(interaction);
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

    async getBankChoices() {
        try {
            // Fetch all alliances from database
            const alliances = await Alliance.findAll({
                attributes: ['name', 'tag', 'bank_name'],
                raw: true,
                limit: 25 // Discord max 25 choices
            });

            if (alliances && alliances.length > 0) {
                // Use bank_name if available, otherwise use alliance name
                const bankChoices = alliances.map(alliance => {
                    const displayName = alliance.bank_name || alliance.name;
                    const displayTag = alliance.tag ? ` [${alliance.tag}]` : '';
                    return {
                        name: `${displayName}${displayTag}`,
                        value: displayName
                    };
                });

                // Remove duplicates based on value
                const uniqueBanks = bankChoices.filter((bank, index, self) =>
                    index === self.findIndex((b) => b.value === bank.value)
                );

                return uniqueBanks;
            }

            // Fallback jika tidak ada alliance di database
            return [
                { name: 'Kingdom Bank', value: 'Kingdom Bank' },
                { name: 'Alliance Bank', value: 'Alliance Bank' },
                { name: 'General Bank', value: 'General Bank' }
            ];
        } catch (error) {
            console.error('Error fetching bank choices:', error);
            // Fallback options
            return [
                { name: 'Kingdom Bank', value: 'Kingdom Bank' },
                { name: 'Alliance Bank', value: 'Alliance Bank' }
            ];
        }
    }

    async getUsernameChoices(searchQuery = '') {
        try {
            // Query database untuk usernames (name column) yang match dengan search query
            const users = await User.findAll({
                attributes: ['id', 'name'],
                where: searchQuery ? {
                    name: {
                        [Op.like]: `%${searchQuery}%`
                    }
                } : {},
                order: [['name', 'ASC']],
                limit: 25, // Discord max 25 choices
                raw: true
            });

            if (!users || users.length === 0) {
                return [];
            }

            // Format untuk Discord autocomplete - show username dengan ID
            return users.map(user => ({
                name: user.name.length > 90 ? user.name.substring(0, 87) + '...' : user.name, // Discord max 100 chars
                value: user.name // Use username as value
            }));
        } catch (error) {
            console.error('Error fetching username choices:', error);
            return [];
        }
    }

    async registerCommands() {
        // Get dynamic bank choices from database
        const bankChoices = await this.getBankChoices();
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
                        name: 'username',
                        type: 3, // STRING (autocomplete akan handle ini)
                        description: 'Username atau nama user yang ingin dilihat laporannya',
                        required: true,
                        autocomplete: true
                    }
                ]
            },
            {
                name: 'bank-rank',
                description: 'Menampilkan 10 user dengan donasi RSS terbanyak (Leaderboard)',
            },
            {
                name: 'download-report',
                description: 'Download laporan bank dalam format Excel',
                options: [
                    {
                        name: 'bank_name',
                        type: 3, // STRING
                        description: 'Pilih nama bank yang terdaftar',
                        required: true,
                        choices: bankChoices
                    }
                ]
            }
        ];

        // Skip command registration in test mode
        if (this.isTestMode) {
            console.log('⏭️  TEST MODE: Skipping slash command registration');
            return;
        }

        const rest = new REST({ version: '10' }).setToken(this.token);

        try {
            console.log('🔄 Registering Discord slash commands...');
            
            await rest.put(
                Routes.applicationCommands(this.clientId),
                { body: commands }
            );

            console.log('✅ Discord slash commands registered successfully!');
            console.log(`📝 Registered ${commands.length} commands:`);
            commands.forEach((cmd, idx) => {
                console.log(`   ${idx + 1}. /${cmd.name} - ${cmd.description}`);
            });
        } catch (error) {
            // More detailed error handling
            if (error.status === 401) {
                console.error('\n❌ AUTHORIZATION ERROR (401):');
                console.error('   This usually means:');
                console.error('   1. Discord TOKEN is invalid or expired');
                console.error('   2. CLIENT_ID does not match the bot application');
                console.error('   3. Bot token has been regenerated');
                console.error('\n📋 To fix this:');
                console.error('   1. Go to: https://discord.com/developers/applications');
                console.error('   2. Select your application (ID: ' + this.clientId + ')');
                console.error('   3. Click "Bot" menu → "Reset Token"');
                console.error('   4. Copy the NEW token and update .env file');
                console.error('   5. Restart the bot\n');
            } else if (error.status === 403) {
                console.error('\n❌ PERMISSION ERROR (403):');
                console.error('   Bot does not have permission to register commands.');
                console.error('   Make sure bot has "applications.commands" scope.\n');
            }
            
            console.error('Full error:', error.message);
            throw error;
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
            const username = interaction.options.getString('username');

            if (!username || username.trim() === '') {
                return await interaction.editReply({
                    content: `❌ Username tidak boleh kosong.`
                });
            }

            // Fetch user data by username (name column)
            const user = await User.findOne({
                where: {
                    name: username
                },
                attributes: ['id', 'name', 'email', 'role', 'alliance_id']
            });

            if (!user) {
                return await interaction.editReply({
                    content: `❌ User dengan username **${username}** tidak ditemukan di database.`
                });
            }

            // Fetch all contributions from this user
            const contributions = await MemberContribution.findAll({
                where: { member_id: user.id },
                order: [['week', 'ASC']]
            });

            if (!contributions || contributions.length === 0) {
                return await interaction.editReply({
                    content: `❌ User **${user.name}** belum memiliki riwayat kontribusi RSS.`
                });
            }

            // Generate Excel report file
            console.log(`📊 Generating Excel report for user: ${user.name}`);
            const reportInfo = await generateUserDetailReport(user, contributions);

            // Create Discord attachment
            const attachment = new AttachmentBuilder(reportInfo.filepath, {
                name: reportInfo.filename
            });

            // Send Excel file with summary embed
            const embed = new EmbedBuilder()
                .setColor('#00AA00')
                .setTitle(`📊 ${user.name} - Contribution Report`)
                .setDescription(`Laporan detail kontribusi RSS untuk **${user.name}** tersedia di file Excel di bawah.`)
                .addFields(
                    { name: '👤 User ID', value: `${user.id}`, inline: true },
                    { name: '📈 Total Weeks', value: `${contributions.length}`, inline: true },
                    { name: '📁 Filename', value: reportInfo.filename, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Kingdom 3946 Bank System' });

            await interaction.editReply({ 
                embeds: [embed],
                files: [attachment]
            });

            console.log(`✅ Excel report sent: ${reportInfo.filename}`);

        } catch (error) {
            console.error('Error in handleReportUser:', error);
            await interaction.editReply({
                content: `❌ Terjadi kesalahan saat membuat laporan: ${error.message}`
            });
        }
    }

    async handleBankRank(interaction) {
        await interaction.deferReply();

        try {
            // Fetch all users with their total contributions
            const users = await User.findAll({
                attributes: ['id', 'name', 'email', 'alliance_id'],
                raw: true
            });

            if (!users || users.length === 0) {
                return await interaction.editReply({
                    content: '❌ Tidak ada user yang terdaftar di database.'
                });
            }

            // Calculate total contributions for each user
            const userRankData = await Promise.all(users.map(async (user) => {
                const contributions = await MemberContribution.findAll({
                    where: { member_id: user.id }
                });

                let totalRss = 0;
                let totalFood = 0;
                let totalWood = 0;
                let totalStone = 0;
                let totalGold = 0;
                let totalWeeks = 0;

                contributions.forEach(contrib => {
                    totalRss += parseInt(contrib.total_rss) || 0;
                    totalFood += parseInt(contrib.food) || 0;
                    totalWood += parseInt(contrib.wood) || 0;
                    totalStone += parseInt(contrib.stone) || 0;
                    totalGold += parseInt(contrib.gold) || 0;
                    totalWeeks += 1;
                });

                return {
                    id: user.id,
                    name: user.name,
                    totalRss: totalRss,
                    food: totalFood,
                    wood: totalWood,
                    stone: totalStone,
                    gold: totalGold,
                    totalWeeks: totalWeeks,
                    avgPerWeek: totalWeeks > 0 ? Math.floor(totalRss / totalWeeks) : 0
                };
            }));

            // Sort by total RSS descending and get top 10
            userRankData.sort((a, b) => b.totalRss - a.totalRss);
            const topUsers = userRankData.slice(0, 10);

            if (topUsers.length === 0 || topUsers[0].totalRss === 0) {
                return await interaction.editReply({
                    content: '❌ Belum ada user dengan kontribusi RSS.'
                });
            }

            // Create rank embeds - split into 2 groups (top 5 + bottom 5) for better readability
            const embeds = [];
            
            // Group 1: Rank 1-5
            const group1 = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle('🏆 BANK RANK - TOP 10 DONORS 🏆')
                .setDescription('Daftar user dengan donasi RSS terbanyak')
                .setTimestamp()
                .setFooter({ text: 'Kingdom 3946 Bank System' });

            // Add ranks 1-5
            for (let i = 0; i < Math.min(5, topUsers.length); i++) {
                const user = topUsers[i];
                const rank = i + 1;
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
                
                const foodFormatted = this.formatNumber(user.food);
                const woodFormatted = this.formatNumber(user.wood);
                const stoneFormatted = this.formatNumber(user.stone);
                const goldFormatted = this.formatNumber(user.gold);
                const rssFormatted = this.formatNumber(user.totalRss);
                const avgFormatted = this.formatNumber(user.avgPerWeek);

                group1.addFields({
                    name: `${medal} ${user.name}`,
                    value: `├─ 🌾 Food: **${foodFormatted}**\n` +
                           `├─ 🪵 Wood: **${woodFormatted}**\n` +
                           `├─ 🪨 Stone: **${stoneFormatted}**\n` +
                           `├─ 👑 Gold: **${goldFormatted}**\n` +
                           `└─ 📊 Total: **${rssFormatted}** | 📅 ${user.totalWeeks}w | 📈 ${avgFormatted}/w`,
                    inline: false
                });
            }
            
            embeds.push(group1);

            // Group 2: Rank 6-10 (if exists)
            if (topUsers.length > 5) {
                const group2 = new EmbedBuilder()
                    .setColor('#C0C0C0')
                    .setTitle('🏆 BANK RANK - RANK 6-10 🏆');

                for (let i = 5; i < topUsers.length; i++) {
                    const user = topUsers[i];
                    const rank = i + 1;
                    const medal = `#${rank}`;
                    
                    const foodFormatted = this.formatNumber(user.food);
                    const woodFormatted = this.formatNumber(user.wood);
                    const stoneFormatted = this.formatNumber(user.stone);
                    const goldFormatted = this.formatNumber(user.gold);
                    const rssFormatted = this.formatNumber(user.totalRss);
                    const avgFormatted = this.formatNumber(user.avgPerWeek);

                    group2.addFields({
                        name: `${medal} ${user.name}`,
                        value: `├─ 🌾 Food: **${foodFormatted}**\n` +
                               `├─ 🪵 Wood: **${woodFormatted}**\n` +
                               `├─ 🪨 Stone: **${stoneFormatted}**\n` +
                               `├─ 👑 Gold: **${goldFormatted}**\n` +
                               `└─ 📊 Total: **${rssFormatted}** | 📅 ${user.totalWeeks}w | 📈 ${avgFormatted}/w`,
                        inline: false
                    });
                }
                
                embeds.push(group2);
            }

            await interaction.editReply({ embeds: embeds });

        } catch (error) {
            console.error('Error in handleBankRank:', error);
            await interaction.editReply({
                content: '❌ Terjadi kesalahan saat mengambil data ranking.'
            });
        }
    }

    async handleDownloadReport(interaction) {
        await interaction.deferReply();

        try {
            const bankName = interaction.options.getString('bank_name');

            // Fetch all users with their total contributions
            const users = await User.findAll({
                attributes: ['id', 'name'],
                raw: true
            });

            if (!users || users.length === 0) {
                return await interaction.editReply({
                    content: '❌ Tidak ada user yang terdaftar di database.'
                });
            }

            // Calculate total contributions for each user
            const userRankData = await Promise.all(users.map(async (user) => {
                const contributions = await MemberContribution.findAll({
                    where: { member_id: user.id }
                });

                let totalRss = 0;
                let totalFood = 0;
                let totalWood = 0;
                let totalStone = 0;
                let totalGold = 0;
                let totalWeeks = 0;

                contributions.forEach(contrib => {
                    totalRss += parseInt(contrib.total_rss) || 0;
                    totalFood += parseInt(contrib.food) || 0;
                    totalWood += parseInt(contrib.wood) || 0;
                    totalStone += parseInt(contrib.stone) || 0;
                    totalGold += parseInt(contrib.gold) || 0;
                    totalWeeks += 1;
                });

                return {
                    id: user.id,
                    name: user.name,
                    totalRss: totalRss,
                    food: totalFood,
                    wood: totalWood,
                    stone: totalStone,
                    gold: totalGold,
                    totalWeeks: totalWeeks,
                    avgPerWeek: totalWeeks > 0 ? Math.floor(totalRss / totalWeeks) : 0
                };
            }));

            // Sort by total RSS descending and get top 10
            userRankData.sort((a, b) => b.totalRss - a.totalRss);
            const topUsers = userRankData.slice(0, 10);

            if (topUsers.length === 0 || topUsers[0].totalRss === 0) {
                return await interaction.editReply({
                    content: '❌ Belum ada user dengan kontribusi RSS untuk di-download.'
                });
            }

            // Generate Excel report
            console.log(`📊 Generating Excel report for ${bankName}...`);
            const reportInfo = await generateBankRankReport(topUsers, bankName);

            // Create Discord attachment
            const attachment = new AttachmentBuilder(reportInfo.filepath, {
                name: reportInfo.filename
            });

            // Send file to Discord
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Bank Report Generated Successfully!')
                .setDescription(`Laporan untuk **${bankName}** telah berhasil dibuat.`)
                .addFields(
                    { name: '📊 Total Users', value: `${topUsers.length} users`, inline: true },
                    { name: '💰 Total RSS', value: this.formatNumber(topUsers.reduce((sum, u) => sum + u.totalRss, 0)), inline: true },
                    { name: '📅 Average Contributors', value: `${Math.round(topUsers.reduce((sum, u) => sum + u.totalWeeks, 0) / topUsers.length)} weeks`, inline: true },
                    { name: '📁 Filename', value: reportInfo.filename, inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Kingdom 3946 Bank System' });

            await interaction.editReply({ 
                embeds: [embed],
                files: [attachment]
            });

            console.log(`✅ Excel report generated: ${reportInfo.filename}`);

        } catch (error) {
            console.error('Error in handleDownloadReport:', error);
            await interaction.editReply({
                content: `❌ Terjadi kesalahan saat membuat laporan Excel: ${error.message}`
            });
        }
    }

    formatNumber(num) {
        if (!num || num === 0) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    async start() {
        try {
            // Try to register commands, but continue even if it fails in test mode
            try {
                await this.registerCommands();
            } catch (error) {
                if (this.isTestMode) {
                    console.warn('⚠️  Test mode: Continuing despite command registration failure');
                } else {
                    throw error;
                }
            }

            // Try to login with better error handling
            try {
                await this.client.login(this.token);
                console.log('🚀 Discord Bot started successfully!');
            } catch (error) {
                if (error.code === 'TokenInvalid') {
                    if (this.isTestMode) {
                        console.warn('\n⚠️  TEST MODE: Token invalid, but continuing in test mode');
                        console.warn('   Database functions are available for testing');
                        console.warn('   Bot will not respond to Discord commands\n');
                        return; // Continue execution in test mode
                    } else {
                        console.error('\n❌ TOKEN INVALID ERROR:');
                        console.error('   Your Discord token is not valid.');
                        console.error('\n📋 To fix this:');
                        console.error('   1. Go to: https://discord.com/developers/applications');
                        console.error('   2. Select your application');
                        console.error('   3. Click "Bot" menu → "Reset Token"');
                        console.error('   4. Copy the NEW token');
                        console.error('   5. Update BANKBOT/.env with the new token');
                        console.error('   6. Restart the bot\n');
                        throw error;
                    }
                }
                throw error;
            }
        } catch (error) {
            if (!this.isTestMode) {
                console.error('❌ Failed to start Discord Bot');
                throw error;
            }
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
