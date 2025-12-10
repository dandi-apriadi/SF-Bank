import { Client, GatewayIntentBits, EmbedBuilder, REST, Routes, AttachmentBuilder } from 'discord.js';
import { Op } from 'sequelize';
import Alliance from '../models/Alliance.js';
import MemberContribution from '../models/MemberContribution.js';
import User from '../models/User.js';
import { generateUserDetailReport, generateAllianceReport } from '../utils/excelReportGenerator.js';
import fs from 'fs';

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
        this.client.once('clientReady', () => {
            console.log(`✅ Discord Bot is ready! Logged in as ${this.client.user.tag}`);
            console.log(`📡 Bot is active in ${this.client.guilds.cache.size} server(s)`);
            console.log(`🎮 Commands available: /bank-alliance, /report-user, /bank-rank, /download-report`);
            console.log(`💾 Database: Direct access mode (no backend authentication required)`);
        });

        this.client.on('interactionCreate', async (interaction) => {
            // Handle autocomplete interactions
            if (interaction.isAutocomplete()) {
                const { commandName, options } = interaction;

                if (commandName === 'report-user') {
                    const focusedValue = options.getFocused(true);
                    if (focusedValue.name === 'username') {
                        try {
                            // Get alliance_id from the command options
                            const allianceId = options.getInteger('alliance_id', false);
                            const choices = await this.getUsernameChoices(focusedValue.value, allianceId);
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
                const errorMessage = 'An error occurred while processing the command. Please try again later.';

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
                attributes: ['id', 'name', 'tag', 'bank_name'],
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
                        value: alliance.id // use alliance id for download
                    };
                });

                // Remove duplicates based on value
                const uniqueBanks = bankChoices.filter((bank, index, self) =>
                    index === self.findIndex((b) => b.value === bank.value)
                );

                return uniqueBanks;
            }

            // Fallback if no alliance in database
            return [
                { name: 'Kingdom Bank', value: 1 },
                { name: 'Alliance Bank', value: 2 },
                { name: 'General Bank', value: 3 }
            ];
        } catch (error) {
            console.error('Error fetching bank choices:', error);
            // Fallback options
            return [
                { name: 'Kingdom Bank', value: 1 },
                { name: 'Alliance Bank', value: 2 }
            ];
        }
    }

    async getUsernameChoices(searchQuery = '', allianceId = null) {
        try {
            // Build where clause
            const whereClause = {
                role: { [Op.ne]: 'Admin' }  // Exclude Admin role
            };
            
            // Filter by alliance_id if provided
            if (allianceId) {
                whereClause.alliance_id = allianceId;
            }
            
            // Filter by search query if provided
            if (searchQuery) {
                whereClause.name = {
                    [Op.like]: `%${searchQuery}%`
                };
            }

            // Query database untuk usernames (name column) yang match dengan search query
            const users = await User.findAll({
                attributes: ['id', 'name'],
                where: whereClause,
                order: [['name', 'ASC']],
                limit: 25, // Discord max 25 choices (platform limitation)
                raw: true
            });

            if (!users || users.length === 0) {
                // Return helpful message when no users found
                if (searchQuery) {
                    return [{ name: `No member found matching "${searchQuery}"`, value: 'NOT_FOUND' }];
                }
                return [{ name: 'No members in this alliance', value: 'NOT_FOUND' }];
            }

            // Format untuk Discord autocomplete - show username dengan ID
            const choices = users.map(user => ({
                name: user.name.length > 90 ? user.name.substring(0, 87) + '...' : user.name, // Discord max 100 chars
                value: user.name // Use username as value
            }));

            // If we hit the limit and no search query, add a hint
            if (users.length === 25 && !searchQuery) {
                choices[24] = {
                    name: '⚠️ Type to search more members...',
                    value: 'SEARCH_MORE'
                };
            }

            return choices;
        } catch (error) {
            console.error('Error fetching username choices:', error);
            return [{ name: 'Error loading members', value: 'ERROR' }];
        }
    }

    async registerCommands() {
        // Get dynamic bank choices from database
        const bankChoices = await this.getBankChoices();
        const commands = [
            {
                name: 'bank-alliance',
                description: 'Display list of alliances with bank RSS information',
            },
            {
                name: 'report-user',
                description: 'Display detailed RSS contribution report for a user',
                options: [
                    {
                        name: 'alliance_id',
                        type: 4, // INTEGER
                        description: 'Select alliance first',
                        required: true,
                        choices: bankChoices
                    },
                    {
                        name: 'username',
                        type: 3, // STRING (autocomplete will handle this)
                        description: 'Username or name of the user to view the report',
                        required: true,
                        autocomplete: true
                    }
                ]
            },
            {
                name: 'bank-rank',
                description: 'Display top 10 users with the most RSS donations (Leaderboard)',
                options: [
                    {
                        name: 'alliance_id',
                        type: 4, // INTEGER
                        description: 'Select alliance to view ranking',
                        required: true,
                        choices: bankChoices
                    }
                ]
            },
            {
                name: 'download-report',
                description: 'Download bank report in Excel format (full members, per alliance)',
                options: [
                    {
                        name: 'alliance_id',
                        type: 4, // INTEGER
                        description: 'Select alliance to download the report',
                        required: true,
                        choices: bankChoices
                    },
                    {
                        name: 'bank_name',
                        type: 3, // STRING
                        description: 'Bank name (optional, for title)',
                        required: false
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
                    content: '❌ No alliances registered in the database.'
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
                    where: { 
                        alliance_id: alliance.id,
                        role: { [Op.ne]: 'Admin' }  // Exclude Admin role
                    }
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
                    .setDescription('List of alliances with total RSS stored in the bank')
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
                content: '❌ An error occurred while fetching alliance data.'
            });
        }
    }

    async handleReportUser(interaction) {
        await interaction.deferReply();

        try {
            const allianceId = interaction.options.getInteger('alliance_id');
            const username = interaction.options.getString('username');

            // Validate special values
            if (!username || username.trim() === '' || 
                username === 'NOT_FOUND' || username === 'SEARCH_MORE' || username === 'ERROR') {
                return await interaction.editReply({
                    content: `❌ Please select a valid member from the list or type a name to search.`
                });
            }

            // Fetch user data by username and alliance_id
            const user = await User.findOne({
                where: {
                    name: username,
                    alliance_id: allianceId,
                    role: { [Op.ne]: 'Admin' }  // Exclude Admin role
                },
                attributes: ['id', 'name', 'email', 'role', 'alliance_id']
            });

            if (!user) {
                return await interaction.editReply({
                    content: `❌ User with username **${username}** not found in the selected alliance.`
                });
            }

            // Fetch all contributions from this user
            const contributions = await MemberContribution.findAll({
                where: { member_id: user.id },
                order: [['week', 'ASC']]
            });

            if (!contributions || contributions.length === 0) {
                return await interaction.editReply({
                    content: `❌ User **${user.name}** does not have any RSS contribution history yet.`
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
                .setDescription(`Detailed RSS contribution report for **${user.name}** is available in the Excel file below.`)
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
                content: `❌ An error occurred while creating the report: ${error.message}`
            });
        }
    }

    async handleBankRank(interaction) {
        await interaction.deferReply();

        try {
            const allianceId = interaction.options.getInteger('alliance_id');

            // Fetch alliance info
            const alliance = await Alliance.findByPk(allianceId);
            if (!alliance) {
                return await interaction.editReply({
                    content: '❌ Alliance not found.'
                });
            }

            // Fetch users from selected alliance only (exclude Admin)
            const users = await User.findAll({
                where: { 
                    alliance_id: allianceId,
                    role: { [Op.ne]: 'Admin' }  // Exclude Admin role
                },
                attributes: ['id', 'name', 'email', 'alliance_id'],
                raw: true
            });

            if (!users || users.length === 0) {
                return await interaction.editReply({
                    content: '❌ No users registered in this alliance.'
                });
            }

            // Calculate total contributions for each user
            const userRankData = await Promise.all(users.map(async (user) => {
                const contributions = await MemberContribution.findAll({
                    where: { 
                        member_id: user.id,
                        alliance_id: allianceId  // Filter by alliance_id
                    }
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
                    content: '❌ No users with RSS contributions yet.'
                });
            }

            // Create rank embeds - split into 2 groups (top 5 + bottom 5) for better readability
            const embeds = [];

            // Group 1: Rank 1-5
            const group1 = new EmbedBuilder()
                .setColor('#FFD700')
                .setTitle(`🏆 BANK RANK - TOP 10 DONORS 🏆`)
                .setDescription(`**${alliance.bank_name || alliance.name}**\n\nList of users with the most RSS donations`)
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
                content: '❌ An error occurred while fetching ranking data.'
            });
        }
    }

    async handleDownloadReport(interaction) {
        await interaction.deferReply();

        try {
            const bankName = interaction.options.getString('bank_name');
            const allianceId = interaction.options.getInteger('alliance_id');

            if (!allianceId) {
                return await interaction.editReply({
                    content: '❌ Please provide alliance_id to retrieve the bank report.'
                });
            }

            // Fetch alliance from database directly
            const alliance = await Alliance.findByPk(allianceId);
            if (!alliance) {
                return await interaction.editReply({
                    content: '❌ Alliance not found in database.'
                });
            }

            // Fetch all users in this alliance (exclude Admin)
            const users = await User.findAll({
                where: { 
                    alliance_id: allianceId,
                    role: { [Op.ne]: 'Admin' }  // Exclude Admin role
                },
                attributes: ['id', 'name', 'email']
            });

            if (!users || users.length === 0) {
                return await interaction.editReply({
                    content: '❌ No members in this alliance.'
                });
            }

            // Calculate total contributions for each user
            const memberData = await Promise.all(users.map(async (user) => {
                const contributions = await MemberContribution.findAll({
                    where: { 
                        member_id: user.id,
                        alliance_id: allianceId  // Filter by alliance_id
                    }
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

            // Sort by total RSS descending
            memberData.sort((a, b) => b.totalRss - a.totalRss);

            // Generate Excel report using local function
            const reportInfo = await generateAllianceReport(alliance, memberData);

            // Read the file
            const buffer = fs.readFileSync(reportInfo.filepath);
            const attachment = new AttachmentBuilder(buffer, { name: reportInfo.filename });

            // Calculate summary stats
            const totalRss = memberData.reduce((sum, m) => sum + (m.totalRss || 0), 0);
            const avgWeeks = memberData.length > 0 ? Math.round(memberData.reduce((sum, m) => sum + (m.totalWeeks || 0), 0) / memberData.length) : 0;

            // Get top 3 contributors for preview
            const top3 = memberData.slice(0, 3);
            let top3Text = '';
            top3.forEach((member, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
                top3Text += `${medal} **${member.name}** - ${this.formatNumber(member.totalRss)} RSS\n`;
            });

            // Summary embed with top 3 preview
            const summaryEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ Bank Report Generated Successfully!')
                .setDescription(`Report for **${alliance.bank_name || alliance.name}** has been successfully created.\n\n**Top 3 Contributors:**\n${top3Text}`)
                .addFields(
                    { name: '📊 Total Members', value: `${memberData.length} members`, inline: true },
                    { name: '💰 Total RSS', value: this.formatNumber(totalRss), inline: true },
                    { name: '📅 Average Weeks', value: `${avgWeeks} weeks`, inline: true },
                    { name: '📁 File', value: reportInfo.filename, inline: false },
                    { name: '💡 Tip', value: 'Download the Excel file below to view full details of all members!', inline: false }
                )
                .setTimestamp()
                .setFooter({ text: 'Kingdom 3946 Bank System' });

            await interaction.editReply({
                content: '✅ Bank report successfully created! Please download the file below.',
                embeds: [summaryEmbed],
                files: [attachment]
            });
        } catch (error) {
            console.error('Error in /download-report:', error);
            await interaction.editReply({
                content: `❌ An error occurred while creating the report: ${error.message}`
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
