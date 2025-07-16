import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe con este email.' });
        }
        const newUser = await User.create({ username, email, password, role: 'user' });

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                message: 'Registro exitoso',
                token: generateToken(newUser._id) 
            });
        } else {
            res.status(400).json({ message: 'Datos de usuario inválidos.' });
        }
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ message: error.message });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        const token = generateToken(user._id);
        res.status(200).json({
            token,
            user: { id: user._id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: error.message });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error("Error al obtener todos los usuarios:", error);
        res.status(500).json({ message: error.message });
    }
};
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado.' });
        }
    } catch (error) {
        console.error(`Error al obtener usuario con ID ${req.params.id}:`, error);
        res.status(500).json({ message: error.message });
    }
};

const createUserByAdmin = async (req, res) => {
    const { username, email, password, role } = req.body; 
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Ya existe un usuario con este email.' });
        }
        if (role && !['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Rol inválido. Solo "user" o "admin" son permitidos.' });
        }

        const newUser = await User.create({ username, email, password, role: role || 'user' }); 

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                message: 'Usuario creado exitosamente por el administrador.'
            });
        } else {
            res.status(400).json({ message: 'Datos de usuario inválidos para la creación.' });
        }
    } catch (error) {
        console.error("Error al crear usuario por admin:", error);
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    const { username, email, role } = req.body; 
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (req.user._id.toString() === req.params.id && role && role !== user.role) {
                return res.status(403).json({ message: 'No puedes cambiar tu propio rol.' });
            }

            user.username = username || user.username;
            user.email = email || user.email;
            if (role && ['user', 'admin'].includes(role)) {
                user.role = role;
            } else if (role !== undefined) { 
                return res.status(400).json({ message: 'Rol inválido proporcionado.' });
            }

            const updatedUser = await user.save();
            res.status(200).json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                message: 'Usuario actualizado exitosamente.'
            });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado.' });
        }
    } catch (error) {
        console.error(`Error al actualizar usuario con ID ${req.params.id}:`, error);
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (req.user._id.toString() === req.params.id) {
                return res.status(403).json({ message: 'No puedes eliminar tu propia cuenta.' });
            }

            await user.deleteOne(); 
            res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado.' });
        }
    } catch (error) {
        console.error(`Error al eliminar usuario con ID ${req.params.id}:`, error);
        res.status(500).json({ message: error.message });
    }
};

const userController = {
    register,
    login,
    getAllUsers, 
    getUserById,
    createUserByAdmin,
    updateUser,
    deleteUser
};

export default userController;