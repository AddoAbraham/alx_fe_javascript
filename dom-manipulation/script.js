// Load from localStorage
function loadQuotes() {
  const savedQuotes = localStorage.getItem("quotes");
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  } else {
    quotes = [
      {
        text: "The best way to predict the future is to create it.",
        category: "Motivation",
      },
      { text: "JavaScript is fun!", category: "Tech" },
      {
        text: "Life is 10% what happens and 90% how we react to it.",
        category: "Life",
      },
    ];
    saveQuotes();
  }
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Initial quote list
let quotes = [
  {
    text: "The best way to predict the future is to create it.",
    category: "Motivation",
  },
  { text: "JavaScript is fun!", category: "Tech" },
  {
    text: "Life is 10% what happens and 90% how we react to it.",
    category: "Life",
  },
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelect = document.getElementById("categorySelect");
const newQuoteBtn = document.getElementById("newQuote");

// Populate dropdown with categories
function updateCategoryOptions() {
  categorySelect.innerHTML = ""; // Clear old options
  const categories = [...new Set(quotes.map((q) => q.category))];
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Show a random quote from selected category
function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  const filtered = quotes.filter((q) => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes found in this category.";
    return;
  }

  const random = Math.floor(Math.random() * filtered.length);
  quoteDisplay.textContent = filtered[random].text;

  quoteDisplay.textContent = selectedQuote;

  // Save last quote to sessionStorage
  sessionStorage.setItem("lastQuote", selectedQuote);
}

function showLastViewedQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    quoteDisplay.textContent = last;
  }
}

// Add a new quote and category
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes(); // Save to localStorage
    updateCategoryOptions(); // Update dropdown
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added!");
  } else {
    alert("Please enter both quote and category.");
  }
}

// Setup event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize dropdown when page loads
updateCategoryOptions();

function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteFormContainer");

  const heading = document.createElement("h3");
  heading.textContent = "Add a new quote";

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  // Add to form container
  formContainer.appendChild(heading);
  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// Initialize on load
updateCategoryOptions();
createAddQuoteForm(); // 👈 Add this

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        updateCategoryOptions();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (error) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
