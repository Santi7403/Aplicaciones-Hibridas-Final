import Vecino from '../models/Vecino.js';

export const getVecinos = async (req, res) => {
  try {
    const vecinos = await Vecino.find().populate('comuna');
    res.status(200).json(vecinos);
  } catch (error) {
    console.error("Error al obtener vecinos:", error);
    res.status(500).json({ message: 'Error al obtener los vecinos', error: error.message });
  }
};

export const getVecinoById = async (req, res) => {
  const { id } = req.params;

  try {
    const vecino = await Vecino.findById(id).populate('comuna');
    if (!vecino) {
      return res.status(404).json({ message: 'Vecino no encontrado' });
    }
    res.status(200).json(vecino);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el vecino', error });
  }
};

export const createVecino = async (req, res) => {
  const { nombre, edad, comuna, direccion, telefono } = req.body;

  if (!nombre || !direccion || edad === undefined || comuna === undefined) {
      return res.status(400).json({ message: 'Faltan datos obligatorios para crear el vecino (nombre, dirección, edad, comuna).' });
  }

  try {
    const nuevoVecino = new Vecino({ nombre, edad, comuna, direccion, telefono });
    await nuevoVecino.save();
    const createdVecinoPopulated = await Vecino.findById(nuevoVecino._id).populate('comuna');
    res.status(201).json({ message: 'Vecino creado', data: createdVecinoPopulated });
  } catch (error) {
    console.error("Error al crear vecino:", error);
    res.status(400).json({ message: 'Error al crear el vecino', error });
  }
};

export const updateVecino = async (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, telefono, edad, comuna } = req.body;

  if (!nombre || !direccion || edad === undefined || comuna === undefined) {
      return res.status(400).json({ message: 'Nombre, dirección, edad y comuna son campos obligatorios para actualizar.' });
  }

  try {
    const vecino = await Vecino.findByIdAndUpdate(
      id,
      {
        nombre,
        direccion,
        telefono,
        edad,
        comuna,
      },
      { new: true, runValidators: true }
    );

    if (!vecino) {
      return res.status(404).json({ message: 'Vecino no encontrado' });
    }
    const updatedVecinoPopulated = await Vecino.findById(vecino._id).populate('comuna');
    res.json({ message: 'Vecino actualizado', data: updatedVecinoPopulated });
  } catch (error) {
    console.error("Error al actualizar vecino:", error);
    res.status(500).json({ message: 'Error al actualizar el vecino', error });
  }
};

export const deleteVecino = async (req, res) => {
  const { id } = req.params;

  try {
    const vecino = await Vecino.findByIdAndDelete(id);
    if (!vecino) {
      return res.status(404).json({ message: 'Vecino no encontrado' });
    }
    res.json({ message: 'Vecino eliminado', data: vecino });
  } catch (error) {
    console.error("Error al eliminar vecino:", error);
    res.status(500).json({ message: 'Error al eliminar el vecino', error });
  }
};

export const getVecinosByComuna = async (req, res) => {
  const { comunaId } = req.params;

  try {
    const vecinos = await Vecino.find({ comuna: comunaId }).populate('comuna');

    if (!vecinos || vecinos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron vecinos en esta comuna' });
    }

    res.json(vecinos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los vecinos por comuna', error });
  }
};

export const buscarVecinoPorNombre = async (req, res) => {
  const { nombre } = req.params;

  try {
    const vecinos = await Vecino.find({
      nombre: { $regex: nombre, $options: 'i' }
    }).populate('comuna');

    if (vecinos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron vecinos con ese nombre' });
    }

    res.json(vecinos);
  } catch (error) {
    res.status(500).json({ message: 'Error en la búsqueda por nombre', error });
  }
};

const vecinosController = {
    getVecinos,
    createVecino,
    getVecinoById,
    updateVecino,
    deleteVecino,
    getVecinosByComuna,
    buscarVecinoPorNombre
};

export default vecinosController;