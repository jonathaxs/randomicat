// Array vazio para armazenar os itens
const items = [];

// EventListener for the user press return after typing the item in the input
const input = document.getElementById("item");
input.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    addItem();
  }
});

function saveItemsToStorage() {
  // .stringify() to convert the array to a JSON string, which is required for localStorage
  localStorage.setItem("localRandomicatItems", JSON.stringify(items));
}

function updateList() {
  const list = document.getElementById("list");
  list.innerHTML = ""; // Cleaning the list for rebuild it from scratch

  // forEach to iterate over the items array
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;

    // Creating delete button aside every item
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️";
    deleteButton.style.marginLeft = "10px";
    deleteButton.addEventListener("click", () => {
      removeItem(index); // The button index is passed to the removeItem function
    });
    li.appendChild(deleteButton); // Appending delete button inside every <li>

    list.appendChild(li); // Appending full <li> to the list(<ul>)
  });
}

function loadItemsFromStorage() { 
  const localRandomicatItems = localStorage.getItem("localRandomicatItems");
  if (localRandomicatItems) {
    // .parse() to convert the JSON string back to an js array
    const parsedLocalRandomicatItems = JSON.parse(localRandomicatItems);
    // Spread operator(...) required when array(parsedLocalRandomicatItems) .push array(items)
    items.push(...parsedLocalRandomicatItems); 
    updateList();
  }
}

loadItemsFromStorage()

function addItem() {
  const inputOfItem = document.getElementById("item");
  const typedText = inputOfItem.value.trim(); // /trim() removes whitespace between

  if (typedText === "") return;

  const newItems = typedText.split(",")
    .map(item => item.trim()) // .map() to .trim() each item
    .filter(item => item !== ""); // .filter() to filter not-empty items

  const duplicateItems = [];
 
   newItems.forEach(item => {
    if (!items.includes(item)) { // If items not-includes(item)
      items.push(item); // So, add item to the items's array
    } else { // Else, .push() to the duplicateItems array
      duplicateItems.push(item);
    }
  });

  saveItemsToStorage();
  updateList();
  inputOfItem.value = ""; // Cleaning the input field after adding items

  // Verifying if there are duplicate items to show duplicate items message
  if (duplicateItems.length > 0) { 
    showDuplicateItemsMessage("The items already on the list have not been added:", duplicateItems);
  }
}

function removeItem(index) {
  // .splice() remove item at the specified index(coming from the button in updateList())
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