import React from 'react';
import { Routes as RouterRoutes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';

import Home from './components/home/Home';
import CategoriaCrud from './components/categoria/CategoriaCrud';
import PratoCrud from './components/prato/PratoCrud';

function CategoriasRouteWrapper() {
  const navigate = useNavigate();

  function handleSelecionarCategoria(categoriaId) {
    navigate(`/categorias/${categoriaId}/pratos`);
  }

  return <CategoriaCrud onSelecionarCategoria={handleSelecionarCategoria} />;
}

function PratosCategoriaRouteWrapper() {
  const { id } = useParams();
  return <PratoCrud categoriaInicialId={id} />;
}

export default function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/categorias" element={<CategoriasRouteWrapper />} />
      <Route path="/categorias/:id/pratos" element={<PratosCategoriaRouteWrapper />} />
      <Route path="/pratos" element={<PratoCrud />} />
      <Route path="/users" element={<Navigate to="/categorias" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
}