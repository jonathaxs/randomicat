// Array vazio para armazenar os itens
const items = [];


// EventListener para quando o usuário apertar Enter no input e adcionar os itens
const input = document.getElementById("item");
input.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    addItem();
  }
});

function saveItemsToStorage() {
  // .stringify() converte o array para JSON string, que é necessário para o localStorage
  localStorage.setItem("localRandomicatItems", JSON.stringify(items));
}

function updateList() {
  const list = document.getElementById("list");
  list.innerHTML = ""; // Limpando a lista para reconstrui-la do zero

  // forEach para cada item do array, cria uma li
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;

    // Criando junto um botão de excluir em cada li
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️";
    deleteButton.style.marginLeft = "10px";
    deleteButton.addEventListener("click", () => {
      removeItem(index); // Este botão é passado para a função removeItem()
    });
    li.appendChild(deleteButton); // Acrescentando dentro do li o botão delete <li>

    list.appendChild(li); // Acrescentando o li na ul
  });
}

function loadItemsFromStorage() { 
  const localRandomicatItems = localStorage.getItem("localRandomicatItems");
  if (localRandomicatItems) {
    // .parse() to convert the JSON string back to an js array
    // .parse() é o contrário de stringfy, converte JSON string para Array de código
    const parsedLocalRandomicatItems = JSON.parse(localRandomicatItems);
    // ...(spread operator para espalhar os itens do array parsedLocalRandomicatItems no outro array items)
    items.push(...parsedLocalRandomicatItems); 
    updateList();
  }
}

loadItemsFromStorage()

function addItem() {
  const inputOfItem = document.getElementById("item");
  const typedText = inputOfItem.value.trim(); // .trim() remove espaço em branco entre eles

  if (typedText === "") return;

  const newItems = typedText.split(",")
    .map(item => item.trim()) // .map() pra dar um .trim() em cada item
    .filter(item => item !== ""); // .filter() pra filtrar itens diferentes de vazio

  const duplicateItems = [];
 
   newItems.forEach(item => {
    if (!items.includes(item)) { // Se se o array items não(!) tem o novo item digitado
      items.push(item); // Ai adiciona o novo item
    } else { // Se não, .push() pro duplicateItems array
      duplicateItems.push(item);
    }
  });

  saveItemsToStorage();
  updateList();
  inputOfItem.value = ""; // Limpando o input

  if (duplicateItems.length > 0) { // Se o tamanho do array de itens duplicados for maior que zero, chamar função showDuplicateItemsMessage
    showDuplicateItemsMessage("The items already on the list have not been added:", duplicateItems);
  }
}

function removeItem(index) {
  // .splice() remove 1 item do index(que vem da função updateList())
  items.splice(index, 1);
  saveItemsToStorage();
  updateList();
}

function randomicat() {
  if (items.length === 0) {
    alert("Add items before calling randomicat!");
    return;
  }
  // .floor() rounds down the result of the multiplication
  /* .random() generates a random number between 0 and 1, 
        which is then multiplied by the length of the items array */
  const index = Math.floor(Math.random() * items.length);

  const chosenItem = items[index];
  const resultTheCatChose = document.getElementById("result-the-cat-chose");
  resultTheCatChose.textContent = `The cat chose: ${items[index]}`;
  localStorage.setItem("localRandomicatResult", chosenItem);
}

function loadResultFromStorage() {
  const savedResult = localStorage.getItem("localRandomicatResult");
  if (savedResult) { // If savedResult is not null
    document.getElementById("result-the-cat-chose").textContent = `The cat chose: ${savedResult}`;
  }
}

loadResultFromStorage();

function copyList() {
  if (items.length === 0) {
    alert("There's nothing to copy!");
    return;
  }

  const textToCopy = items.join(", "); // .join() to convert the array to a string with commas and spaces
  navigator.clipboard.writeText(textToCopy) // .navigator.clipboard.writeText() to copy the text to clipboard
    .then(() => { // .then() is called when navigator.clipboard.writeText() succeeds
      alert("List copied to clipboard!");
    })
    .catch(() => { // When fails
      alert("Failed to copy the list.");
    });
}

function clearAll() {
  // confirm is an alert with a confirmation dialog
  const confirmer = confirm("Are you sure you want to delete all items?");
  if (confirmer) { // If confirm is true
    items.length = 0; // Clean the array(items)
    localStorage.removeItem("localRandomicatItems"); // Clean the localStorage
    document.getElementById("result-the-cat-chose").textContent = ""; // clear UI
    updateList();
  }
}

// Receiving the text and array from if in the addItem() function
function showDuplicateItemsMessage(text, duplicateArrayList = []) { 
  const errorMessageDiv = document.getElementById("error-message");
  const errorMessageTextSpan = document.getElementById("error-message-text");
  const ulOfDuplicates = document.getElementById("duplicate-items");

  errorMessageTextSpan.textContent = text;

  duplicateArrayList.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ulOfDuplicates.appendChild(li);
  });  
  // Changing the div style display from none to flex to show the content
  errorMessageDiv.style.display = "flex"; 
}

// Click on X hides the error message
document.getElementById("close-message").addEventListener("click", () => {
  document.getElementById("error-message").style.display = "none";
});

// Func to detects the saved theme or the user's preference
function initTheme() {
  const savedTheme = localStorage.getItem("randomicat-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches; // .matches return true or false

  const theme = savedTheme || (prefersDark ? "dark" : "light"); // savedTheme first, if not, then prefersDark condition
  applyTheme(theme);
}

// Function to apply the theme based on the user's choice
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  const button = document.getElementById("theme-toggle");
  button.textContent = theme === "dark" ? "☀️" : "🌙";
}

// Toggle theme when the button is clicked
document.getElementById("theme-toggle").addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  const newTheme = isDark ? "light" : "dark";
  applyTheme(newTheme);
  localStorage.setItem("randomicat-theme", newTheme);
});

initTheme();