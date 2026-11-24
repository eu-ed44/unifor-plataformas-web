export function normalizarTexto(texto = '') {
  return texto.trim().toLowerCase();
}

export function validarCategoria(nome, categoriasExistentes = [], categoriaEditandoId = null) {
  const nomeLimpo = (nome || '').trim();

  if (!nomeLimpo) {
    return 'Informe o nome da categoria.';
  }

  const duplicada = categoriasExistentes.some(
    (cat) =>
      String(cat.id) !== String(categoriaEditandoId ?? '') &&
      normalizarTexto(cat.nome) === normalizarTexto(nomeLimpo)
  );

  if (duplicada) {
    return 'Já existe uma categoria cadastrada com esse nome.';
  }

  return null;
}

export function podeExcluirCategoria(categoriaId, todosOsPratos = []) {
  const possuiPratos = todosOsPratos.some(
    (prato) => String(prato.categoriaId) === String(categoriaId)
  );

  if (possuiPratos) {
    return {
      permitido: false,
      mensagem: 'Não é possível excluir uma categoria que possui pratos cadastrados.'
    };
  }

  return { permitido: true, mensagem: null };
}

export function validarPrato({ nome, descricao, preco, categoriaId }) {
  if (!String(categoriaId || '').trim()) {
    return 'Selecione uma categoria para o prato.';
  }

  if (!(nome || '').trim()) {
    return 'Informe o nome do prato.';
  }

  if (!(descricao || '').trim()) {
    return 'Informe a descrição / acompanhamentos do prato.';
  }

  const precoNumero = Number(preco);
  if (
    preco === '' ||
    preco === null ||
    preco === undefined ||
    Number.isNaN(precoNumero) ||
    precoNumero <= 0
  ) {
    return 'O preço do prato deve ser um valor numérico maior que zero.';
  }

  return null;
}