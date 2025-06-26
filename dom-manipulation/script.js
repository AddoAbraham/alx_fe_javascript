const SERVER_API = "https://jsonplaceholder.typicode.com/posts";

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

async function fetchQuotesFromServer() {
  try {
    const res = await fetch(SERVER_API);
    const serverData = await res.json();

    // Simulate quote structure: title = text, userId = category
    const serverQuotes = serverData.slice(0, 10).map((post) => ({
      text: post.title,
      category: `Category ${post.userId}`,
    }));

    const localChanged = JSON.stringify(quotes);
    const serverChanged = JSON.stringify(serverQuotes);

    if (localChanged !== serverChanged) {
      quotes = serverQuotes;
      saveQuotes(); // Save to localStorage
      updateCategoryOptions(); // Update dropdowns
      populateCategories(); // Update filter
      showSyncMessage("🔁 Quotes updated from server (JSONPlaceholder).");
    }
  } catch (error) {
    console.error("❌ Failed to fetch from server:", error);
    showSyncMessage("⚠️ Could not sync with server.");
  }
}

function showSyncMessage(message) {
  const syncStatus = document.getElementById("syncStatus");
  syncStatus.textContent = message;
  syncStatus.style.display = "block";
  setTimeout(() => {
    syncStatus.style.display = "none";
  }, 5000);
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
  const textInput = document.getElementById("newQuoteText").value.trim();
  const categoryInput = document
    .getElementById("newQuoteCategory")
    .value.trim();

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push({ text, category });
    saveQuotes(); // Save to localStorage
    updateCategoryOptions(); // Update dropdown
    populateCategories(); // 🆕 New filter dropdown
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added!");
    // Clear inputs
    textInput.value = "";
    categoryInput.value = "";
    alert("✅ Quote added successfully!");

    // 🔄 Send the quote to the server
    postQuoteToServer(newQuote);
  } else {
    alert("❌ Please enter both quote text and category.");
  }
}

function postQuoteToServer(quote) {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: quote.text,
      body: quote.category,
      userId: 1, // Simulated user/category ID
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("✅ Quote sent to server:", data);
    })
    .catch((error) => {
      console.error("❌ Error sending quote to server:", error);
    });
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

function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map((q) => q.category))];
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes(); // Show filtered quotes immediately
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory); // Save selection

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  // Display first quote from filtered list (optional: show random)
  quoteDisplay.textContent = filteredQuotes[0].text;

  // Optionally: save it to sessionStorage as last viewed
  sessionStorage.setItem("lastQuote", filteredQuotes[0].text);
}

// Initialize on page load
loadQuotes();
updateCategoryOptions();
populateCategories(); // 🆕 Add this
createAddQuoteForm();
showLastViewedQuote();

// 🔄 Sync every 30 seconds
setInterval(fetchQuotesFromServer, 30000);

// 🔄 Initial fetch when page loads
fetchQuotesFromServer();
