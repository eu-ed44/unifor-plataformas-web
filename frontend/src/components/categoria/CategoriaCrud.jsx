import React, { useEffect, useState } from 'react';
import Main from '../template/Main';
import { categoriaService, pratoService } from '../../services/api';
import { podeExcluirCategoria, validarCategoria } from '../../services/cardapioRegras';

const estadoInicial = { id: null, nome: '' };

export default function CategoriaCrud({ onSelecionarCategoria }) {
  const [categoria, setCategoria] = useState(estadoInicial);
  const [categorias, setCategorias] = useState([]);
  const [pratos, setPratos] = useState([]);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function carregarDados() {
    setCarregando(true);
    setMensagemErro('');
    try {
      const [listaCategorias, listaPratos] = await Promise.all([
        categoriaService.listar(),
        pratoService.listarTodos()
      ]);
      setCategorias(listaCategorias);
      setPratos(listaPratos);
    } catch {
      setMensagemErro('Não foi possível carregar as categorias. Verifica se a API está ativa.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function limparFormulario() {
    setCategoria(estadoInicial);
    setMensagemErro('');
  }

  async function guardarCategoria(e) {
    e.preventDefault();
    setMensagemSucesso('');

    const erroValidacao = validarCategoria(categoria.nome, categorias, categoria.id);
    if (erroValidacao) {
      setMensagemErro(erroValidacao);
      return;
    }

    setMensagemErro('');
    try {
      if (categoria.id) {
        const atualizada = await categoriaService.atualizar(categoria.id, categoria);
        setCategorias((prev) => prev.map((item) => (item.id === atualizada.id ? atualizada : item)));
        setMensagemSucesso('Categoria atualizada com sucesso.');
      } else {
        const criada = await categoriaService.criar(categoria);
        setCategorias((prev) => [...prev, criada]);
        setMensagemSucesso('Categoria cadastrada com sucesso.');
      }
      setCategoria(estadoInicial);
    } catch {
      setMensagemErro('Erro ao guardar a categoria no servidor.');
    }
  }

  function editarCategoria(item) {
    setCategoria({ id: item.id, nome: item.nome });
    setMensagemErro('');
    setMensagemSucesso('');
  }

  async function removerCategoria(item) {
    setMensagemSucesso('');
    const verificacao = podeExcluirCategoria(item.id, pratos);
    if (!verificacao.permitido) {
      setMensagemErro(verificacao.mensagem);
      return;
    }

    setMensagemErro('');
    try {
      await categoriaService.excluir(item.id);
      setCategorias((prev) => prev.filter((cat) => cat.id !== item.id));
      if (categoria.id === item.id) {
        setCategoria(estadoInicial);
      }
      setMensagemSucesso('Categoria removida com sucesso.');
    } catch {
      setMensagemErro('Erro ao excluir a categoria.');
    }
  }

  function contarPratos(categoriaId) {
    return pratos.filter((p) => String(p.categoriaId) === String(categoriaId)).length;
  }

  return (
    <Main icon="tags" title="Categorias" subtitle="Gestão de Categorias: incluir, listar, alterar e excluir categorias!">
      <form onSubmit={guardarCategoria} className="mb-4">
        <div className="row">
          <div className="col-12 col-md-8">
            <div className="form-group">
              <label htmlFor="nomeCategoria">Nome da Categoria</label>
              <input
                id="nomeCategoria"
                type="text"
                className="form-control"
                placeholder="Ex: Executivas, Fitness, Sobremesas..."
                value={categoria.nome}
                onChange={(e) => setCategoria({ ...categoria, nome: e.target.value })}
              />
            </div>
          </div>
        </div>

        {mensagemErro && (
          <div className="alert alert-danger mt-2" role="alert">
            {mensagemErro}
          </div>
        )}

        {mensagemSucesso && (
          <div className="alert alert-success mt-2" role="alert">
            {mensagemSucesso}
          </div>
        )}

        <hr />
        <div className="d-flex flex-wrap justify-content-end gap-2">
          <button type="submit" className="btn btn-primary">
            {categoria.id ? 'Atualizar Categoria' : 'Salvar Categoria'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={limparFormulario}>
            Cancelar
          </button>
        </div>
      </form>

      {carregando ? (
        <p>A carregar categorias...</p>
      ) : (
        <div className="table-responsive mt-4">
          <table className="table mb-0 align-middle" style={{ minWidth: '520px' }}>
            <thead>
              <tr className="text-nowrap">
                <th>ID</th>
                <th>Nome</th>
                <th>Qtd. de Pratos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    Nenhuma categoria cadastrada.
                  </td>
                </tr>
              ) : (
                categorias.map((item) => (
                  <tr key={item.id}>
                    <td className="text-nowrap">{item.id}</td>
                    <td className="text-nowrap">{item.nome}</td>
                    <td className="text-nowrap">{contarPratos(item.id)}</td>
                    <td className="text-nowrap">
                      {onSelecionarCategoria && (
                        <button
                          type="button"
                          className="btn btn-info btn-sm me-2"
                          onClick={() => onSelecionarCategoria(item.id)}
                        >
                          Ver Pratos
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => editarCategoria(item)}
                      >
                        <i className="fa fa-pencil" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removerCategoria(item)}
                      >
                        <i className="fa fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Main>
  );
}