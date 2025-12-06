import argon2 from "argon2";

// Helper to send uniform invalid credential response (avoid user enumeration)
const invalidCredentials = (res) => res.status(401).json({ msg: "Email atau password salah" });

// Login User
export const login = async (req, res) => {
    console.log("Login attempt for email:", req.body.email);

    try {
        // Dynamic import of User model from SF BANK models
        const { User } = await import("../../models/index.js");
        
        if (!req.body.email) {
            console.error("Login error: Email is missing in request");
            return res.status(400).json({ msg: "Email required" });
        }

        const user = await User.findOne({
            where: {
                email: req.body.email
            }
            // Keep password field for authentication - don't exclude it here
        });

        console.log("User found:", user ? "Yes" : "No");

        if (!user) {
            console.error(`User not found for email: ${req.body.email}`);
            return invalidCredentials(res);
        }

        // Debug user object structure
        console.log("User object structure:", Object.keys(user));
        console.log("Has dataValues:", !!user.dataValues);
        console.log("User ID:", user.user_id);

        // Validate request
        if (!req.body.password) {
            console.error("Login error: Password is missing in request");
            return res.status(400).json({ msg: "Password required" });
        }

        if (!user.password) {
            console.error(`Password missing for user ${user.user_id}`);
            return res.status(400).json({ msg: "Invalid user account" });
        }

        // Debug password format
        console.log("Password hash format check:", {
            length: user.password.length,
            startsWithArgon2: user.password.startsWith('$argon2'),
            prefix: user.password.substring(0, 8)
        });

        try {
            // Check if password is in proper PHC format with more flexible check
            if (!user.password.startsWith('$argon2')) {
                console.error('Password hash format issue - Hash:', user.password.substring(0, 10) + '...');
                return res.status(400).json({ msg: "Invalid password format in database" });
            }

            // Verify hashed password
            console.log("Attempting password verification...");
            const match = await argon2.verify(user.password, req.body.password);
            console.log("Password verification result:", match ? "Match" : "No match");

            if (!match) {
                console.error(`Wrong password for user ${user.user_id}`);
                return invalidCredentials(res);
            }

            // Session debug and save
            console.log("Session before:", req.session ? "Exists" : "Missing");
            
            // Store user in session (nested object as expected by authenticate middleware)
            req.session.user = {
                id: user.id,
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            };
            
            // Force session save for production reliability
            await new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err) {
                        console.error('Session save error:', err);
                        reject(err);
                    } else {
                        console.log("Session saved successfully with user:", req.session.user);
                        resolve();
                    }
                });
            });
            
            console.log("Session after:", req.session.user ? `Set with ID ${req.session.user.id}` : "Missing");

            // Make safe userData extraction more resilient
            let userData;
            if (user.dataValues) {
                const { password, ...extractedData } = user.dataValues;
                userData = extractedData;
            } else {
                // Handle case where dataValues doesn't exist
                const userObj = user.toJSON ? user.toJSON() : { ...user };
                delete userObj.password;
                userData = userObj;
            }

            // Debug final response
            console.log("Login successful, sending response with user data");
            console.log("Session user:", req.session.user);

            res.status(200).json({
                msg: "Login successful",
                user: userData
            });

        } catch (hashError) {
            console.error('Password verification error:', hashError.name, hashError.message);
            console.error('Error stack:', hashError.stack);
            return invalidCredentials(res);
        }
    } catch (error) {
        console.error('Login error:', error.name, error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ msg: "Internal server error" });
    }
};

// Register (simple user creation)
export const register = async (req, res) => {
    try {
        const { name, email, password, role = 'R5', user_id, alliance_id } = req.body || {};
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "name, email, dan password wajib diisi" });
        }

        // Dynamic import from SF BANK models
        const { User } = await import("../../models/index.js");
        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ msg: "Email sudah terdaftar" });
        }

        // Create user (password hashed by model hook)
        const newUser = await User.create({
            user_id: user_id || `USR${Date.now()}`,
            name,
            email,
            password,
            role,
            alliance_id,
            status: 'Active',
            joined_date: new Date()
        });

        // Start session directly after registration
        req.session.user_id = newUser.id;
        await new Promise((resolve, reject) => {
            req.session.save(err => err ? reject(err) : resolve());
        });

        res.status(201).json({
            msg: "Registrasi berhasil",
            user: newUser.toJSON()
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ msg: "Gagal registrasi" });
    }
};

// Get User Data
export const Me = async (req, res) => {
    try {
        // Enhanced session validation for production
        console.log("[SESSION DEBUG] Checking session:", {
            sessionExists: !!req.session,
            sessionId: req.sessionID,
            userId: req.session ? req.session.user_id : 'undefined',
            nodeEnv: process.env.NODE_ENV
        });
        
        // Dynamic import of User model from SF BANK models
        const { User } = await import("../../models/index.js");
        
        if (!req.session || !req.session.user || !req.session.user.id) {
            console.log("Session validation failed:", {
                session: req.session ? 'exists' : 'missing',
                user: req.session ? req.session.user : 'N/A'
            });
            return res.status(401).json({ 
                msg: "Mohon login ke akun anda",
                debug: process.env.NODE_ENV !== 'production' ? {
                    sessionExists: !!req.session,
                    sessionId: req.sessionID,
                    cookies: req.headers.cookie
                } : undefined
            });
        }
        const user = await User.findOne({
            attributes: [
                'id',
                'user_id',
                'name',
                'email',
                'role',
                'alliance_id',
                'status',
                'joined_date',
                'created_at',
                'updated_at'
            ],
            where: {
                id: req.session.user.id
            }
        });

        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ msg: "Terjadi kesalahan pada server" });
    }
};

// Logout User
export const logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Tidak dapat Logout" });

        // Return successful logout message
        res.status(200).json({ msg: "Anda telah Logout" });
    });
};