import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; 

import userRouter from './routers/userRouter.js';
import comunasRouter from './routers/comunasRouter.js';
import vecinosRouter from './routers/vecinosRouter.js';

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000; 

app.use(cors()); 
app.use(express.json());

app.use('/api/users', userRouter); 

app.use('/api/comunas', comunasRouter);
app.use('/api/vecinos', vecinosRouter);

app.get('/', (req, res) => {
  res.send('API REST de Comunas y Vecinos funcionando correctamente!');
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB funciona joya'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});