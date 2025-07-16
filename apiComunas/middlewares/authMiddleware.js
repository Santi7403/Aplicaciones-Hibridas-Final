import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 
import dotenv from 'dotenv';
dotenv.config();

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'No autorizado, usuario asociado al token no encontrado.' });
            }
            next(); 
        } catch (error) {
            console.error("Error en protect middleware:", error);
            res.status(401).json({ message: 'No autorizado, token fallido o expirado.' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token.' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Acceso denegado. El rol ${req.user ? req.user.role : 'invitado'} no tiene permiso para esta acción.` });
        }
        next(); 
    };
};

export { protect, authorizeRoles };