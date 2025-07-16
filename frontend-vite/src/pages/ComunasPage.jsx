import React, { useState, useEffect } from 'react';
import comunasService from '../services/comunasService';
import { useAuth } from '../contexts/AuthContext';

const initialComunaState = {
  comuna: '',
  nombre: '',
  descripcion: '',
  dato_adicional: '',
  barrios: '',
  comisarias: {
    comunal: {
      nombre: '',
      direccion: ''
    },
    vecinales: ''
  }
};

function ComunasPage() {
  const [comunas, setComunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComunaData, setNewComunaData] = useState(initialComunaState);

  const [editingComunaId, setEditingComunaId] = useState(null);
  const [editingComunaData, setEditingComunaData] = useState(initialComunaState);

  const { isAuthenticated } = useAuth();

  const fetchComunas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await comunasService.getComunas();
      setComunas(data.data || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar las comunas.');
      console.error("Error al cargar las comunas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComunas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'comuna' && value !== '') {
      setNewComunaData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setNewComunaData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleComunalChange = (e) => {
    const { name, value } = e.target;
    setNewComunaData(prev => ({
      ...prev,
      comisarias: {
        ...prev.comisarias,
        comunal: {
          ...prev.comisarias.comunal,
          [name]: value
        }
      }
    }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'comuna' && value !== '') {
      setEditingComunaData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setEditingComunaData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditComunalChange = (e) => {
    const { name, value } = e.target;
    setEditingComunaData(prev => ({
      ...prev,
      comisarias: {
        ...prev.comisarias,
        comunal: {
          ...prev.comisarias.comunal,
          [name]: value
        }
      }
    }));
  };

  const prepareComunaData = (data) => {
    const preparedData = { ...data };
    if (preparedData.barrios) {
      preparedData.barrios = preparedData.barrios.split(',').map(b => b.trim()).filter(b => b);
    } else {
      preparedData.barrios = [];
    }

    if (preparedData.comisarias.vecinales) {
      try {
        preparedData.comisarias.vecinales = JSON.parse(preparedData.comisarias.vecinales);
      } catch (e) {
        preparedData.comisarias.vecinales = [];
      }
    } else {
      preparedData.comisarias.vecinales = [];
    }

    return preparedData;
  };


  const handleCreateComuna = async (e) => {
    e.preventDefault();
    setError(null);

    const dataToSend = prepareComunaData(newComunaData);

    if (!dataToSend.comuna || !dataToSend.nombre || !dataToSend.descripcion || !dataToSend.dato_adicional ||
      !dataToSend.comisarias.comunal.nombre || !dataToSend.comisarias.comunal.direccion) {
      setError('Por favor, rellena todos los campos obligatorios.');
      return;
    }

    try {
      const createdComuna = await comunasService.createComuna(dataToSend);
      setComunas([...comunas, createdComuna.data]);
      setNewComunaData(initialComunaState);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la comuna. Verifica los datos y tu sesión.');
      console.error("Error al eliminar comuna:", err);
    }
  };

  const handleDeleteComuna = async (id) => {
    setError(null);
    if (window.confirm('¿Estás seguro de que quieres eliminar esta comuna?')) {
      try {
        await comunasService.deleteComuna(id);
        setComunas(comunas.filter(comuna => comuna._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar la comuna.');
        console.error("Error aleliminar comuna:", err);
      }
    }
  };

  const handleEditClick = (comuna) => {
    setEditingComunaId(comuna._id);
    setEditingComunaData({
      ...comuna,
      barrios: Array.isArray(comuna.barrios) ? comuna.barrios.join(', ') : '',
      comisarias: {
        ...comuna.comisarias,
        vecinales: Array.isArray(comuna.comisarias.vecinales)
          ? JSON.stringify(comuna.comisarias.vecinales)
          : ''
      }
    });
  };

  const handleUpdateComuna = async (e) => {
    e.preventDefault();
    setError(null);

    const dataToSend = prepareComunaData(editingComunaData);

    if (!dataToSend.comuna || !dataToSend.nombre || !dataToSend.descripcion || !dataToSend.dato_adicional ||
      !dataToSend.comisarias.comunal.nombre || !dataToSend.comisarias.comunal.direccion) {
      setError('Por favor, rellena todos los campos obligatorios para actualizar.');
      return;
    }

    try {
      const updatedComuna = await comunasService.updateComuna(editingComunaId, dataToSend);
      setComunas(comunas.map(comuna =>
        comuna._id === editingComunaId ? updatedComuna.data : comuna
      ));
      setEditingComunaId(null);
      setEditingComunaData(initialComunaState);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar la comuna. Verifica los datos y tu sesión.');
      console.error("Error actulizando comuna:", err);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Cargando comunas...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Gestión de Comunas</h1>

      {isAuthenticated ? (
        <div style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
          <h3>Crear Nueva Comuna</h3>
          <form onSubmit={handleCreateComuna} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Comuna (Número):</label>
              <input
                type="number"
                name="comuna"
                placeholder="Número de Comuna"
                value={newComunaData.comuna}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Nombre:</label>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre de la Comuna"
                value={newComunaData.nombre}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Descripción:</label>
              <input
                type="text"
                name="descripcion"
                placeholder="Descripción de la Comuna"
                value={newComunaData.descripcion}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Dato Adicional:</label>
              <input
                type="text"
                name="dato_adicional"
                placeholder="Dato Adicional"
                value={newComunaData.dato_adicional}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Barrios (separar por comas):</label>
              <input
                type="text"
                name="barrios"
                placeholder="Barrio1, Barrio2"
                value={newComunaData.barrios}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1', border: '1px dashed #ccc', padding: '10px', borderRadius: '5px' }}>
              <h4>Comisaría Comunal</h4>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Nombre Comunal:</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre Comisaría Comunal"
                    value={newComunaData.comisarias.comunal.nombre}
                    onChange={handleComunalChange}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Dirección Comunal:</label>
                  <input
                    type="text"
                    name="direccion"
                    placeholder="Dirección Comisaría Comunal"
                    value={newComunaData.comisarias.comunal.direccion}
                    onChange={handleComunalChange}
                    required
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Comisarías Vecinales (JSON de [{`{nombre,direccion,telefono}`}] o dejar vacío si no hay):</label>
              <input
                type="text"
                name="vecinales"
                placeholder={`[{ "nombre": "Vecinal 1", "direccion": "Dir 1", "telefono": "Tel 1" }]`}
                value={newComunaData.comisarias.vecinales}
                onChange={(e) => setNewComunaData(prev => ({
                  ...prev,
                  comisarias: {
                    ...prev.comisarias,
                    vecinales: e.target.value
                  }
                }))}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
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
              }}> Crear Comuna</button>
          </form>
        </div>
      ) : (
        <p style={{ color: '#888' }}>Inicia sesión para crear nuevas comunas.</p>
      )}

      <h2>Listado de Comunas ({comunas.length})</h2>
      {comunas.length === 0 ? (
        <p>No hay comunas disponibles.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {comunas.map((comuna) => (
            <li key={comuna._id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '5px', display: 'flex', flexDirection: 'column', gap: '5px', backgroundColor: 'white' }}>
              {editingComunaId === comuna._id ? (
                <form onSubmit={handleUpdateComuna} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.8em' }}>Comuna (Número):</label>
                    <input type="number" name="comuna" value={editingComunaData.comuna} onChange={handleEditChange} required style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.9em' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.8em' }}>Nombre:</label>
                    <input type="text" name="nombre" value={editingComunaData.nombre} onChange={handleEditChange} required style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.9em' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.8em' }}>Descripción:</label>
                    <input type="text" name="descripcion" value={editingComunaData.descripcion} onChange={handleEditChange} required style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.9em' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.8em' }}>Dato Adicional:</label>
                    <input type="text" name="dato_adicional" value={editingComunaData.dato_adicional} onChange={handleEditChange} required style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.9em' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.8em' }}>Barrios (separar por comas):</label>
                    <input type="text" name="barrios" value={editingComunaData.barrios} onChange={handleEditChange} required style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.9em' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', border: '1px dashed #ccc', padding: '10px', borderRadius: '5px' }}>
                    <h4>Comisaría Comunal</h4>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.8em' }}>Nombre Comunal:</label>
                        <input type="text" name="nombre" value={editingComunaData.comisarias.comunal.nombre} onChange={handleEditComunalChange} required style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.9em' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '2px', fontSize: '0.8em' }}>Dirección Comunal:</label>
                        <input type="text" name="direccion" value={editingComunaData.comisarias.comunal.direccion} onChange={handleEditComunalChange} required style={{ width: '100%', padding: '5px', border: '1px solid #ddd', borderRadius: '3px', fontSize: '0.9em' }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Comisarías Vecinales (JSON de [{`{nombre,direccion,telefono}`}]):</label>
                    <input
                      type="text"
                      name="vecinales"
                      placeholder={`[{ "nombre": "Vecinal 1", "direccion": "Dir 1", "telefono": "Tel 1" }]`}
                      value={editingComunaData.comisarias.vecinales}
                      onChange={(e) => setEditingComunaData(prev => ({
                        ...prev,
                        comisarias: {
                          ...prev.comisarias,
                          vecinales: e.target.value
                        }
                      }))}
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '5px', marginTop: '5px' }}>
                    <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Guardar</button>
                    <button type="button" onClick={() => setEditingComunaId(null)} style={{ padding: '5px 10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Cancelar</button>
                  </div>
                </form>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{comuna.nombre} (Comuna: {comuna.comuna})</span>
                    <span style={{ fontSize: '0.8em', color: '#666' }}>ID: {comuna._id}</span>
                  </div>
                  <div style={{ margin: '0', fontSize: '0.9em' }}>
                    **Descripción:** {comuna.descripcion} <br />
                    **Dato Adicional:** {comuna.dato_adicional} <br />
                    **Barrios:** {Array.isArray(comuna.barrios) ? comuna.barrios.join(', ') : comuna.barrios || 'N/A'} <br />

                    **Comisaría Comunal:** {comuna.comisarias?.comunal?.nombre || 'N/A'} (Dir: {comuna.comisarias?.comunal?.direccion || 'N/A'}) <br />

                    **Comisarías Vecinales:**
                    {Array.isArray(comuna.comisarias?.vecinales) && comuna.comisarias.vecinales.length > 0 ? (
                      <ul style={{ marginTop: '5px', marginBottom: '0' }}>
                        {comuna.comisarias.vecinales.map((vecinal, index) => (
                          <li key={index} style={{ marginLeft: '20px', fontSize: '0.9em' }}>
                            {vecinal.nombre || 'N/A'} (Dir: {vecinal.direccion || 'N/A'}, Tel: {vecinal.telefono || 'N/A'})
                          </li>
                        ))}
                      </ul>
                    ) : 'N/A'}
                  </div>
                  {isAuthenticated && (
                    <div style={{ alignSelf: 'flex-end', marginTop: '10px' }}>
                      <button
                        onClick={() => handleEditClick(comuna)}
                        style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteComuna(comuna._id)}
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

export default ComunasPage;