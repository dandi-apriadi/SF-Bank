import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import crypto from 'crypto';
import db from './config/Database.js';
import authRoutes from './routes/shared/authRoutes.js';
import contactRoutes from './routes/shared/contactRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import userManagementRoutes from './routes/administrator/userManagementRoutes.js';
import allianceRoutes from './routes/administrator/allianceRoutes.js';
import auditLogRoutes from './routes/audit/auditLogRoutes.js';

// Initialize Express app
const app = express();

// Global error handlers to ensure errors are printed to console
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', { reason, promise });
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Trust proxy for production (important for session cookies)
if (process.env.NODE_ENV === 'production' && process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
}

// CORS Configuration
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_ORIGIN || "http://localhost:3001",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

const sessionStore = SequelizeStore(session.Store);

// Create session store with database
const store = new sessionStore({
    db: db,
    tableName: process.env.SESSION_TABLE_NAME || 'Sessions',
    checkExpirationInterval: parseInt(process.env.SESSION_CLEANUP_INTERVAL) || 15 * 60 * 1000,
    expiration: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000,
    onError: (error) => {
        console.error('Session store error:', error);
    },
    retry: {
        max: 3,
        timeout: 30000
    }
});

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// --- Session cookie config fix: only set domain if valid and in production ---
const sessionCookie = {
    secure: process.env.NODE_ENV === "production" ? false : false,
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === "production" ? 'lax' : 'lax',
};
if (
    process.env.NODE_ENV === 'production' &&
    process.env.COOKIE_DOMAIN &&
    /^([a-zA-Z0-9.-]+)$/.test(process.env.COOKIE_DOMAIN) &&
    !['localhost', '127.0.0.1'].includes(process.env.COOKIE_DOMAIN)
) {
    sessionCookie.domain = process.env.COOKIE_DOMAIN;
}
app.use(
    session({
        secret: process.env.SESS_SECRET || "default_secret_key",
        resave: false,
        saveUninitialized: false,
        store: store,
        rolling: true,
        cookie: sessionCookie,
        name: process.env.SESSION_NAME || 'iot.session.id',
        genid: (req) => {
            return crypto.randomBytes(16).toString('hex');
        }
    })
);
app.use('/api/shared', authRoutes);
app.use('/api/v1/users', userManagementRoutes);
app.use('/api/v1', allianceRoutes);
app.use('/api/v1/audit-logs', auditLogRoutes);
app.use('/', contactRoutes);
app.use('/', healthRoutes);

// 404 handler (log missing routes)
app.use((req, res, next) => {
    console.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ msg: 'Not Found' });
});

// Centralized error handler with detailed logging
app.use((err, req, res, next) => {
    // Handle Multer errors (e.g., file too large) with a clear 413 response
    if (err && (err instanceof multer.MulterError || err.code === 'LIMIT_FILE_SIZE')) {
        console.warn('Multer error:', err.code || err.message);
        return res.status(413).json({ msg: 'File terlalu besar atau upload gagal', code: err.code || 'MULTER_ERROR' });
    }

    const isDev = (process.env.NODE_ENV || 'development') === 'development';
    const code = Date.now().toString(36);
    const status = err.status || 500;
    const base = `${req.method} ${req.originalUrl}`;
    console.error(`[ERROR ${code}] ${base} -> ${status}: ${err.message}`);
    if (err.stack) {
        console.error(`[STACK ${code}]\n${err.stack}`);
    }
    res.status(status).json({
        error: 'Internal server error',
        code,
        message: isDev ? err.message : 'Something went wrong'
    });
});

const PORT = process.env.APP_PORT || process.env.PORT || 5000;

import { setupDatabase, checkDatabaseHealth } from './scripts/databaseSetup.js';

const initializeDatabase = async () => {
    try {
        console.log('Connecting to database...');
        await db.authenticate();
        console.log('Database connection has been established successfully.');

        // Import models
        await import('./models/userModel.js');

        // Use our custom setup function instead of direct sync
        await setupDatabase();
        console.log('Database initialized successfully.');

        try {
            await store.sync();
            console.log('Session store synchronized successfully.');
            await store.length();
        } catch (sessionError) {
            console.error('Session store sync failed:', sessionError);
            try {
                await db.query(`
                    CREATE TABLE IF NOT EXISTS Sessions (
                        sid VARCHAR(36) NOT NULL PRIMARY KEY,
                        expires DATETIME,
                        data TEXT,
                        createdAt DATETIME NOT NULL,
                        updatedAt DATETIME NOT NULL
                    )
                `);
            } catch (manualError) {
                console.error('Manual session table creation failed:', manualError);
                throw new Error('Session store initialization failed');
            }
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

// Start server after database initialization
const startServer = async () => {
    await initializeDatabase();
    
    // Start the HTTP server
    app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} | Env: ${process.env.NODE_ENV || 'development'} | CORS: ${process.env.CLIENT_ORIGIN || "http://localhost:3000"}`);
    });
};

// Start the server
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
