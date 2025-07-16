// apiComunas/routers/userRouter.js
import express from 'express';
import userController from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/admin', protect, authorizeRoles('admin'), userController.getAllUsers);
router.get('/admin/:id', protect, authorizeRoles('admin'), userController.getUserById);
router.post('/admin', protect, authorizeRoles('admin'), userController.createUserByAdmin);
router.put('/admin/:id', protect, authorizeRoles('admin'), userController.updateUser);
router.delete('/admin/:id', protect, authorizeRoles('admin'), userController.deleteUser);

export default router;
