import React, { useEffect, useState } from 'react';
import Main from '../template/Main';
import { categoriaService, pratoService } from '../../services/api';
import { validarPrato } from '../../services/cardapioRegras';

function criarEstadoInicial(categoriaIdPadrao = '') {
  return {
    id: null,
    categoriaId: categoriaIdPadrao,
    nome: '',
    descricao: '',
    preco: ''
  };
}

export default function PratoCrud({ categoriaInicialId = '' }) {
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltroId, setCategoriaFiltroId] = useState(String(categoriaInicialId || ''));
  const [prato, setPrato] = useState(criarEstadoInicial(String(categoriaInicialId || '')));
  const [pratos, setPratos] = useState([]);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function carregarCategoriasEPratos(filtroId = categoriaFiltroId) {
    setCarregando(true);
    setMensagemErro('');
    try {
      const [listaCategorias, listaPratos] = await Promise.all([
        categoriaService.listar(),
        filtroId ? pratoService.listarPorCategoria(filtroId) : pratoService.listarTodos()
      ]);

      setCategorias(listaCategorias);
      setPratos(listaPratos);

      if (!filtroId && listaCategorias.length > 0 && !prato.categoriaId) {
        const primeiraId = String(listaCategorias[0].id);
        setPrato((prev) => ({ ...prev, categoriaId: primeiraId }));
      }
    } catch {
      setMensagemErro('Erro ao carregar pratos ou categorias. Verifica a API na porta 3001.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    const idNormalizado = String(categoriaInicialId || '');
    setCategoriaFiltroId(idNormalizado);
    setPrato(criarEstadoInicial(idNormalizado));
    carregarCategoriasEPratos(idNormalizado);
  }, [categoriaInicialId]);

  async function alterarCategoriaFiltro(novoId) {
    setCategoriaFiltroId(novoId);
    setPrato(criarEstadoInicial(novoId));
    setMensagemErro('');
    setMensagemSucesso('');
    await carregarCategoriasEPratos(novoId);
  }

  function limparFormulario() {
    setPrato(
      criarEstadoInicial(
        categoriaFiltroId || (categorias[0]?.id ? String(categorias[0].id) : '')
      )
    );
    setMensagemErro('');
  }

  async function guardarPrato(e) {
    e.preventDefault();
    setMensagemSucesso('');

    const erroValidacao = validarPrato(prato);
    if (erroValidacao) {
      setMensagemErro(erroValidacao);
      return;
    }

    setMensagemErro('');
    try {
      if (prato.id) {
        const atualizado = await pratoService.atualizar(prato.id, prato);
        setPratos((prev) =>
          prev
            .map((item) => (item.id === atualizado.id ? atualizado : item))
            .filter(
              (item) =>
                !categoriaFiltroId || String(item.categoriaId) === String(categoriaFiltroId)
            )
        );
        setMensagemSucesso('Prato atualizado com sucesso.');
      } else {
        const criado = await pratoService.criar(prato);
        if (!categoriaFiltroId || String(criado.categoriaId) === String(categoriaFiltroId)) {
          setPratos((prev) => [...prev, criado]);
        }
        setMensagemSucesso('Prato cadastrado com sucesso.');
      }
      limparFormulario();
    } catch {
      setMensagemErro('Erro ao guardar o prato no servidor.');
    }
  }

  function editarPrato(item) {
    setPrato({
      id: item.id,
      categoriaId: String(item.categoriaId),
      nome: item.nome,
      descricao: item.descricao,
      preco: String(item.preco)
    });
    setMensagemErro('');
    setMensagemSucesso('');
  }

  async function removerPrato(id) {
    setMensagemSucesso('');
    setMensagemErro('');
    try {
      await pratoService.excluir(id);
      setPratos((prev) => prev.filter((item) => item.id !== id));
      if (prato.id === id) {
        limparFormulario();
      }
      setMensagemSucesso('Prato excluído com sucesso.');
    } catch {
      setMensagemErro('Erro ao excluir o prato.');
    }
  }

  function obterNomeCategoria(categoriaId) {
    const encontrada = categorias.find((c) => String(c.id) === String(categoriaId));
    return encontrada ? encontrada.nome : 'Sem categoria';
  }

  return (
    <Main icon="cutlery" title="Pratos" subtitle="Gestão de Pratos por Categoria: incluir, listar, alterar e excluir!">
      <div className="row mb-3">
        <div className="col-12 col-md-6">
          <label htmlFor="filtroCategoria">Filtrar por Categoria</label>
          <select
            id="filtroCategoria"
            className="form-control"
            value={categoriaFiltroId}
            onChange={(e) => alterarCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={String(cat.id)}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={guardarPrato} className="mb-4">
        <div className="row">
          <div className="col-12 col-md-4">
            <div className="form-group">
              <label htmlFor="categoriaPrato">Categoria</label>
              <select
                id="categoriaPrato"
                className="form-control"
                value={prato.categoriaId}
                onChange={(e) => setPrato({ ...prato, categoriaId: e.target.value })}
              >
                <option value="">Selecione...</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="form-group">
              <label htmlFor="nomePrato">Nome do Prato</label>
              <input
                id="nomePrato"
                type="text"
                className="form-control"
                placeholder="Ex: Bife Acebolado"
                value={prato.nome}
                onChange={(e) => setPrato({ ...prato, nome: e.target.value })}
              />
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="form-group">
              <label htmlFor="precoPrato">Preço (R$)</label>
              <input
                id="precoPrato"
                type="number"
                step="0.01"
                min="0.01"
                className="form-control"
                placeholder="Ex: 19.90"
                value={prato.preco}
                onChange={(e) => setPrato({ ...prato, preco: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="descricaoPrato">Descrição / Acompanhamentos</label>
              <input
                id="descricaoPrato"
                type="text"
                className="form-control"
                placeholder="Ex: Arroz, feijão, batata frita e salada"
                value={prato.descricao}
                onChange={(e) => setPrato({ ...prato, descricao: e.target.value })}
              />
            </div>
          </div>
        </div>

        {mensagemErro && (
          <div className="alert alert-danger mt-3" role="alert">
            {mensagemErro}
          </div>
        )}

        {mensagemSucesso && (
          <div className="alert alert-success mt-3" role="alert">
            {mensagemSucesso}
          </div>
        )}

        <hr />
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            {prato.id ? 'Atualizar Prato' : 'Salvar Prato'}
          </button>
          <button type="button" className="btn btn-secondary ms-2" onClick={limparFormulario}>
            Cancelar
          </button>
        </div>
      </form>

      {carregando ? (
        <p>A carregar pratos...</p>
      ) : (
        <table className="table mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Categoria</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pratos.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Nenhum prato cadastrado nesta seleção.
                </td>
              </tr>
            ) : (
              pratos.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{obterNomeCategoria(item.categoriaId)}</td>
                  <td>{item.nome}</td>
                  <td>{item.descricao}</td>
                  <td>R$ {Number(item.preco).toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editarPrato(item)}
                    >
                      <i className="fa fa-pencil" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removerPrato(item.id)}
                    >
                      <i className="fa fa-trash" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </Main>
  );
}