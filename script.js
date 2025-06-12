const itens = [];

function adicionarItem() {
  const input = document.getElementById("item");
  if (input.value.trim() !== "") {
    itens.push(input.value.trim());
    atualizarLista();
    input.value = "";
  }
}

function atualizarLista() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  itens.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    lista.appendChild(li);
  });
}

function sortear() {
  if (itens.length === 0) {
    alert("Adicione itens antes de sortear!");
    return;
  }
  const indice = Math.floor(Math.random() * itens.length);
  const resultado = document.getElementById("resultado");
  resultado.textContent = `Resultado: ${itens[indice]}`;
}