// lê o que o usuário digita no terminal
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// pergunta algo e espera a resposta
function perguntar(pergunta) {
  return new Promise((resolve) => rl.question(pergunta, resolve));
}

// desenha uma caixa com borda no terminal
function caixa(linhas) {
  const largura = Math.max(...linhas.map((l) => l.length)) + 2;
  console.log('╔' + '═'.repeat(largura) + '╗');
  linhas.forEach((linha) => {
    console.log('║ ' + linha.padEnd(largura - 1) + '║');
  });
  console.log('╚' + '═'.repeat(largura) + '╝');
}

// variáveis da ficha do item (Etapa 1)
const nomeItem = 'Espada das Sombras';
const precoItem = 250;
const raridadeItem = 'Raro';
const quantidadeEstoque = 12;

// lista de itens do jogo
const catalogo = [
  { nome: 'Espada das Sombras', preco: 250, quantidadeEstoque: 12 },
  { nome: 'Asas Douradas', preco: 480, quantidadeEstoque: 8 },
  { nome: 'Capacete Neon', preco: 90, quantidadeEstoque: 20 },
  { nome: 'Pet Dragão', preco: 600, quantidadeEstoque: 3 },
  { nome: 'Skin Cyberpunk', preco: 150, quantidadeEstoque: 15 },
];

async function main() {
  await menuPrincipal();
}

// Etapa 5 + menu interativo
async function menuPrincipal() {
  let continuar = true;

  while (continuar) {
    caixa([
      'SISTEMA DE CADASTRO DE ITENS',
      '1 - Incluir item',
      '2 - Excluir item',
      '3 - Comprar item',
      '4 - Sair',
    ]);

    const opcao = await perguntar('Escolha uma opção: ');

    if (opcao === '1') {
      await incluirItem();
    } else if (opcao === '2') {
      await excluirItem();
    } else if (opcao === '3') {
      await comprarItem();
    } else if (opcao === '4') {
      continuar = false;
    } else {
      console.log('Opção inválida.');
    }
  }

  rl.close();
}

// adiciona um item novo
async function incluirItem() {
  const nome = await perguntar('Nome do item: ');
  const preco = Number(await perguntar('Preço do item: '));

  if (preco < 0) {
    console.log('Erro: o preço do item não pode ser negativo.');
    return;
  }

  const raridade = await perguntar('Raridade do item (Comum, Raro ou Lendário): ');
  const raridadesValidas = ['Comum', 'Raro', 'Lendário'];

  if (!raridadesValidas.includes(raridade)) {
    console.log('Erro: raridade inválida. Use Comum, Raro ou Lendário.');
    return;
  }

  const estoque = Number(await perguntar('Quantidade em estoque: '));
  const emDestaque = preco > 500 ? true : false;
  const disponivelParaCompra = estoque > 0 && preco > 0;

  catalogo.push({ nome, preco, quantidadeEstoque: estoque, raridade });

  caixa([
    'ITEM INCLUÍDO',
    `Nome: ${nome}`,
    `Preço: R$ ${preco}`,
    `Raridade: ${raridade}`,
    `Estoque: ${estoque} unidades`,
    `Em destaque: ${emDestaque}`,
    `Disponível para compra: ${disponivelParaCompra}`,
  ]);
}

// remove um item da lista
async function excluirItem() {
  if (catalogo.length === 0) {
    console.log('Não há itens cadastrados.');
    return;
  }

  caixa(['ITENS CADASTRADOS', ...catalogo.map((item, i) => `${i + 1} - ${item.nome}`)]);

  const numero = Number(await perguntar('Número do item para excluir: '));
  const indice = numero - 1;

  if (indice < 0 || indice >= catalogo.length) {
    console.log('Item inválido.');
    return;
  }

  const removido = catalogo.splice(indice, 1)[0];
  console.log(`Item removido: ${removido.nome}`);
}

// compra um item e desconta o estoque
async function comprarItem() {
  if (catalogo.length === 0) {
    console.log('Não há itens cadastrados.');
    return;
  }

  caixa(['ITENS DISPONÍVEIS', ...catalogo.map((item, i) => `${i + 1} - ${item.nome} (estoque: ${item.quantidadeEstoque})`)]);

  const numero = Number(await perguntar('Número do item que deseja comprar: '));
  const indice = numero - 1;

  if (indice < 0 || indice >= catalogo.length) {
    console.log('Item inválido.');
    return;
  }

  const item = catalogo[indice];

  if (item.quantidadeEstoque <= 0) {
    console.log('Item esgotado!');
    return;
  }

  const quantidade = Number(await perguntar('Quantidade que deseja comprar: '));

  if (quantidade <= 0) {
    console.log('Erro: a quantidade precisa ser maior que 0.');
    return;
  }

  if (quantidade > item.quantidadeEstoque) {
    console.log(`Estoque insuficiente. Disponível: ${item.quantidadeEstoque} unidades.`);
    return;
  }

  let restante = quantidade;
  while (restante > 0) {
    item.quantidadeEstoque--;
    restante--;
    console.log(`Estoque restante de ${item.nome}: ${item.quantidadeEstoque}`);
  }

  const total = quantidade * item.preco;
  console.log(`Compra realizada com sucesso! Total: R$ ${total}`);

  if (item.quantidadeEstoque === 0) {
    console.log('Item esgotado!');
  }
}

main();