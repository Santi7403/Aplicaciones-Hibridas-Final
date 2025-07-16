import React, { useState, useEffect } from 'react';
import vecinosService from '../services/vecinosService';
import comunasService from '../services/comunasService';
import { useAuth } from '../contexts/AuthContext';

const initialVecinoState = {
  nombre: '',
  direccion: '',
  telefono: '',
  edad: '',
  comuna: ''
};

function VecinosPage() {
  const [vecinos, setVecinos] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newVecinoData, setNewVecinoData] = useState(initialVecinoState);

  const [editingVecinoId, setEditingVecinoId] = useState(null);
  const [editingVecinoData, setEditingVecinoData] = useState(initialVecinoState);

  const { isAuthenticated } = useAuth();

  const fetchVecinos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vecinosService.getVecinos();
      setVecinos(data.data || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los vecinos.');
      console.error("Error fetching vecinos:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComunas = async () => {
    try {
      const data = await comunasService.getComunas();
      setComunas(data.data || data);
    } catch (err) {
      console.error("Error al cargar comunas para el select:", err);
    }
  };

  useEffect(() => {
    fetchVecinos();
    fetchComunas();
  }, []);

  const handleNewVecinoChange = (e) => {
    const { name, value } = e.target;
    if (name === 'edad' && value !== '') {
      setNewVecinoData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setNewVecinoData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateVecino = async (e) => {
    e.preventDefault();
    setError(null);

    if (!newVecinoData.nombre.trim() || !newVecinoData.direccion.trim() || newVecinoData.edad === '' || !newVecinoData.comuna) {
      setError('Nombre, dirección, edad y comuna son campos requeridos.');
      return;
    }

    try {
      const createdVecino = await vecinosService.createVecino(newVecinoData);
      setVecinos([...vecinos, createdVecino.data]);
      setNewVecinoData(initialVecinoState);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el vecino. ¿Estás logueado o faltan datos?');
      console.error("Error al crear el vecino:", err);
    }
  };
  const handleDeleteVecino = async (id) => {
    setError(null);
    if (window.confirm('¿Estás seguro de que quieres eliminar a este vecino?')) {
      try {
        await vecinosService.deleteVecino(id);
        setVecinos(vecinos.filter(vecino => vecino._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar el vecino. ¿Tienes permisos?');
        console.error("Error al eliminar el vecino:", err);
      }
    }
  };
  const handleEditClick = (vecino) => {
    setEditingVecinoId(vecino._id);
    const comunaIdForEdit = vecino.comuna && typeof vecino.comuna === 'object' ? vecino.comuna._id : vecino.comuna;

    setEditingVecinoData({
      nombre: vecino.nombre || '',
      direccion: vecino.direccion || '',
      telefono: vecino.telefono || '',
      edad: vecino.edad || '',
      comuna: comunaIdForEdit || ''
    });
  };

  const handleEditingVecinoChange = (e) => {
    const { name, value } = e.target;
    if (name === 'edad' && value !== '') {
      setEditingVecinoData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setEditingVecinoData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateVecino = async (e) => {
    e.preventDefault();
    setError(null);

    if (!editingVecinoData.nombre.trim() || !editingVecinoData.direccion.trim() || editingVecinoData.edad === '' || !editingVecinoData.comuna) {
      setError('Nombre, dirección, edad y comuna son campos requeridos para actualizar.');
      return;
    }

    try {
      const updatedVecino = await vecinosService.updateVecino(editingVecinoId, editingVecinoData);
      setVecinos(vecinos.map(vecino =>
        vecino._id === editingVecinoId ? updatedVecino.data : vecino
      ));
      setEditingVecinoId(null);
      setEditingVecinoData(initialVecinoState);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el vecino. ¿Estás logueado o faltan datos?');
      console.error("Error al actualizar el vecino:", err);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Cargando vecinos...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Gestión de Vecinos</h1>

      {isAuthenticated ? (
        <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h3>Crear Nuevo Vecino</h3>
          <form onSubmit={handleCreateVecino} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Nombre:</label>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del Vecino"
                value={newVecinoData.nombre}
                onChange={handleNewVecinoChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Dirección:</label>
              <input
                type="text"
                name="direccion"
                placeholder="Dirección del Vecino"
                value={newVecinoData.direccion}
                onChange={handleNewVecinoChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Teléfono (Opcional):</label>
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono del Vecino"
                value={newVecinoData.telefono}
                onChange={handleNewVecinoChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Edad:</label>
              <input
                type="number"
                name="edad"
                placeholder="Edad del Vecino"
                value={newVecinoData.edad}
                onChange={handleNewVecinoChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Comuna:</label>
              <select
                name="comuna"
                value={newVecinoData.comuna}
                onChange={handleNewVecinoChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="">Selecciona una Comuna</option>
                {comunas.length > 0 ? (
                  comunas.map(comuna => (
                    <option key={comuna._id} value={comuna._id}>
                      {comuna.nombre} (Comuna: {comuna.comuna})
                    </option>
                  ))
                ) : (
                  <option disabled>Cargando comunas...</option>
                )}
              </select>
            </div>

            <button
              type="submit"
              style={{
                gridColumn: '1 / -1',
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Crear Vecino
            </button>
          </form>
        </div>
      ) : (
        <p style={{ color: '#888' }}>Inicia sesión para crear nuevos vecinos.</p>
      )}

      <h2>Listado de Vecinos ({vecinos.length})</h2>
      {vecinos.length === 0 ? (
        <p>No hay vecinos disponibles.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {vecinos.map((vecino) => (
            <li key={vecino._id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '5px', display: 'flex', flexDirection: 'column', gap: '5px', backgroundColor: 'white' }}>
              {editingVecinoId === vecino._id ? (
                <form onSubmit={handleUpdateVecino} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.8em' }}>Nombre:</label>
                    <input type="text" name="nombre" value={editingVecinoData.nombre} onChange={handleEditingVecinoChange} required style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.9em' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.8em' }}>Dirección:</label>
                    <input type="text" name="direccion" value={editingVecinoData.direccion} onChange={handleEditingVecinoChange} required style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.9em' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.8em' }}>Teléfono:</label>
                    <input type="text" name="telefono" value={editingVecinoData.telefono} onChange={handleEditingVecinoChange} style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.9em' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.8em' }}>Edad:</label>
                    <input type="number" name="edad" value={editingVecinoData.edad} onChange={handleEditingVecinoChange} required style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.9em' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Comuna:</label>
                    <select
                      name="comuna"
                      value={editingVecinoData.comuna}
                      onChange={handleEditingVecinoChange}
                      required
                      style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9em' }}
                    >
                      <option value="">Selecciona una Comuna</option>
                      {comunas.length > 0 ? (
                        comunas.map(comuna => (
                          <option key={comuna._id} value={comuna._id}>
                            {comuna.nombre} (Comuna: {comuna.comuna})
                          </option>
                        ))
                      ) : (
                        <option disabled>Cargando comunas...</option>
                      )}
                    </select>
                    {comunas.length === 0 && <p style={{ fontSize: '0.7em', color: '#888' }}>Cargando comunas o no hay comunas creadas.</p>}
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '5px', marginTop: '5px' }}>
                    <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Guardar</button>
                    <button type="button" onClick={() => setEditingVecinoId(null)} style={{ padding: '5px 10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Cancelar</button>
                  </div>
                </form>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{vecino.nombre} {vecino.apellido} (Edad: {vecino.edad})</span>
                    <span style={{ fontSize: '0.8em', color: '#666' }}>ID: {vecino._id}</span>
                  </div>
                  <p style={{ margin: '0', fontSize: '0.9em' }}>
                    **Dirección:** {vecino.direccion} <br />
                    **Teléfono:** {vecino.telefono || 'N/A'} <br />
                    **Comuna:** {vecino.comuna ? vecino.comuna.nombre : 'N/A'}
                  </p>
                  {isAuthenticated && (
                    <div style={{ alignSelf: 'flex-end', marginTop: '10px' }}>
                      <button
                        onClick={() => handleEditClick(vecino)}
                        style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteVecino(vecino._id)}
                        style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VecinosPage;