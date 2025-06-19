// Array vazio para armazenar os itens
const itens = [];

function adicionarItem() {
  const input = document.getElementById("item"); // Input
  const textoDigitado = input.value.trim(); // Trimando o input

  if (textoDigitado === "") return; // Se não tiver valor, return

  const novosItens = textoDigitado.split(",") // Divide o texto em itens separados por vírgula
    .map(item => item.trim()) // Remove os espaços extras de cada item

    .filter(item => item !== ""); // Remove itens vazios (caso tenha ", ,")

  // forEach separar cada item e dar o push no array
  novosItens.forEach(item => {
    itens.push(item);
  });

  atualizarLista(); // Func lista visual
  input.value = ""; // Limpa o campo
}

function atualizarLista() {
  const lista = document.getElementById("lista");
  lista.innerHTML = ""; // Limpando o conteúdo da lista para reconstruí-la do zero

  // forEach do array de itens
  itens.forEach((item, index) => {
    const li = document.createElement("li"); // Criando um elemento <li> (item de lista)
    li.textContent = item; // Definindo o texto do <li> com o conteúdo do item atual

    // Botão de exclusão ao lado de cada item
    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "🗑️"; // Ícone de lixeira
    botaoExcluir.style.marginLeft = "10px"; // Espaçamento entre o texto e o botão

    botaoExcluir.addEventListener("click", () => {
      removerItem(index);
    });

    li.appendChild(botaoExcluir); // Appendando o botão de exclusão dentro do <li>

    lista.appendChild(li); // Appendando o <li> completo na lista (UL)
  });
}

function removerItem(index) {
  itens.splice(index, 1); // Método splice para remover o item da posição indicada
  atualizarLista(); // Atualizando a lista após a remoção com splice
}

function sortear() {
  if (itens.length === 0) { // Verifica se há itens no array antes de tentar sortear
    alert("Adicione itens antes de sortear!");
    return;
  }

  const indice = Math.floor(Math.random() * itens.length); // Número aleatório entre 0 e o tamanho do array
  const resultado = document.getElementById("resultado"); // Pegando o elemento onde será exibido o resultado
  resultado.textContent = `Resultado: ${itens[indice]}`; // Exibindo o item sorteado na tela
}

// EventListener para o usuário apertar Enter após escrever o Item no input
const input = document.getElementById("item");
input.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    adicionarItem();
  }
});