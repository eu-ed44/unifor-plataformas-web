import React, { useEffect, useState } from 'react';
import Main from '../template/Main';
import { categoriaService, pratoService } from '../../services/api';

const estadoInicial = {
  id: null,
  categoriaId: '',
  nome: '',
  preco: '',
  descricao: ''
};

function parsePreco(valor) {
  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : NaN;
  }
  if (typeof valor !== 'string') return NaN;

  const limpo = valor
    .trim()
    .replace(/R\$/gi, '')
    .replace(/\s+/g, '')
    .replace(',', '.');

  if (!limpo) return NaN;
  const numero = Number(limpo);
  return Number.isFinite(numero) ? numero : NaN;
}

function formatarMoeda(valor) {
  const numero = parsePreco(valor);
  if (Number.isNaN(numero)) return 'R$ 0,00';
  return `R$ ${numero.toFixed(2).replace('.', ',')}`;
}

function gerarProximoId(itens = []) {
  const maiorId = itens.reduce((max, item) => {
    const num = Number(item?.id);
    if (Number.isInteger(num) && num > max) {
      return num;
    }
    return max;
  }, 0);

  return String(maiorId + 1);
}

export default function PratoCrud({ categoriaInicialId, categoriaSelecionadaId }) {
  const idCategoriaRota = categoriaInicialId ?? categoriaSelecionadaId;

  const [prato, setPrato] = useState(estadoInicial);
  const [pratos, setPratos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoriaId, setFiltroCategoriaId] = useState(
    idCategoriaRota ? String(idCategoriaRota) : ''
  );
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function carregarDados() {
    setCarregando(true);
    setMensagemErro('');
    try {
      const [listaCategorias, listaPratos] = await Promise.all([
        categoriaService.listar(),
        pratoService.listarTodos()
      ]);
      const cats = Array.isArray(listaCategorias) ? listaCategorias : [];
      const prts = Array.isArray(listaPratos) ? listaPratos : [];

      setCategorias(cats);
      setPratos(prts);

      setPrato((prev) => {
        if (prev.categoriaId) return prev;
        const categoriaPadrao = idCategoriaRota
          ? String(idCategoriaRota)
          : cats[0]?.id
            ? String(cats[0].id)
            : '';
        return { ...prev, categoriaId: categoriaPadrao };
      });
    } catch {
      setMensagemErro(
        'Não foi possível carregar os pratos ou categorias. Verifica se a API está ativa.'
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const novoFiltro = idCategoriaRota ? String(idCategoriaRota) : '';
    setFiltroCategoriaId(novoFiltro);
    if (novoFiltro) {
      setPrato((prev) => (prev.id ? prev : { ...prev, categoriaId: novoFiltro }));
    }
  }, [idCategoriaRota]);

  function limparFormulario() {
    const padraoCatId = filtroCategoriaId || (categorias[0]?.id ? String(categorias[0].id) : '');
    setPrato({ ...estadoInicial, categoriaId: padraoCatId });
    setMensagemErro('');
  }

  function obterNomeCategoria(pratoItem) {
    const encontrada = categorias.find(
      (cat) => String(cat.id) === String(pratoItem.categoriaId)
    );
    return encontrada ? encontrada.nome : '-';
  }

  async function guardarPrato(e) {
    e.preventDefault();
    setMensagemSucesso('');

    const nomeLimpo = prato.nome.trim();
    const descricaoLimpa = prato.descricao.trim();
    const precoNumero = parsePreco(prato.preco);
    const categoriaIdEscolhida =
      prato.categoriaId || (categorias[0]?.id ? String(categorias[0].id) : '');
    const isEditando = Boolean(prato.id);

    if (!categoriaIdEscolhida) {
      setMensagemErro('Selecione uma categoria antes de guardar o prato.');
      return;
    }

    if (!nomeLimpo) {
      setMensagemErro('Informe o nome do prato.');
      return;
    }

    if (Number.isNaN(precoNumero) || precoNumero <= 0) {
      setMensagemErro('Informe um preço válido maior que zero (ex.: 33,25).');
      return;
    }

    setMensagemErro('');
    setEnviando(true);

    try {
      if (isEditando) {
        const payloadAtualizacao = {
          id: prato.id,
          categoriaId: String(categoriaIdEscolhida),
          nome: nomeLimpo,
          preco: Number(precoNumero.toFixed(2)),
          descricao: descricaoLimpa
        };
        const atualizado = await pratoService.atualizar(prato.id, payloadAtualizacao);
        setPratos((prev) =>
          prev.map((item) =>
            String(item.id) === String(prato.id) ? { ...payloadAtualizacao, ...atualizado } : item
          )
        );
        setMensagemSucesso('Prato atualizado com sucesso.');
      } else {
        const proximoId = gerarProximoId(pratos);
        const payloadCriacao = {
          id: proximoId,
          categoriaId: String(categoriaIdEscolhida),
          nome: nomeLimpo,
          preco: Number(precoNumero.toFixed(2)),
          descricao: descricaoLimpa
        };
        const criado = await pratoService.criar(payloadCriacao);
        const registroFinal = criado?.id ? criado : payloadCriacao;
        setPratos((prev) => [...prev, registroFinal]);
        setMensagemSucesso(`Prato cadastrado com sucesso (ID #${registroFinal.id}).`);
      }

      limparFormulario();
    } catch {
      setMensagemErro('Erro ao guardar o prato no servidor.');
    } finally {
      setEnviando(false);
    }
  }

  function editarPrato(item) {
    const valorNumerico = parsePreco(item.preco);

    setMensagemErro('');
    setMensagemSucesso('');
    setPrato({
      id: item.id,
      categoriaId: item.categoriaId ? String(item.categoriaId) : '',
      nome: item.nome || '',
      preco: Number.isNaN(valorNumerico) ? '' : valorNumerico.toFixed(2).replace('.', ','),
      descricao: item.descricao || ''
    });
  }

  async function removerPrato(item) {
    setMensagemSucesso('');
    setMensagemErro('');
    try {
      await pratoService.excluir(item.id);
      setPratos((prev) => prev.filter((p) => String(p.id) !== String(item.id)));
      if (String(prato.id) === String(item.id)) {
        limparFormulario();
      }
      setMensagemSucesso('Prato excluído com sucesso.');
    } catch {
      setMensagemErro('Erro ao excluir o prato.');
    }
  }

  const pratosFiltrados = filtroCategoriaId
    ? pratos.filter((p) => String(p.categoriaId) === String(filtroCategoriaId))
    : pratos;

  return (
    <Main
      icon="cutlery"
      title="Pratos"
      subtitle="Gestão de Pratos: incluir, listar, alterar e excluir pratos!"
    >
      <div className="mb-3">
        <label htmlFor="filtroCategoria" className="form-label fw-bold">
          Filtrar por Categoria
        </label>
        <select
          id="filtroCategoria"
          className="form-select"
          value={filtroCategoriaId}
          onChange={(e) => setFiltroCategoriaId(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.nome}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={guardarPrato} className="mb-4">
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <label htmlFor="categoriaPrato" className="form-label">
              Categoria
            </label>
            <select
              id="categoriaPrato"
              className="form-select"
              value={prato.categoriaId}
              onChange={(e) => setPrato({ ...prato, categoriaId: e.target.value })}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="nomePrato" className="form-label">
              Nome do Prato
            </label>
            <input
              id="nomePrato"
              type="text"
              className="form-control"
              placeholder="Ex: Bife Acebolado"
              value={prato.nome}
              onChange={(e) => setPrato({ ...prato, nome: e.target.value })}
            />
          </div>

          <div className="col-12 col-md-4">
            <label htmlFor="precoPrato" className="form-label">
              Preço (R$)
            </label>
            <input
              id="precoPrato"
              type="text"
              inputMode="decimal"
              className="form-control"
              placeholder="Ex: 19,90"
              value={prato.preco}
              onChange={(e) => setPrato({ ...prato, preco: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="descricaoPrato" className="form-label">
            Descrição / Acompanhamentos
          </label>
          <input
            id="descricaoPrato"
            type="text"
            className="form-control"
            placeholder="Ex: Arroz, feijão, batata frita e salada"
            value={prato.descricao}
            onChange={(e) => setPrato({ ...prato, descricao: e.target.value })}
          />
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
        <div className="d-flex justify-content-end gap-2">
          <button type="submit" className="btn btn-primary" disabled={enviando}>
            {prato.id ? 'Atualizar Prato' : 'Salvar Prato'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={limparFormulario}
            disabled={enviando}
          >
            Cancelar
          </button>
        </div>
      </form>

      {carregando ? (
        <p>A carregar pratos...</p>
      ) : (
        <div className="table-responsive">
          <table className="table mt-4 align-middle">
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
              {pratosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    Nenhum prato cadastrado.
                  </td>
                </tr>
              ) : (
                pratosFiltrados.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{obterNomeCategoria(item)}</td>
                    <td>{item.nome}</td>
                    <td>{item.descricao}</td>
                    <td>{formatarMoeda(item.preco)}</td>
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
                        onClick={() => removerPrato(item)}
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