// Criando um array vazio para armazenar os itens que o usuário vai adicionar
const itens = [];

/**
 * Função chamada sempre que o usuário quiser adicionar um novo item
 * Seja clicando no botão ou pressionando Enter.
 */
function adicionarItem() {
  // Pegando o elemento input pelo seu id "item"
  const input = document.getElementById("item");

  // Verificando se o valor digitado não está vazio (ignorando espaços em branco nas pontas)
  if (input.value.trim() !== "") {
    // Adicionamos o valor ao array de itens
    itens.push(input.value.trim());

    // Atualizando a lista exibida na tela
    atualizarLista();

    // Limpando o campo de input após adicionar
    input.value = "";
  }
}

/**
 * Função responsável por desenhar a lista de itens na tela
 * Sempre é chamada depois de adicionar ou remover um item
 */
function atualizarLista() {
  // Pegando o elemento UL (lista) onde os itens serão exibidos
  const lista = document.getElementById("lista");

  // Limpando o conteúdo da lista para reconstruí-la do zero
  lista.innerHTML = "";

  // Percorrendo o array de itens e para cada item:
  itens.forEach((item, index) => {
    // Criando um elemento <li> (item de lista)
    const li = document.createElement("li");

    // Definindo o texto do <li> com o conteúdo do item atual
    li.textContent = item;

    // Criando o botão de exclusão ao lado de cada item
    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "🗑️"; // Ícone de lixeira
    botaoExcluir.style.marginLeft = "10px"; // Espaçamento entre o texto e o botão

    // Adicionando o evento de clique no botão de exclusão
    botaoExcluir.addEventListener("click", () => {
      // Quando clicado, remove-se o item correspondente
      removerItem(index);
    });

    // Adicionando o botão de exclusão dentro do <li>
    li.appendChild(botaoExcluir);

    // Adicionando o <li> completo na lista (UL)
    lista.appendChild(li);
  });
}

/**
 * Função que remove um item do array e atualiza a lista na tela
 * Recebe o índice do item que será removido
 */
function removerItem(index) {
  // Método splice para remover o item da posição indicada
  itens.splice(index, 1);

  // Atualizando a lista após a remoção
  atualizarLista();
}

/**
 * Função responsável por realizar o sorteio aleatório
 * Escolhe um item do array e exibe o resultado
 */
function sortear() {
  // Verifica se há itens no array antes de tentar sortear
  if (itens.length === 0) {
    alert("Adicione itens antes de sortear!");
    return;
  }

  // Gera um número aleatório entre 0 e o tamanho do array
  const indice = Math.floor(Math.random() * itens.length);

  // Pegando o elemento onde será exibido o resultado
  const resultado = document.getElementById("resultado");

  // Exibindo o item sorteado na tela
  resultado.textContent = `Resultado: ${itens[indice]}`;
}

/**
 * Adicionando o evento de teclado no input
 * Sempre que o usuário digitar algo e pressionar Enter, chamamos a função adicionarItem()
 */
const input = document.getElementById("item");

input.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    adicionarItem();
  }
});