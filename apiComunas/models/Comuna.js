import mongoose from 'mongoose';

const comisariaSchema = new mongoose.Schema({
  nombre: String,
  direccion: String,
  telefono: String
}, { _id: false });

const comunaSchema = new mongoose.Schema({
  comuna: {
    type: Number,
    required: true,
    unique: true 
  },
  nombre: { type: String, required: true, trim: true }, 
  descripcion: { type: String, trim: true },
  dato_adicional: { type: String, trim: true },
  barrios: {
      type: [String],
      required: true 
  },
  comisarias: {
    comunal: {
      nombre: { type: String, required: true, trim: true }, 
      direccion: { type: String, required: true, trim: true } 
    },
    vecinales: {
        type: [comisariaSchema], 
        required: true 
    }
  }
});

const Comuna = mongoose.model('Comuna', comunaSchema);

export default Comuna;