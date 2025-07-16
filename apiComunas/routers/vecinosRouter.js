import express from 'express';
import {
  getVecinos,
  getVecinoById,
  createVecino,
  updateVecino,
  deleteVecino,
  buscarVecinoPorNombre,
  getVecinosByComuna  
} from '../controllers/vecinosController.js';

const router = express.Router();

router.get('/nombre/:nombre', buscarVecinoPorNombre); 
router.get('/comuna/:comunaId', getVecinosByComuna); 

router.get('/', getVecinos);
router.get('/:id', getVecinoById);
router.post('/', createVecino);
router.put('/:id', updateVecino);
router.delete('/:id', deleteVecino);

export default router;
