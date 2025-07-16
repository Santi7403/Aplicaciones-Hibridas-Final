import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Página No Encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/">
        <button style={{ padding: '10px 20px', fontSize: '1em', cursor: 'pointer' }}>
          Volver a la Página Principal
        </button>
      </Link>
    </div>
  );
}

export default NotFoundPage;