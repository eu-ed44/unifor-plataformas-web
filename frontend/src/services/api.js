import axios from 'axios';

const API_URL = (
  process.env.REACT_APP_API_URL || 'http://localhost:3001'
).replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const categoriaService = {
  listar: async () => {
    const response = await api.get('/categorias');
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  criar: async (categoria) => {
    const response = await api.post('/categorias', {
      nome: (categoria.nome || '').trim()
    });
    return response.data;
  },

  atualizar: async (id, categoria) => {
    const response = await api.put(`/categorias/${id}`, {
      nome: (categoria.nome || '').trim()
    });
    return response.data;
  },

  excluir: async (id) => {
    await api.delete(`/categorias/${id}`);
  }
};

export const pratoService = {
  listarTodos: async () => {
    const response = await api.get('/pratos');
    return response.data;
  },

  listarPorCategoria: async (categoriaId) => {
    const response = await api.get('/pratos');
    return response.data.filter(
      (prato) => String(prato.categoriaId) === String(categoriaId)
    );
  },

  criar: async (prato) => {
    const response = await api.post('/pratos', {
      categoriaId: String(prato.categoriaId),
      nome: (prato.nome || '').trim(),
      descricao: (prato.descricao || '').trim(),
      preco: Number(prato.preco)
    });
    return response.data;
  },

  atualizar: async (id, prato) => {
    const response = await api.put(`/pratos/${id}`, {
      categoriaId: String(prato.categoriaId),
      nome: (prato.nome || '').trim(),
      descricao: (prato.descricao || '').trim(),
      preco: Number(prato.preco)
    });
    return response.data;
  },

  excluir: async (id) => {
    await api.delete(`/pratos/${id}`);
  }
};

export default api;