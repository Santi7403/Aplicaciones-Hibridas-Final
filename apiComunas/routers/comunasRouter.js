import express from 'express';
import {
  getComunas,
  getComunaById,
  createComuna,
  updateComuna,
  deleteComuna
} from '../controllers/comunasController.js';

import { protect, authorizeRoles } from '../middlewares/authMiddleware.js'; 

const router = express.Router();

router.get('/', getComunas);
router.get('/:id', getComunaById);

router.post('/', protect, createComuna);
router.put('/:id', protect, updateComuna);
router.delete('/:id', protect, deleteComuna);

export default router;