import dotenv from 'dotenv';
import express from 'express';
import DiscordBot from './bot/DiscordBot.js';
import db, { testConnection } from './config/database.js';
import testRoutes from './routes/testRoutes.js';

// Load environment variables
dotenv.config();

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Promise Rejection:', { reason, promise });
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

// Graceful shutdown handler
const gracefulShutdown = (bot, server) => {
    return async (signal) => {
        console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
        
        try {
            if (bot) {
                await bot.stop();
            }
            if (server) {
                server.close();
            }
            await db.close();
            console.log('✅ All connections closed. Goodbye!');
            process.exit(0);
        } catch (error) {
            console.error('❌ Error during shutdown:', error);
            process.exit(1);
        }
    };
};

// Main function to start the bot
const startBot = async () => {
    console.log('🤖 Kingdom 3946 Discord Bot - Starting...\n');

    // Check required environment variables
    if (!process.env.DISCORD_TOKEN) {
        console.error('❌ DISCORD_TOKEN is not set in .env file!');
        console.error('💡 Please copy .env.example to .env and configure it.');
        process.exit(1);
    }

    if (!process.env.DISCORD_CLIENT_ID) {
        console.error('❌ DISCORD_CLIENT_ID is not set in .env file!');
        console.error('💡 Please copy .env.example to .env and configure it.');
        process.exit(1);
    }

    let server = null;
    const isTestMode = process.env.BOT_TEST_MODE === 'true';

    try {
        // Test database connection
        console.log('🔌 Connecting to database...');
        await testConnection();

        // Initialize Discord Bot
        console.log('🤖 Initializing Discord Bot...');
        const bot = new DiscordBot(
            process.env.DISCORD_TOKEN,
            process.env.DISCORD_CLIENT_ID
        );

        // Start the bot
        await bot.start();

        console.log('\n✨ Discord Bot is now online and ready!');
        console.log('📝 Available commands:');
        console.log('   - /bank-alliance    : View all alliances and their RSS');
        console.log('   - /report-user <id> : View user contribution report\n');

        // Setup graceful shutdown with bot
        process.on('SIGTERM', gracefulShutdown(bot, server));
        process.on('SIGINT', gracefulShutdown(bot, server));

        // If in test mode, also start HTTP server for testing
        if (isTestMode) {
            console.log('🧪 TEST MODE ACTIVE: Starting HTTP test server...\n');
            
            const app = express();
            const TEST_PORT = process.env.BOT_TEST_PORT || 3001;

            app.use(express.json());
            app.use('/api/test', testRoutes);

            // Root endpoint
            app.get('/', (req, res) => {
                res.json({
                    message: 'Kingdom 3946 Discord Bot - Test Server',
                    mode: 'TEST_MODE',
                    status: 'online',
                    endpoints: {
                        health: 'GET /api/test/health',
                        bankAlliance: 'GET /api/test/bank-alliance',
                        reportUser: 'GET /api/test/report-user/:userId'
                    },
                    documentation: 'See BANKBOT/TESTING.md for more details'
                });
            });

            // 404 handler
            app.use((req, res) => {
                res.status(404).json({
                    success: false,
                    message: 'Endpoint not found',
                    availableEndpoints: {
                        health: 'GET /api/test/health',
                        bankAlliance: 'GET /api/test/bank-alliance',
                        reportUser: 'GET /api/test/report-user/:userId'
                    }
                });
            });

            server = app.listen(TEST_PORT, () => {
                console.log(`📡 Test HTTP server running on http://localhost:${TEST_PORT}`);
                console.log('\n🧪 Test Mode - Available endpoints:');
                console.log(`   GET  http://localhost:${TEST_PORT}/`);
                console.log(`   GET  http://localhost:${TEST_PORT}/api/test/health`);
                console.log(`   GET  http://localhost:${TEST_PORT}/api/test/bank-alliance`);
                console.log(`   GET  http://localhost:${TEST_PORT}/api/test/report-user/:userId`);
                console.log('\n📝 Example: http://localhost:' + TEST_PORT + '/api/test/report-user/1\n');
            });

            // Update graceful shutdown
            process.on('SIGTERM', gracefulShutdown(bot, server));
            process.on('SIGINT', gracefulShutdown(bot, server));
        }

    } catch (error) {
        console.error('❌ Fatal error starting bot:', error);
        process.exit(1);
    }
};

// Start the application
startBot().catch(error => {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
});
