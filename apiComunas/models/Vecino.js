import mongoose from 'mongoose';  

const vecinoSchema = new mongoose.Schema({
  nombre: String,
  direccion: String,  
  telefono: String,  
  comuna: { type: mongoose.Schema.Types.ObjectId, ref: 'Comuna' },
  edad: Number,
});

const Vecino = mongoose.model('Vecino', vecinoSchema);

export default Vecino;
