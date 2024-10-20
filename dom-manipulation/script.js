const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL

// Function to load quotes from local storage
const loadQuotes = () => {
    const storedQuotes = localStorage.getItem('quotes');
    return storedQuotes ? JSON.parse(storedQuotes) : [];
};

// Initialize the quotes array from local storage
let quotes = loadQuotes();

// Function to save quotes to local storage
const saveQuotes = () => {
    localStorage.setItem('quotes', JSON.stringify(quotes));
};

// Function to fetch quotes from the simulated server
const fetchQuotesFromServer = async () => {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // Map the API data to match your quote structure
        return data.map(item => ({
            text: item.title,  // Use title as the quote text
            category: 'General' // Assign a default category or adjust as needed
        }));
    } catch (error) {
        console.error('Error fetching quotes:', error);
        return [];
    }
};

// Function to sync fetched quotes with local storage
const syncQuotes = (fetchedQuotes) => {
    const existingQuotes = loadQuotes();
    const combinedQuotes = [];

    fetchedQuotes.forEach(fetchedQuote => {
        const existingQuote = existingQuotes.find(q => q.text === fetchedQuote.text);
        if (existingQuote) {
            // Conflict detected, prefer the server quote
            notifyUser(`Conflict resolved: "${existingQuote.text}" was replaced by the server's version.`);
            combinedQuotes.push(fetchedQuote);
        } else {
            combinedQuotes.push(fetchedQuote);
        }
    });

    quotes = combinedQuotes;
    saveQuotes(); // Save updated quotes array to local storage
    displayQuotes(); // Update displayed quotes
};

// Function to notify the user
const notifyUser = (message) => {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';

    // Hide notification after a few seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
};

// Function to display quotes based on selected category
const filterQuotes = (category) => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear existing quotes

    const filteredQuotes = category ? quotes.filter(quote => quote.category === category) : quotes;

    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.textContent = `"${quote.text}" - Category: ${quote.category}`;
        quoteDisplay.appendChild(quoteElement);
    });

    // Save last selected category to local storage
    localStorage.setItem('lastSelectedCategory', category);
};

// Function to display all quotes
const displayQuotes = () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear existing quotes
    quotes.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.textContent = `"${quote.text}" - Category: ${quote.category}`;
        quoteDisplay.appendChild(quoteElement);
    });

    // Restore last selected category
    const lastCategory = localStorage.getItem('lastSelectedCategory');
    if (lastCategory) {
        document.getElementById('categoryFilter').value = lastCategory;
        filterQuotes(lastCategory);
    }
};

// Function to add a new quote
const createAddQuoteForm = (text, category) => {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes(); // Save updated quotes array to local storage
    populateCategories(); // Update categories after adding a new quote
    displayQuotes(); // Refresh quotes display
};

// Function to populate categories dynamically
const populateCategories = () => {
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = ''; // Clear existing options
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'All Categories';
    categoryFilter.appendChild(defaultOption);

    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
};

// Function to start periodic fetching from the server
const startPeriodicFetching = () => {
    setInterval(async () => {
        const newQuotes = await fetchQuotesFromServer();
        syncQuotes(newQuotes);
    }, 30000); // Every 30 seconds
};

// Event listener for the form submission
document.getElementById('quoteForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission
    const text = document.getElementById('quoteText').value;
    const category = document.getElementById('quoteCategory').value;

    createAddQuoteForm(text, category);

    // Clear the input fields
    document.getElementById('quoteText').value = '';
    document.getElementById('quoteCategory').value = '';
});

// Event listener for showing a random quote
document.getElementById('randomQuoteButton').addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `"${randomQuote.text}" - <strong>Category:</strong> ${randomQuote.category}`;
});

// Event listener for exporting quotes
document.getElementById('exportButton').addEventListener('click', () => {
    const json = JSON.stringify(quotes, null, 2); // Pretty print JSON
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up
});

// Event listener for importing quotes
document.getElementById('importInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                quotes = importedQuotes; // Update quotes array
                saveQuotes(); // Save to local storage
                displayQuotes(); // Update the display
                populateCategories(); // Update category filter
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Invalid JSON file. Please try again.');
            }
        };
        reader.readAsText(file);
    }
});

// Event listener for category filtering
document.getElementById('categoryFilter').addEventListener('change', (e) => {
    const selectedCategory = e.target.value;
    filterQuotes(selectedCategory);
});

// Start fetching from the server
startPeriodicFetching();

// Display existing quotes and populate categories when the application initializes
displayQuotes();
populateCategories();
