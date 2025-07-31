
// Declarando array vazio para armazenar os itens posteriomente
const arrayDosItens = [];
// Array para armazenar itens que foram excluídos
const arrayDaLixeira = [];

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
  const list = document.getElementById("lista-de-itens");
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
  const itemRemovido = arrayDosItens.splice(itemX, 1)[0];
  arrayDaLixeira.push(itemRemovido);
  salvarItensNoStorage();
  salvarLixeiraNoStorage();
  atualizaLista();
}

function sortear() {
  if (arrayDosItens.length === 0) {
    alert("Adicione itens antes de sortear!");
    return;
  }

  const resultado = document.getElementById("resultado-do-sorteio");
  const botaoSortear = document.querySelector("button[onclick='sortear()']");
  const botaoCopiar = document.querySelector("button[onclick='copiarLista()']");
  const botaoExcluir = document.querySelector("button[onclick='excluirTudo()']");

  // Desabilita botões durante o suspense
  botaoSortear.disabled = true;
  botaoCopiar.disabled = true;
  botaoExcluir.disabled = true;

  let pontos = 0;
  resultado.textContent = "O gato está escolhendo";
  // Removendo a classe de animação se já tiver sido aplicada
  resultado.classList.remove("animar");

  resultado.classList.add("resultado-suspense"); // ativa a animação de cor da suspense

  // Loop com animação de pontinhos
  const suspense = setInterval(() => {
    pontos = (pontos + 1) % 4; // 0 → 1 → 2 → 3 → 0...
    resultado.textContent = "O gato vai escolher" + ".".repeat(pontos);
  }, 300);

  // Após 2.4 segundos, mostra o resultado
  setTimeout(() => {
    clearInterval(suspense);
    resultado.classList.remove("resultado-suspense");

    // .floor() arredonda para baixo o número gerado aleatoriamente
    /* .random() gera um número aleatório entre 0 e 1, 
    que é multiplicado pelo tamanho do array */
    const sorteio = Math.floor(Math.random() * arrayDosItens.length);

    const itemSorteado = arrayDosItens[sorteio];
    const resultadoDoSorteio = document.getElementById("resultado-do-sorteio");

    // Forçando o navegador a "reprocessar" o DOM e resetar a classe
    void resultadoDoSorteio.offsetWidth;
    // Reaplicando a classe para ativar a animação
    resultadoDoSorteio.classList.add("animar");

    resultadoDoSorteio.textContent = `O gato escolheu: ${itemSorteado}`;
    localStorage.setItem("resultadoNoStorage", itemSorteado);

    // Reabilita os botões
    botaoSortear.disabled = false;
    botaoCopiar.disabled = false;
    botaoExcluir.disabled = false;
  }, 2400);
}

function resortear() {
  const ultimoResultado = localStorage.getItem("resultadoNoStorage");

  if (!ultimoResultado) {
    alert("Nenhum sorteio anterior encontrado.");
    return;
  }

  const indiceAnterior = arrayDosItens.indexOf(ultimoResultado);

  if (indiceAnterior === -1) {
    alert("O item anterior já foi removido.");
    return;
  }

  // Remove o item anterior e envia para a lixeira
  const itemRemovido = arrayDosItens.splice(indiceAnterior, 1)[0];
  arrayDaLixeira.push(itemRemovido);

  // Atualiza localStorage
  salvarItensNoStorage();
  salvarLixeiraNoStorage();

  // Atualiza listas visuais
  atualizaLista();
  atualizaLixeira();

  // Chama um novo sorteio
  sortear();
}

function carregarResultadoNoStorage() {
  const resultadoSalvo = localStorage.getItem("resultadoNoStorage");
  if (resultadoSalvo) { // Se resultadoSalvo tiver valor
    document.getElementById("resultado-do-sorteio").textContent = `O gato escolheu: ${resultadoSalvo}`;
  }
}

function toggleExplicacao() {
  const explicacao = document.getElementById("explicacao-resortear");
  explicacao.classList.toggle("explicacao-visivel");
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
    arrayDaLixeira.push(...arrayDosItens); // Adiciona os itens atuais na lixeira
    arrayDosItens.length = 0; // Zera o arrayDosItens
    // localStorage.removeItem("itensNoStorage");
    localStorage.removeItem("resultadoNoStorage")
    salvarItensNoStorage();
    salvarLixeiraNoStorage();
    document.getElementById("resultado-do-sorteio").textContent = "";
    atualizaLista();
  }
}

function salvarLixeiraNoStorage() {
  localStorage.setItem("lixeiraDoRandomicat", JSON.stringify(arrayDaLixeira));
}

function carregarLixeiraDoStorage() {
  const lixoSalvo = localStorage.getItem("lixeiraDoRandomicat");
  if (lixoSalvo) {
    arrayDaLixeira.push(...JSON.parse(lixoSalvo));
    atualizaLixeira();
  }
}

function atualizaLixeira() {
  const listaLixeira = document.getElementById("lista-da-lixeira");
  listaLixeira.innerHTML = "";

  arrayDaLixeira.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;

    // Botão para excluir da lixeira
    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "🗑️";
    botaoRemover.addEventListener("click", () => {
      arrayDaLixeira.splice(index, 1);
      salvarLixeiraNoStorage();
      atualizaLixeira();
    });

    // Botão para recuperar o item
    const botaoRecuperar = document.createElement("button");
    botaoRecuperar.textContent = "↩️";
    botaoRecuperar.addEventListener("click", () => {
      const recuperado = arrayDaLixeira.splice(index, 1)[0];
      arrayDosItens.push(recuperado);
      salvarItensNoStorage();
      salvarLixeiraNoStorage();
      atualizaLixeira();
      atualizaLista();
    });

    // Container para os botões no lado direito
    const botoes = document.createElement("div");
    botoes.style.display = "flex";
    botoes.style.gap = "5px";
    botoes.appendChild(botaoRecuperar);
    botoes.appendChild(botaoRemover);

    li.textContent = item;
    li.appendChild(botoes);
    listaLixeira.appendChild(li);
  });
}

function esvaziarLixeira() {
  const confirma = confirm("Deseja esvaziar a lixeira?");
  if (confirma) {
    arrayDaLixeira.length = 0;
    salvarLixeiraNoStorage();
    atualizaLixeira();
  }
}

function recuperarTudo() {
  if (arrayDaLixeira.length === 0) {
    alert("A lixeira já está vazia.");
    return;
  }

  arrayDosItens.push(...arrayDaLixeira);
  arrayDaLixeira.length = 0;
  salvarItensNoStorage();
  salvarLixeiraNoStorage();
  atualizaLista();
  atualizaLixeira();
}

function mostrarLixeira() {
  document.getElementById("lixeira-container").style.display = "block";
  document.getElementById("lista-de-itens").style.display = "none";
  document.getElementById("resultado-do-sorteio").style.display = "none";
  atualizaLixeira();
}

function fecharLixeira() {
  document.getElementById("lixeira-container").style.display = "none";
  document.getElementById("lista-de-itens").style.display = "block";
  document.getElementById("resultado-do-sorteio").style.display = "block";
}

// Função recebendo o texto e o array do if na função adicionaItem()
function avisoDeItensDuplicados(textoDoAviso, arrayItensDuplicados = []) { 
  const avisoDeDuplicados = document.getElementById("aviso-de-duplicados");
  const textoAvisoDuplicados = document.getElementById("texto-aviso-duplicados");
  const listaDeDuplicados = document.getElementById("itens-duplicados");

  textoAvisoDuplicados.textContent = textoDoAviso;
  // Limpando a lista de duplicados antes de adicionar novos itens
  listaDeDuplicados.innerHTML = "";

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
carregarLixeiraDoStorage();