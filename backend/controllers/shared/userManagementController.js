import db from "../../config/Database.js";
import argon2 from "argon2";

// Get all users
export const getUsers = async (req, res) => {
    try {
        const { User } = await import("../../models/userModel.js");
        
        const users = await User.findAll({
            attributes: [
                'user_id', 'fullname', 'email', 'role',
                'phone',
                'is_active', 'last_login', 'created_at', 'updated_at'
            ],
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({
            success: false,
            msg: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const { User } = await import("../../models/userModel.js");
        const { id } = req.params;

        const user = await User.findOne({
            where: { user_id: id },
            attributes: [
                'user_id', 'fullname', 'email', 'role',
                'phone',
                'is_active', 'last_login', 'created_at', 'updated_at'
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User tidak ditemukan'
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Get user by ID error:', error);
        return res.status(500).json({
            success: false,
            msg: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

// Create new user
export const createUser = async (req, res) => {
    let transaction;
    try {
        const { User } = await import("../../models/userModel.js");
        
        transaction = await db.transaction();

        const { 
            fullname, 
            email, 
            role, 
            password, 
            phone
        } = req.body;

        // Validate required fields
        if (!fullname || !email || !role || !password) {
            return res.status(400).json({
                success: false,
                msg: 'Nama lengkap, email, role, dan password harus diisi'
            });
        }

        // Validate password length (before hashing)
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                msg: 'Password harus minimal 8 karakter'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                msg: 'Format email tidak valid'
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: 'Email sudah terdaftar'
            });
        }

        // NIP removed from schema; skip NIP validation

        // Create new user
        const newUser = await User.create({
            fullname,
            email,
            role,
            password, // Will be hashed by model hook
            phone,
            is_active: true
        }, { transaction });

        await transaction.commit();

        return res.status(201).json({
            success: true,
            msg: 'User berhasil dibuat',
            data: {
                user_id: newUser.user_id,
                fullname: newUser.fullname,
                email: newUser.email,
                role: newUser.role,
                is_active: newUser.is_active
            }
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Create user error:', error);
        
        // Handle Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => {
                switch (err.path) {
                    case 'email':
                        return 'Format email tidak valid';
                    case 'fullname':
                        return 'Nama lengkap harus diisi dan minimal 2 karakter';
                    case 'password':
                        return 'Password tidak valid';
                    default:
                        return err.message;
                }
            });
            
            return res.status(400).json({
                success: false,
                msg: validationErrors.join(', ')
            });
        }
        
        // Handle unique constraint errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0]?.path;
            let message = 'Data sudah terdaftar';
            
            if (field === 'email') {
                message = 'Email sudah terdaftar';
            }
            
            return res.status(400).json({
                success: false,
                msg: message
            });
        }
        
        return res.status(500).json({
            success: false,
            msg: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

// Update user
export const updateUser = async (req, res) => {
    let transaction;
    try {
        const { User } = await import("../../models/userModel.js");
        
        transaction = await db.transaction();

        const { id } = req.params;
        const { 
            fullname, 
            email, 
            role, 
            password, 
            phone, 
            is_active
        } = req.body;

        // Find user to update
        const user = await User.findOne({
            where: { user_id: id }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User tidak ditemukan'
            });
        }

        // Validate email format if email is being updated
        if (email && email !== user.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    msg: 'Format email tidak valid'
                });
            }

            // Check if email already exists
            const existingUser = await User.findOne({
                where: { 
                    email,
                    user_id: { [db.Sequelize.Op.ne]: id }
                }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    msg: 'Email sudah terdaftar'
                });
            }
        }

        // Validate password length if password is being updated
        if (password && password.trim() !== '' && password.length < 8) {
            return res.status(400).json({
                success: false,
                msg: 'Password harus minimal 8 karakter'
            });
        }

        // NIP removed from schema; skip NIP uniqueness checks

        // Prepare update data
        const updateData = {};
        if (fullname !== undefined) updateData.fullname = fullname;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;
        if (password && password.trim() !== '') updateData.password = password; // Will be hashed by model hook
        if (phone !== undefined) updateData.phone = phone;
        // 'position' field not present in model; ignore if provided
        if (is_active !== undefined) updateData.is_active = is_active;

        // Update user
        await User.update(updateData, {
            where: { user_id: id },
            transaction
        });

        await transaction.commit();

        // Get updated user
        const updatedUser = await User.findOne({
            where: { user_id: id },
            attributes: [
                'user_id', 'fullname', 'email', 'role',
                'phone',
                'is_active', 'last_login', 'created_at', 'updated_at'
            ]
        });

        return res.status(200).json({
            success: true,
            msg: 'User berhasil diperbarui',
            data: updatedUser
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Update user error:', error);
        
        // Handle Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => {
                switch (err.path) {
                    case 'email':
                        return 'Format email tidak valid';
                    case 'fullname':
                        return 'Nama lengkap harus diisi dan minimal 2 karakter';
                    case 'password':
                        return 'Password tidak valid';
                    default:
                        return err.message;
                }
            });
            
            return res.status(400).json({
                success: false,
                msg: validationErrors.join(', ')
            });
        }
        
        // Handle unique constraint errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0]?.path;
            let message = 'Data sudah terdaftar';
            
            if (field === 'email') {
                message = 'Email sudah terdaftar';
            } else if (field === 'nip') {
                message = 'NIP sudah terdaftar';
            }
            
            return res.status(400).json({
                success: false,
                msg: message
            });
        }
        
        return res.status(500).json({
            success: false,
            msg: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    let transaction;
    try {
        const { User } = await import("../../models/userModel.js");
        
        transaction = await db.transaction();

        const { id } = req.params;

        // Find user to delete
        const user = await User.findOne({
            where: { user_id: id }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: 'User tidak ditemukan'
            });
        }

        // Prevent self-deletion
        if (req.user_id === id) {
            return res.status(400).json({
                success: false,
                msg: 'Tidak dapat menghapus akun sendiri'
            });
        }

        // Delete user
        await User.destroy({
            where: { user_id: id },
            transaction
        });

        await transaction.commit();

        return res.status(200).json({
            success: true,
            msg: 'User berhasil dihapus'
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Delete user error:', error);
        return res.status(500).json({
            success: false,
            msg: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};

export const changePassword = async (req, res) => {
    let transaction;
    try {
        // Dynamic import of User model
        const { User } = await import("../../models/userModel.js");
        
        transaction = await db.transaction();

        const { oldPassword, newPassword } = req.body;
        const userId = req.user_id;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                msg: 'Password lama dan baru harus diisi'
            });
        }

        const user = await User.findOne({
            where: { user_id: userId }
        });

        if (!user) {
            return res.status(404).json({
                msg: 'User tidak ditemukan'
            });
        }

        const validPassword = await argon2.verify(user.password, oldPassword);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Password lama tidak sesuai'
            });
        }

        const hashPassword = await argon2.hash(newPassword);

        await User.update({
            password: hashPassword
        }, {
            where: { user_id: userId },
            transaction
        });

        await transaction.commit();

        return res.status(200).json({
            msg: 'Password berhasil diperbarui'
        });

    } catch (error) {
        if (transaction) await transaction.rollback();
        console.error('Change password error:', error);
        return res.status(500).json({
            msg: 'Terjadi kesalahan pada server',
            error: error.message
        });
    }
};