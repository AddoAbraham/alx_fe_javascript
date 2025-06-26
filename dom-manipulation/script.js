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
}

// Add a new quote and category
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
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
