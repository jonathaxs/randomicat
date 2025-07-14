
// Declarando array vazio para armazenar os itens posteriomente
const arrayDosItens = [];

// Quando o usuário apertar Enter no input, adicionaItem()
const input = document.getElementById("item");
input.addEventListener("keyup", function(evento) {
  if (evento.key === "Enter") {
    adicionaItem();
  }
});

function salvarItensNoStorage() {
  /* .stringify() converte o array para JSON string
   localStorage só aceita strings, então é necessário converter o array para string */
  localStorage.setItem("itensNoStorage", JSON.stringify(arrayDosItens));
}

function atualizaLista() {
  const list = document.getElementById("listaDeItens");
  // Limpando a lista antes de atualizar por que o innerHTML é o conteúdo HTML dentro do elemento
  list.innerHTML = ""; 

  // forEach: para cada item do arrayDosItens, cria-se uma <li>
  arrayDosItens.forEach((item, posicaoDoItem) => {
    const li = document.createElement("li");
    li.textContent = item;

    // Criando também um botão de excluir em cada li
    const botaoExcluirItem = document.createElement("button");
    botaoExcluirItem.textContent = "🗑️";

    // Estilizando o botão de excluir (passar para o CSS depois **************************************************)
    botaoExcluirItem.style.marginLeft = "10px";

    // Ao clicar no botão de excluir, chama a função removeItem passando a posição do item
    botaoExcluirItem.addEventListener("click", () => {
      excluirItem(posicaoDoItem);
    });
    li.appendChild(botaoExcluirItem); // Acrescentando dentro do li o botão delete

    list.appendChild(li); // Por fim, acrescentando o <li> completo na <ul>
  });
}

function carregarItensDoStorage() { 
  const itensNoStorage = localStorage.getItem("itensNoStorage");
  if (itensNoStorage) { // Se itensNoStorage tiver valor
    // .parse() para converter a string JSON de volta para um array de código
    const arrayItensNoStorage = JSON.parse(itensNoStorage);
    /* ...(Spread Operator para espalhar um array dentro de outro)
     arrayItensNoStorage dentro de arrayDosItens */
    arrayDosItens.push(...arrayItensNoStorage); 
    atualizaLista();
  }
}

carregarItensDoStorage()

function adicionaItem() {
  const inputDosItens = document.getElementById("item");
  const textoDigitado = inputDosItens.value.trim(); // .trim() remove espaço em branco entre os itens

  if (textoDigitado === "") return; // Se o input estiver vazio, encerra a função

  const novosItens = textoDigitado.split(",")
    .map(item => item.trim()) // .map() pra dar um .trim() em cada item
    .filter(item => item !== ""); // .filter() pra filtrar itens diferentes de vazio

  const arrayItensDuplicados = [];
 
   novosItens.forEach(item => {
    if (!arrayDosItens.includes(item)) { // Se o arrayDosItens não(!) tem o novoItem
      arrayDosItens.push(item); // .push() adiciona o novoItem no arrayDosItens
    } else { // Se não, .push() pro arrayItensDuplicados array
      arrayItensDuplicados.push(item);
    }
  });

  salvarItensNoStorage();
  atualizaLista();
  inputDosItens.value = ""; // Limpando o input após adição

// Se o tamanho do arrayItensDuplicados for maior que 0; chamar função avisoDeItensDuplicados
  if (arrayItensDuplicados.length > 0) {
    avisoDeItensDuplicados("Os itens que já estão na lista não foram adicionados:", arrayItensDuplicados);
  }
}

function excluirItem(itemX) {
  // .splice() remove 1 elemento do parâmetro itemX, enviado da função atualizaLista()
  arrayDosItens.splice(itemX, 1);
  salvarItensNoStorage();
  atualizaLista();
}

function sortear() {
  if (arrayDosItens.length === 0) {
    alert("Adicione itens antes de sortear!");
    return;
  }
  // .floor() arredonda para baixo o número gerado aleatoriamente
  /* .random() gera um número aleatório entre 0 e 1, 
  que é multiplicado pelo tamanho do array */
  const sorteio = Math.floor(Math.random() * arrayDosItens.length);

  const itemSorteado = arrayDosItens[sorteio];
  const resultadoDoSorteio = document.getElementById("resultado-do-sorteio");
  resultadoDoSorteio.textContent = `O gato escolheu: ${arrayDosItens[sorteio]}`;
  localStorage.setItem("resultadoNoStorage", itemSorteado);
}

function carregarResultadoNoStorage() {
  const resultadoSalvo = localStorage.getItem("resultadoNoStorage");
  if (resultadoSalvo) { // Se resultadoSalvo tiver valor
    document.getElementById("resultado-do-sorteio").textContent = `O gato escolheu: ${resultadoSalvo}`;
  }
}

carregarResultadoNoStorage();

function copiarLista() {
  if (arrayDosItens.length === 0) {
    alert("Não tem nenhum item para copiar!");
    return;
  }
  const copiaLista = arrayDosItens.join(", "); // .join() converte o arrayDosItens em uma string separada por vírgulas
  navigator.clipboard.writeText(copiaLista) // .navigator.clipboard.writeText() copia o texto pro clipboard
    .then(() => { // .then() é chamado quando navigator.clipboard.writeText() é bem-sucedido
      alert("Lista copiada!");
    })
    .catch(() => { // Quando há erro, .catch() é chamado
      alert("Falha ao copiar.");
    });
}

function excluirTudo() {
  // confirm() é um alerta que pergunta ao usuário se ele tem certeza
  const confirmaExclusao = confirm("Tem certeza que deseja excluir tudo?");
  if (confirmaExclusao) { // Se confirmaExclusao for true
    arrayDosItens.length = 0; // Zera o arrayDosItens
    localStorage.removeItem("itensNoStorage");
    localStorage.removeItem("resultadoNoStorage");
    document.getElementById("resultado-do-sorteio").textContent = "";
    atualizaLista();
  }
}

// Função recebendo o texto e o array do if na função adicionaItem()
function avisoDeItensDuplicados(textoDoAviso, arrayItensDuplicados = []) { 
  const avisoDeDuplicados = document.getElementById("aviso-de-duplicados");
  const textoAvisoDuplicados = document.getElementById("texto-aviso-duplicados");
  const listaDeDuplicados = document.getElementById("itens-duplicados");

  textoAvisoDuplicados.textContent = textoDoAviso;

  arrayItensDuplicados.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    listaDeDuplicados.appendChild(li);
  });  
  // Alterando a exibição do aviso de erro de none para flex
  avisoDeDuplicados.style.display = "flex";
}

// Ao clicar no botão fechar-aviso, display none
document.getElementById("fechar-aviso-duplicados").addEventListener("click", () => {
  document.getElementById("aviso-de-duplicados").style.display = "none";
});

// Função para detectar o tema salvo ou a preferência do usuário no sistema
function iniciarTema() {
  const temaSalvoNoStorage = localStorage.getItem("temaSalvoNoStorage");
  const modoEscuro = window.matchMedia("(prefers-color-scheme: dark)").matches; // .matches retorna true ou false

  /* Se temaSalvoNoStorage tiver valor, usa ele; se não, verifica se modoEscuro é true (?)
  Se não(:), usa "claro" como tema padrão */
  const temaEscolhido = temaSalvoNoStorage || (modoEscuro ? "escuro" : "claro"); 
  aplicarTema(temaEscolhido);
}

function aplicarTema(temaEscolhido) {
  document.body.classList.toggle("escuro", temaEscolhido === "escuro");
  const button = document.getElementById("troca-tema");
  button.textContent = temaEscolhido === "escuro" ? "☀️" : "🌙";
}

// Trocar tema quando o botão de tema for clicado
document.getElementById("troca-tema").addEventListener("click", () => {
  const modoEscuro = document.body.classList.contains("escuro");
  const novoTema = modoEscuro ? "claro" : "escuro";
  aplicarTema(novoTema);
  localStorage.setItem("temaSalvoNoStorage", novoTema);
});

iniciarTema();