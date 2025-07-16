import Comuna from '../models/Comuna.js';

export const getComunas = async (req, res) => {
  try {
    const comunas = await Comuna.find();
    res.json(comunas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las comunas', error });
  }
};

export const createComuna = async (req, res) => {
  const { comuna, nombre, descripcion, dato_adicional, comisarias, barrios } = req.body;

  let processedBarrios = [];
  if (typeof barrios === 'string' && barrios.trim() !== '') {
    processedBarrios = barrios.split(',').map(b => b.trim()).filter(b => b !== '');
  } else if (Array.isArray(barrios)) {
    processedBarrios = barrios;
  }

  let processedVecinales = [];
  if (comisarias && typeof comisarias.vecinales === 'string' && comisarias.vecinales.trim() !== '') {
    try {
      processedVecinales = JSON.parse(comisarias.vecinales);
    } catch (e) {
      console.error("Error al parsear JSON de comisarias.vecinales:", e);
      return res.status(400).json({ message: "Formato inválido para Comisarías Vecinales." });
    }
  } else if (comisarias && Array.isArray(comisarias.vecinales)) {
      processedVecinales = comisarias.vecinales;
  }

  if (!comuna || !nombre || !descripcion || !dato_adicional || !comisarias || !comisarias.comunal || !comisarias.comunal.nombre || !comisarias.comunal.direccion || processedBarrios.length === 0) {
    return res.status(400).json({ message: "Faltan datos obligatorios o tienen formato incorrecto (ej. Barrios o Comisaría Comunal)." });
  }

  const nuevaComuna = new Comuna({
    comuna,
    nombre,
    descripcion,
    dato_adicional,
    barrios: processedBarrios, 
    comisarias: {
      comunal: {
        nombre: comisarias.comunal.nombre,
        direccion: comisarias.comunal.direccion
      },
      vecinales: processedVecinales 
    }
  });

  try {
    await nuevaComuna.save();
    res.status(201).json({ message: "Comuna creada", data: nuevaComuna });
  } catch (error) {
    console.error("Error al crear comuna:", error); 
    if (error.code === 11000) {
        return res.status(409).json({ message: "El número de comuna ya existe." });
    }
    res.status(400).json({ message: 'Error al crear la comuna', error: error.message }); 
  }
};

export const getComunaById = async (req, res) => {
  const { id } = req.params;

  try {
    const comuna = await Comuna.findById(id);

    if (!comuna) {
      res.status(404).json({ message: "La comuna no fue encontrada" });
    } else {
      res.status(200).json({ message: "OK", data: comuna });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la comuna", error });
  }
};

export const deleteComuna = async (req, res) => {
  const { id } = req.params;

  try {
    const comuna = await Comuna.findByIdAndDelete(id);

    if (!comuna) {
      res.status(404).json({ message: "comuna no encontrada" });
    } else {
      res.status(200).json({ message: "comuna eliminada", data: comuna });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "error al eliminar comuna", error });
  }
};

export const updateComuna = async (req, res) => {
  const { id } = req.params;
  const { comuna, nombre, descripcion, dato_adicional, comisarias, barrios } = req.body;

  let processedBarrios = [];
  if (typeof barrios === 'string' && barrios.trim() !== '') {
    processedBarrios = barrios.split(',').map(b => b.trim()).filter(b => b !== '');
  } else if (Array.isArray(barrios)) {
    processedBarrios = barrios;
  }

  let processedVecinales = [];
  if (comisarias && typeof comisarias.vecinales === 'string' && comisarias.vecinales.trim() !== '') {
    try {
      processedVecinales = JSON.parse(comisarias.vecinales);
    } catch (e) {
      console.error("Error al parsear JSON de comisarias.vecinales en update:", e);
      return res.status(400).json({ message: "Formato inválido para Comisarías Vecinales en actualización." });
    }
  } else if (comisarias && Array.isArray(comisarias.vecinales)) {
      processedVecinales = comisarias.vecinales;
  }
  if (!comuna || !nombre || !descripcion || !dato_adicional || !comisarias || !comisarias.comunal || !comisarias.comunal.nombre || !comisarias.comunal.direccion || processedBarrios.length === 0) {
    return res.status(400).json({ message: "Faltan datos obligatorios o tienen formato incorrecto para actualizar." });
  }

  try {
    const updatedComuna = await Comuna.findByIdAndUpdate(
      id,
      {
        comuna,
        nombre,
        descripcion,
        dato_adicional,
        barrios: processedBarrios, 
        comisarias: {
          comunal: {
            nombre: comisarias.comunal.nombre,
            direccion: comisarias.comunal.direccion
          },
          vecinales: processedVecinales 
        }
      },
      { new: true, runValidators: true } 
    );

    if (!updatedComuna) {
      return res.status(404).json({ message: 'Comuna no encontrada' });
    }

    res.status(200).json({ message: 'Comuna actualizada', data: updatedComuna });

  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
        return res.status(409).json({ message: "El número de comuna ya existe al actualizar." });
    }
    res.status(500).json({ message: 'Error al actualizar comuna', error: error.message }); 
  }
};